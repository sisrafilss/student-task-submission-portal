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
  IStudentSubmissionFilterRequest,
  IStudentSubmissionStats,
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
  filters: IStudentSubmissionFilterRequest = {},
  paginationOptions: IPaginationOptions = {}
) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);
  const { searchTerm, status, assignmentId } = filters;

  const andConditions: Prisma.SubmissionWhereInput[] = [{ studentId }];

  if (status) {
    andConditions.push({ status: status as Prisma.EnumSubmissionStatusFilter });
  }

  if (assignmentId) {
    andConditions.push({ assignmentId });
  }

  if (searchTerm) {
    andConditions.push({
      OR: [
        { repoUrl: { contains: searchTerm, mode: 'insensitive' } },
        { liveUrl: { contains: searchTerm, mode: 'insensitive' } },
        { notes: { contains: searchTerm, mode: 'insensitive' } },
        { assignment: { title: { contains: searchTerm, mode: 'insensitive' } } },
      ],
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
      OR: [
        { repoUrl: { contains: searchTerm, mode: 'insensitive' } },
        { liveUrl: { contains: searchTerm, mode: 'insensitive' } },
        { notes: { contains: searchTerm, mode: 'insensitive' } },
        { student: { name: { contains: searchTerm, mode: 'insensitive' } } },
        { student: { email: { contains: searchTerm, mode: 'insensitive' } } },
        { assignment: { title: { contains: searchTerm, mode: 'insensitive' } } },
      ],
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
    include: {
      assignment: { select: { id: true, title: true, totalMarks: true } },
    },
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

  if (
    payload.marks !== undefined &&
    submission.assignment &&
    payload.marks > submission.assignment.totalMarks
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Marks cannot exceed maximum marks allowed (${submission.assignment.totalMarks})`
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
      OR: [
        { repoUrl: { contains: searchTerm, mode: 'insensitive' } },
        { liveUrl: { contains: searchTerm, mode: 'insensitive' } },
        { notes: { contains: searchTerm, mode: 'insensitive' } },
        { student: { name: { contains: searchTerm, mode: 'insensitive' } } },
        { student: { email: { contains: searchTerm, mode: 'insensitive' } } },
        { assignment: { title: { contains: searchTerm, mode: 'insensitive' } } },
      ],
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
        assignment: { select: { id: true, title: true, totalMarks: true, rubrics: true } },
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

const getMentorStats = async (mentorId: string) => {
  const [totalSubmissions, totalPending, totalApproved, totalRejected, approvedSubmissions] =
    await Promise.all([
      prisma.submission.count({ where: { mentorId } }),
      prisma.submission.count({
        where: { mentorId, status: { in: ['PENDING', 'UNDER_REVIEW'] } },
      }),
      prisma.submission.count({ where: { mentorId, status: 'APPROVED' } }),
      prisma.submission.count({ where: { mentorId, status: 'REJECTED' } }),
      prisma.submission.findMany({
        where: { mentorId, status: 'APPROVED', marks: { not: null } },
        select: { marks: true, assignment: { select: { totalMarks: true } } },
      }),
    ]);

  let averageScore = 0;
  if (approvedSubmissions.length > 0) {
    const percentageSum = approvedSubmissions.reduce((acc, curr) => {
      const max = curr.assignment?.totalMarks || 100;
      const percentage = max > 0 ? ((curr.marks || 0) / max) * 100 : 0;
      return acc + percentage;
    }, 0);
    averageScore = Math.round(percentageSum / approvedSubmissions.length);
  }

  return {
    totalSubmissions,
    totalPending,
    totalApproved,
    totalRejected,
    averageScore,
  };
};

const getStudentStats = async (studentId: string): Promise<IStudentSubmissionStats> => {
  const [totalSubmissions, totalPending, totalEvaluated] = await Promise.all([
    prisma.submission.count({ where: { studentId } }),
    prisma.submission.count({
      where: { studentId, status: { in: ['PENDING', 'UNDER_REVIEW'] } },
    }),
    prisma.submission.count({
      where: { studentId, status: { in: ['APPROVED', 'REJECTED'] } },
    }),
  ]);

  return {
    totalSubmissions,
    totalPending,
    totalEvaluated,
  };
};

export const SubmissionService = {
  submitAssignment,
  getMySubmissions,
  getAssignedSubmissions,
  reviewSubmission,
  getAllSubmissions,
  getSingleSubmission,
  getMentorStats,
  getStudentStats,
};

