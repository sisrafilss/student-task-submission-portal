import httpStatus from 'http-status';
import { Prisma } from '@prisma/client';
import prisma from '../../../shared/prisma';
import ApiError from '../../errors/ApiError';
import {
  IUpdateAssignmentPayload,
  IUpdateAssignmentMentorsPayload,
} from './assignment.interface';

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

export const AssignmentMutationService = {
  updateAssignmentMentors,
  updateAssignment,
  deleteAssignment,
};

