import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import ApiError from '../../errors/ApiError';
import { IAssignMentorPayload } from './submission.interface';

interface IElectedMentorRow {
  id: string;
  mentorId: string;
  currentAssignedCount: number;
  maxQuota: number;
}

/**
 * Concurrency-safe Least-Allocated Round-Robin auto-distribution engine.
 * Uses atomic PostgreSQL interactive transaction with pessimistic row-locking (FOR UPDATE OF am)
 * to prevent race conditions during high-concurrency student submissions.
 */
export const assignMentorAtomic = async (payload: IAssignMentorPayload) => {
  return await prisma.$transaction(
    async (tx) => {
      // 1. Verify Assignment existence & deadline
      const assignment = await tx.assignment.findUnique({
        where: { id: payload.assignmentId },
      });

      if (!assignment) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Assignment not found');
      }

      // Check deadline
      if (new Date(assignment.deadline) < new Date()) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Assignment submission deadline has passed'
        );
      }

      // 2. Prevent duplicate submission by the same student for this assignment
      const existingSubmission = await tx.submission.findUnique({
        where: {
          assignmentId_studentId: {
            assignmentId: payload.assignmentId,
            studentId: payload.studentId,
          },
        },
      });

      if (existingSubmission) {
        throw new ApiError(
          httpStatus.CONFLICT,
          'You have already submitted this assignment'
        );
      }

      // 3. Find eligible active mentor using pessimistic row lock
      const candidateMentors = await tx.$queryRaw<IElectedMentorRow[]>`
        SELECT am.id, am."mentorId", am."currentAssignedCount", am."maxQuota"
        FROM "assignment_mentors" am
        INNER JOIN "users" u ON am."mentorId" = u.id
        WHERE am."assignmentId" = ${payload.assignmentId}
          AND am."currentAssignedCount" < am."maxQuota"
          AND u.status = 'ACTIVE'
        ORDER BY am."currentAssignedCount" ASC, am."lastAssignedAt" ASC NULLS FIRST, am.id ASC
        LIMIT 1
        FOR UPDATE OF am;
      `;

      let assignedMentorId: string | null = null;

      if (candidateMentors && candidateMentors.length > 0) {
        const selectedMentor = candidateMentors[0];
        assignedMentorId = selectedMentor.mentorId;

        // Atomically increment currentAssignedCount and record lastAssignedAt timestamp
        await tx.assignmentMentor.update({
          where: { id: selectedMentor.id },
          data: {
            currentAssignedCount: { increment: 1 },
            lastAssignedAt: new Date(),
          },
        });
      }

      // 4. Create Submission record (assigned to selected mentor or queued as UNASSIGNED)
      const submission = await tx.submission.create({
        data: {
          assignmentId: payload.assignmentId,
          studentId: payload.studentId,
          mentorId: assignedMentorId,
          repoUrl: payload.repoUrl,
          liveUrl: payload.liveUrl || null,
          notes: payload.notes || null,
          status: 'PENDING',
        },
        include: {
          mentor: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
            },
          },
          assignment: {
            select: {
              id: true,
              title: true,
              totalMarks: true,
              batchId: true,
              deadline: true,
            },
          },
        },
      });

      return submission;
    },
    {
      isolationLevel: 'ReadCommitted',
      timeout: 25000,
    }
  );
};

