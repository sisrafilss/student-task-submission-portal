import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { DashboardService } from './dashboard.service';

const getAdminDashboard = catchAsync(async (_req: Request, res: Response) => {
  const result = await DashboardService.getAdminDashboardStats();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin dashboard stats retrieved successfully',
    data: result,
  });
});

const getMentorDashboard = catchAsync(async (req: Request, res: Response) => {
  const mentorId = req.user!.id;
  const result = await DashboardService.getMentorDashboardStats(mentorId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mentor dashboard stats retrieved successfully',
    data: result,
  });
});

const getStudentDashboard = catchAsync(async (req: Request, res: Response) => {
  const studentId = req.user!.id;
  const result = await DashboardService.getStudentDashboardStats(studentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student dashboard stats retrieved successfully',
    data: result,
  });
});

export const DashboardController = {
  getAdminDashboard,
  getMentorDashboard,
  getStudentDashboard,
};

