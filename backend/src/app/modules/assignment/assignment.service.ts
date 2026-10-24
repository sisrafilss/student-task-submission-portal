import httpStatus from 'http-status';
import { Prisma } from '@prisma/client';
import prisma from '../../../shared/prisma';
import ApiError from '../../errors/ApiError';
import { calculatePagination, IPaginationOptions } from '../../../helpers/paginationHelper';
import { assignmentSearchableFields } from './assignment.constant';
import {
  ICreateAssignmentPayload,
  IUpdateAssignmentPayload,
  IUpdateAssignmentMentorsPayload,
  IAssignmentFilterRequest,
  IStudentAssignmentItem,
} from './assignment.interface';

const createAssignment = async (payload: ICreateAssignmentPayload, adminId: string) => {
  const deadlineDate = new Date(payload.deadline);
  if (isNaN(deadlineDate.getTime())) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid deadline timestamp');
  }

  return await prisma.$transaction(async (tx) => {
    // Validate mentor IDs if provided
    if (payload.mentorQuotas && payload.mentorQuotas.length > 0) {
      const mentorIds = payload.mentorQuotas.map((m) => m.mentorId);
      const validMentors = await tx.user.findMany({
        where: {
          id: { in: mentorIds },
          role: 'MENTOR',
          status: 'ACTIVE',
        },
      });

      if (validMentors.length !== mentorIds.length) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'One or more specified mentors are invalid or not active'
        );
      }
    }

    const defaultMax = payload.maxPerMentor || 10;

    const assignment = await tx.assignment.create({
      data: {
        title: payload.title,
        description: payload.description,
        batchId: payload.batchId,
        deadline: deadlineDate,
        totalMarks: payload.totalMarks || 100,
        maxPerMentor: defaultMax,
        rubrics: payload.rubrics ? JSON.parse(JSON.stringify(payload.rubrics)) : [],
        createdById: adminId,
        mentors: {
          create: (payload.mentorQuotas || []).map((quota) => ({
            mentorId: quota.mentorId,
            maxQuota: quota.maxQuota || defaultMax,
            currentAssignedCount: 0,
          })),
        },
      },
      include: {
        mentors: {
          include: {
            mentor: {
              select: { id: true, name: true, email: true, expertise: true },
            },
          },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return assignment;
  });
};

const getAllAssignments = async (
  filters: IAssignmentFilterRequest,
  paginationOptions: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);
  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.AssignmentWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: assignmentSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as Record<string, unknown>)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.AssignmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const [total, data] = await Promise.all([
    prisma.assignment.count({ where: whereConditions }),
    prisma.assignment.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        mentors: {
          include: {
            mentor: { select: { id: true, name: true, email: true } },
          },
        },
        _count: {
          select: { submissions: true },
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

const getSingleAssignment = async (id: string) => {
  const assignment = await prisma.assignment.findUnique({
    where: { id },
    include: {
      mentors: {
        include: {
          mentor: { select: { id: true, name: true, email: true, expertise: true } },
        },
      },
      createdBy: {
        select: { id: true, name: true, email: true },
      },
      _count: {
        select: { submissions: true },
      },
    },
  });

  if (!assignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Assignment not found');
  }

  return assignment;
};

const getMyBatchAssignments = async (studentId: string): Promise<IStudentAssignmentItem[]> => {
  const student = await prisma.user.findUnique({
    where: { id: studentId },
  });

  if (!student || !student.assignedBatchId) {
    return [];
  }

  const assignments = await prisma.assignment.findMany({
    where: {
      batchId: student.assignedBatchId,
      status: 'PUBLISHED',
    },
    orderBy: { createdAt: 'desc' },
    include: {
      submissions: {
        where: { studentId },
        select: {
          id: true,
          status: true,
          submittedAt: true,
          marks: true,
          feedback: true,
        },
      },
    },
  });

  return assignments.map((item) => {
    const studentSubmission = item.submissions[0] || null;
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      batchId: item.batchId,
      deadline: item.deadline,
      totalMarks: item.totalMarks,
      rubrics: item.rubrics,
      status: item.status,
      hasSubmitted: !!studentSubmission,
      submissionId: studentSubmission ? studentSubmission.id : null,
      submissionStatus: studentSubmission ? studentSubmission.status : 'NOT_SUBMITTED',
      submittedAt: studentSubmission ? studentSubmission.submittedAt : null,
      marks: studentSubmission ? studentSubmission.marks : null,
      feedback: studentSubmission ? studentSubmission.feedback : null,
    };
  });
};

const updateAssignmentMentors = async (
  assignmentId: string,
  payload: IUpdateAssignmentMentorsPayload
) => {
  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
  });

  if (!assignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Assignment not found');
  }

  const operations = payload.mentors.map((item) =>
    prisma.assignmentMentor.upsert({
      where: {
        assignmentId_mentorId: {
          assignmentId,
          mentorId: item.mentorId,
        },
      },
      update: {
        maxQuota: item.maxQuota,
      },
      create: {
        assignmentId,
        mentorId: item.mentorId,
        maxQuota: item.maxQuota,
        currentAssignedCount: 0,
      },
      include: {
        mentor: { select: { id: true, name: true, email: true } },
      },
    })
  );

  return await prisma.$transaction(operations);
};

