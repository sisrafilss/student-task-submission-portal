import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import ApiError from '../../errors/ApiError';
import { UserService } from './user.service';

const getMe = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication token missing or invalid');
  }

  const result = await UserService.getMe(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile retrieved successfully',
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication token missing or invalid');
  }

  const result = await UserService.updateProfile(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

const updateAvatar = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication token missing or invalid');
  }

  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please provide an image file to upload');
  }

  const result = await UserService.updateAvatar(
    userId,
    req.file.buffer,
    req.file.originalname
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile photo updated successfully',
    data: result,
  });
});

export const UserController = {
  getMe,
  updateProfile,
  updateAvatar,
};

