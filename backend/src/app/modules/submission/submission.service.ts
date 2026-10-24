import httpStatus from 'http-status';
import { Prisma } from '@prisma/client';
import prisma from '../../../shared/prisma';
import ApiError from '../../errors/ApiError';
import { calculatePagination, IPaginationOptions } from '../../../helpers/paginationHelper';
import { assignMentorAtomic } from './submission.distribution';
import { submissionSearchableFields } from './submission.constant';
import {
  IAssignMentorPayload,
  IReviewSubmissionPayload,
  ISubmissionFilterRequest,
} from './submission.interface';

const submitAssignment = async (
  payload: Omit<IAssignMentorPayload, 'studentId'>,
  studentId: string
) => {
  return await assignMentorAtomic({
    ...payload,
    studentId,
  });
};

const getMySubmissions = async (
  studentId: string,
  paginationOptions: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);

  const whereConditions: Prisma.SubmissionWhereInput = {
    studentId,
  };

  const [total, data] = await Promise.all([
    prisma.submission.count({ where: whereConditions }),
    prisma.submission.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
            totalMarks: true,
            batchId: true,
            deadline: true,
          },
        },
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data,
  };
};

const getAssignedSubmissions = async (
  mentorId: string,
  filters: ISubmissionFilterRequest,
  paginationOptions: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);
  const { searchTerm, status, assignmentId } = filters;

  const andConditions: Prisma.SubmissionWhereInput[] = [{ mentorId }];

  if (status) {
    andConditions.push({ status: status as Prisma.EnumSubmissionStatusFilter });
  }

  if (assignmentId) {
    andConditions.push({ assignmentId });
  }

  if (searchTerm) {
    andConditions.push({
      OR: submissionSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: 'insensitive' },
      })),
    });
  }

  const whereConditions: Prisma.SubmissionWhereInput = { AND: andConditions };

  const [total, data] = await Promise.all([
    prisma.submission.count({ where: whereConditions }),
    prisma.submission.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        assignment: {
          select: {
            id: true,
            title: true,
            totalMarks: true,
            rubrics: true,
            deadline: true,
          },
        },
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            assignedBatchId: true,
            avatarUrl: true,
          },
        },
      },
    }),
  ]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data,
  };
};

const reviewSubmission = async (
  submissionId: string,
  payload: IReviewSubmissionPayload,
  mentorId: string
) => {
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
  });

  if (!submission) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Submission not found');
  }

  if (submission.mentorId !== mentorId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You are not authorized to review this submission'
    );
  }

  const updatedSubmission = await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: payload.status,
      marks: payload.marks !== undefined ? payload.marks : submission.marks,
      feedback: payload.feedback !== undefined ? payload.feedback : submission.feedback,
      reviewedAt: new Date(),
    },
    include: {
      assignment: { select: { id: true, title: true, totalMarks: true } },
      student: { select: { id: true, name: true, email: true } },
    },
  });

  return updatedSubmission;
};

const getAllSubmissions = async (
  filters: ISubmissionFilterRequest,
  paginationOptions: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);
  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.SubmissionWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: submissionSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: 'insensitive' },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: { equals: (filterData as Record<string, unknown>)[key] },
      })),
    });
  }

  const whereConditions: Prisma.SubmissionWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const [total, data] = await Promise.all([
    prisma.submission.count({ where: whereConditions }),
    prisma.submission.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        assignment: { select: { id: true, title: true } },
        student: { select: { id: true, name: true, email: true } },
        mentor: { select: { id: true, name: true, email: true } },
      },
    }),
  ]);

  return {
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    data,
  };
};

const getSingleSubmission = async (id: string, user: { id: string; role: string }) => {
  const submission = await prisma.submission.findUnique({
    where: { id },
    include: {
      assignment: true,
      student: { select: { id: true, name: true, email: true } },
      mentor: { select: { id: true, name: true, email: true } },
    },
  });

  if (!submission) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Submission not found');
  }

  if (
    user.role === 'STUDENT' && submission.studentId !== user.id
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access forbidden');
  }

  if (
    user.role === 'MENTOR' && submission.mentorId !== user.id
  ) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Access forbidden');
  }

  return submission;
};

export const SubmissionService = {
  submitAssignment,
  getMySubmissions,
  getAssignedSubmissions,
  reviewSubmission,
  getAllSubmissions,
  getSingleSubmission,
};

