import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AssignmentService } from './assignment.service';
import { assignmentFilterableFields } from './assignment.constant';

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

const createAssignment = catchAsync(async (req: Request, res: Response) => {
  const adminId = req.user!.id;
  const result = await AssignmentService.createAssignment(req.body, adminId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Assignment created successfully',
    data: result,
  });
});

const getAllAssignments = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query as Record<string, unknown>, assignmentFilterableFields);
  const paginationOptions = pick(req.query as Record<string, unknown>, [
    'page',
    'limit',
    'sortBy',
    'sortOrder',
  ]);

  const result = await AssignmentService.getAllAssignments(filters, paginationOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Assignments retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleAssignment = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await AssignmentService.getSingleAssignment(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Assignment details retrieved successfully',
    data: result,
  });
});

const getMyBatchAssignments = catchAsync(async (req: Request, res: Response) => {
  const studentId = req.user!.id;
  const result = await AssignmentService.getMyBatchAssignments(studentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Batch assignments retrieved successfully',
    data: result,
  });
});

const updateAssignmentMentors = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await AssignmentService.updateAssignmentMentors(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Assignment mentors updated successfully',
    data: result,
  });
});

const getActiveMentors = catchAsync(async (_req: Request, res: Response) => {
  const result = await AssignmentService.getActiveMentors();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Active mentors retrieved successfully',
    data: result,
  });
});

const updateAssignment = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await AssignmentService.updateAssignment(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Assignment updated successfully',
    data: result,
  });
});

const deleteAssignment = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await AssignmentService.deleteAssignment(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Assignment and all associated records deleted successfully',
    data: result,
  });
});

export const AssignmentController = {
  createAssignment,
  getAllAssignments,
  getSingleAssignment,
  getMyBatchAssignments,
  updateAssignmentMentors,
  getActiveMentors,
  updateAssignment,
  deleteAssignment,
};

