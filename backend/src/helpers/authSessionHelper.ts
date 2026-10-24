import { Secret } from 'jsonwebtoken';
import config from '../config';
import prisma from '../shared/prisma';
import { createToken } from './jwtHelpers';
import { IAuthUserResponse } from '../app/modules/auth/auth.interface';
import { UserRole } from '@prisma/client';

export interface IUserSessionEntity {
  id: string;
  name?: string | null;
  email: string;
  role: UserRole;
  needsPasswordChange: boolean;
}

export const formatAuthUser = (user: IUserSessionEntity): IAuthUserResponse => {
  return {
    id: user.id,
    name: user.name || '',
    email: user.email,
    role: user.role,
    needsPasswordChange: user.needsPasswordChange,
  };
};

export const generateTokensAndCreateSession = async (
  user: IUserSessionEntity
): Promise<{ accessToken: string; refreshToken: string }> => {
  const tokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    needsPasswordChange: user.needsPasswordChange,
  };

  const accessToken = createToken(
    tokenPayload,
    config.jwt.secret as Secret,
    config.jwt.expires_in
  );

  const refreshToken = createToken(
    tokenPayload,
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in
  );

  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt,
    },
  });

  return { accessToken, refreshToken };
};

