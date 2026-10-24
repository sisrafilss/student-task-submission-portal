import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { mentorFilterableFields } from './mentor.constant';
import { MentorService } from './mentor.service';

const paginationFields = ['page', 'limit', 'sortBy', 'sortOrder'];

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

const createMentor = catchAsync(async (req: Request, res: Response) => {
  const result = await MentorService.createMentorIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Mentor onboarded successfully',
    data: result,
  });
});

const getAllMentors = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query as Record<string, unknown>, mentorFilterableFields);
  const paginationOptions = pick(req.query as Record<string, unknown>, paginationFields);

  const result = await MentorService.getAllMentorsFromDB(filters, paginationOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mentors retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getMentorSpecializations = catchAsync(async (_req: Request, res: Response) => {
  const result = await MentorService.getMentorSpecializationsFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mentor specializations retrieved successfully',
    data: result,
  });
});

const getSingleMentor = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await MentorService.getSingleMentorFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mentor profile retrieved successfully',
    data: result,
  });
});

const updateMentor = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await MentorService.updateMentorIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mentor details updated successfully',
    data: result,
  });
});

const deleteMentor = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await MentorService.deleteMentorFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mentor removed successfully',
    data: result,
  });
});

export const MentorController = {
  createMentor,
  getAllMentors,
  getMentorSpecializations,
  getSingleMentor,
  updateMentor,
  deleteMentor,
};

