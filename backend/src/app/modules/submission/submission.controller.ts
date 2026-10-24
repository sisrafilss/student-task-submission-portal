import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { SubmissionService } from './submission.service';
import { submissionFilterableFields } from './submission.constant';

const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Partial<T> => {
  const finalObj: Partial<T> = {};
  for (const key of keys) {
    if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key];
    }
  }
  return finalObj;
};

const submitAssignment = catchAsync(async (req: Request, res: Response) => {
  const studentId = req.user!.id;
  const result = await SubmissionService.submitAssignment(req.body, studentId);

  const isAssigned = !!result.mentorId;
  const message = isAssigned
    ? 'Assignment submitted and assigned to mentor successfully'
    : 'Assignment submitted to unassigned queue (mentors at capacity)';

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message,
    data: result,
  });
});

const getMySubmissions = catchAsync(async (req: Request, res: Response) => {
  const studentId = req.user!.id;
  const paginationOptions = pick(req.query as Record<string, unknown>, [
    'page',
    'limit',
    'sortBy',
    'sortOrder',
  ]);

  const result = await SubmissionService.getMySubmissions(studentId, paginationOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My submissions retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getAssignedSubmissions = catchAsync(async (req: Request, res: Response) => {
  const mentorId = req.user!.id;
  const filters = pick(req.query as Record<string, unknown>, submissionFilterableFields);
  const paginationOptions = pick(req.query as Record<string, unknown>, [
    'page',
    'limit',
    'sortBy',
    'sortOrder',
  ]);

  const result = await SubmissionService.getAssignedSubmissions(
    mentorId,
    filters,
    paginationOptions
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Assigned submissions retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const reviewSubmission = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const mentorId = req.user!.id;
  const result = await SubmissionService.reviewSubmission(id, req.body, mentorId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Submission reviewed successfully',
    data: result,
  });
});

const getAllSubmissions = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query as Record<string, unknown>, submissionFilterableFields);
  const paginationOptions = pick(req.query as Record<string, unknown>, [
    'page',
    'limit',
    'sortBy',
    'sortOrder',
  ]);

  const result = await SubmissionService.getAllSubmissions(filters, paginationOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Submissions retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleSubmission = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const user = req.user!;
  const result = await SubmissionService.getSingleSubmission(id, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Submission details retrieved successfully',
    data: result,
  });
});

const getMentorStats = catchAsync(async (req: Request, res: Response) => {
  const mentorId = req.user!.id;
  const result = await SubmissionService.getMentorStats(mentorId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mentor submission stats retrieved successfully',
    data: result,
  });
});

export const SubmissionController = {
  submitAssignment,
  getMySubmissions,
  getAssignedSubmissions,
  reviewSubmission,
  getAllSubmissions,
  getSingleSubmission,
  getMentorStats,
};

