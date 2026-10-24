import { Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../../config';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './auth.service';

const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const isProduction = config.env === 'production';

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

const registerStudent = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.registerStudent(req.body);
  const { accessToken, refreshToken } = result;

  setAuthCookies(res, accessToken, refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Student account registered successfully!',
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);
  const { accessToken, refreshToken } = result;

  setAuthCookies(res, accessToken, refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.user.needsPasswordChange
      ? 'Login successful. Please update your temporary password to continue.'
      : 'User logged in successfully!',
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  const result = await AuthService.changePassword(userId, req.body);
  const { accessToken, refreshToken } = result;

  setAuthCookies(res, accessToken, refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully! You can now access your dashboard.',
    data: result,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  const result = await AuthService.refreshToken(token);

  if (result.refreshToken) {
    setAuthCookies(res, result.accessToken, result.refreshToken);
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'New access token generated successfully!',
    data: result,
  });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;
  if (token) {
    await AuthService.logoutUser(token);
  }

  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/' });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged out successfully!',
    data: null,
  });
});

export const AuthController = {
  registerStudent,
  loginUser,
  changePassword,
  refreshToken,
  logoutUser,
};