const getActiveMentors = async () => {
  return await prisma.user.findMany({
    where: { role: 'MENTOR', status: 'ACTIVE' },
    select: { id: true, name: true, email: true, expertise: true },
    orderBy: { name: 'asc' },
  });
};

const updateAssignment = async (id: string, payload: IUpdateAssignmentPayload) => {
  const existing = await prisma.assignment.findUnique({
    where: { id },
    include: { mentors: true },
  });

  if (!existing) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Assignment not found');
  }

  return await prisma.$transaction(async (tx) => {
    const updateData: Prisma.AssignmentUpdateInput = {};

    if (payload.title !== undefined) updateData.title = payload.title;
    if (payload.description !== undefined) updateData.description = payload.description;
    if (payload.batchId !== undefined) updateData.batchId = payload.batchId;
    if (payload.totalMarks !== undefined) updateData.totalMarks = payload.totalMarks;
    if (payload.maxPerMentor !== undefined) updateData.maxPerMentor = payload.maxPerMentor;
    if (payload.status !== undefined) updateData.status = payload.status;
    if (payload.rubrics !== undefined) {
      updateData.rubrics = JSON.parse(JSON.stringify(payload.rubrics));
    }
    if (payload.deadline !== undefined) {
      const parsedDate = new Date(payload.deadline);
      if (isNaN(parsedDate.getTime())) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid deadline timestamp');
      }
      updateData.deadline = parsedDate;
    }

    const updated = await tx.assignment.update({
      where: { id },
      data: updateData,
      include: {
        mentors: {
          include: {
            mentor: { select: { id: true, name: true, email: true, expertise: true } },
          },
        },
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (payload.mentorQuotas && payload.mentorQuotas.length > 0) {
      const defaultMax = payload.maxPerMentor || existing.maxPerMentor || 10;
      for (const item of payload.mentorQuotas) {
        await tx.assignmentMentor.upsert({
          where: {
            assignmentId_mentorId: {
              assignmentId: id,
              mentorId: item.mentorId,
            },
          },
          update: {
            maxQuota: item.maxQuota || defaultMax,
          },
          create: {
            assignmentId: id,
            mentorId: item.mentorId,
            maxQuota: item.maxQuota || defaultMax,
            currentAssignedCount: 0,
          },
        });
      }
    }

    return updated;
  });
};

const deleteAssignment = async (id: string) => {
  const existing = await prisma.assignment.findUnique({
    where: { id },
    select: { id: true, title: true },
  });

  if (!existing) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Assignment not found');
  }

  return await prisma.$transaction(async (tx) => {
    // 1. Delete all submissions for this assignment
    await tx.submission.deleteMany({
      where: { assignmentId: id },
    });

    // 2. Delete all assignment mentor quotas
    await tx.assignmentMentor.deleteMany({
      where: { assignmentId: id },
    });

    // 3. Delete the assignment itself
    const deleted = await tx.assignment.delete({
      where: { id },
    });

    return deleted;
  });
};

export const AssignmentService = {
  createAssignment,
  getAllAssignments,
  getSingleAssignment,
  getMyBatchAssignments,
  updateAssignmentMentors,
  getActiveMentors,
  updateAssignment,
  deleteAssignment,
};

