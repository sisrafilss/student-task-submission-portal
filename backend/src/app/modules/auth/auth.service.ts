import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { verifyToken } from '../../../helpers/jwtHelpers';
import { comparePassword, hashPassword } from '../../../helpers/passwordHelpers';
import {
  formatAuthUser,
  generateTokensAndCreateSession,
} from '../../../helpers/authSessionHelper';
import prisma from '../../../shared/prisma';
import ApiError from '../../errors/ApiError';
import {
  IChangePasswordPayload,
  ILoginResponse,
  ILoginUserPayload,
  IRefreshTokenResponse,
  IRegisterUserPayload,
} from './auth.interface';

const registerStudent = async (payload: IRegisterUserPayload): Promise<ILoginResponse> => {
  const isUserExist = await prisma.user.findUnique({
    where: { email: payload.email.toLowerCase().trim() },
  });

  if (isUserExist) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'An account with this email address already exists. Please sign in instead.'
    );
  }

  const hashedPassword = await hashPassword(payload.password);

  const newUser = await prisma.user.create({
    data: {
      name: payload.name.trim(),
      email: payload.email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'STUDENT',
      status: 'ACTIVE',
      needsPasswordChange: false,
    },
  });

  const { accessToken, refreshToken } = await generateTokensAndCreateSession(newUser);

  return {
    user: formatAuthUser(newUser),
    accessToken,
    refreshToken,
  };
};

const loginUser = async (payload: ILoginUserPayload): Promise<ILoginResponse> => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email.toLowerCase().trim() },
  });

  if (!user) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Invalid email or password. Please verify your credentials.'
    );
  }

  if (user.status === 'BLOCKED') {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'Your account has been blocked. Please contact portal administrator.'
    );
  }

  const isPasswordMatched = await comparePassword(payload.password, user.password);
  if (!isPasswordMatched) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'Invalid email or password. Please verify your credentials.'
    );
  }

  const { accessToken, refreshToken } = await generateTokensAndCreateSession(user);

  return {
    user: formatAuthUser(user),
    accessToken,
    refreshToken,
  };
};

const changePassword = async (
  userId: string,
  payload: IChangePasswordPayload
): Promise<ILoginResponse> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User account not found');
  }

  const isPasswordMatched = await comparePassword(payload.oldPassword, user.password);
  if (!isPasswordMatched) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Current password does not match our records'
    );
  }

  const newHashedPassword = await hashPassword(payload.newPassword);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      password: newHashedPassword,
      needsPasswordChange: false,
    },
  });

  // Revoke previous refresh tokens for security
  await prisma.refreshToken.updateMany({
    where: { userId, revoked: false },
    data: { revoked: true },
  });

  const { accessToken, refreshToken } = await generateTokensAndCreateSession(updatedUser);

  return {
    user: formatAuthUser(updatedUser),
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken;
  try {
    verifiedToken = verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    ) as { id: string; email: string; role: string };
  } catch {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid or expired refresh token');
  }

  const storedToken = await prisma.refreshToken.findFirst({
    where: { token, revoked: false },
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Refresh token has been revoked or expired');
  }

  const user = await prisma.user.findUnique({
    where: { id: verifiedToken.id },
  });

  if (!user || user.status === 'BLOCKED') {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User is unauthorized or blocked');
  }

  // Rotate refresh token
  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { revoked: true },
  });

  const { accessToken, refreshToken: newRefreshToken } =
    await generateTokensAndCreateSession(user);

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

const logoutUser = async (token: string): Promise<void> => {
  if (token) {
    await prisma.refreshToken.updateMany({
      where: { token },
      data: { revoked: true },
    });
  }
};

export const AuthService = {
  registerStudent,
  loginUser,
  changePassword,
  refreshToken,
  logoutUser,
};

