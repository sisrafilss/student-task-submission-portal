import prisma from '../../../shared/prisma';

export interface IRawMentor {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  mentorId: string | null;
  contactNumber: string | null;
  gender: string | null;
  expertise: string | null;
  assignedBatchId: string | null;
  bio: string | null;
  avatarUrl: string | null;
  githubUsername: string | null;
  linkedinUrl: string | null;
  needsPasswordChange: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  submissionsAsMentor?: { id: string; status: string; marks: number | null }[];
  assignedMentorships?: { currentAssignedCount: number }[];
}

export const formatMentorsWithBatches = async (mentors: IRawMentor[]) => {
  const batchCodes = Array.from(
    new Set(mentors.map((m) => m.assignedBatchId).filter(Boolean) as string[])
  );

  const batches = await prisma.batch.findMany({
    where: {
      OR: [
        { id: { in: batchCodes } },
        { batchCode: { in: batchCodes } },
      ],
    },
    select: { id: true, name: true, batchCode: true },
  });

  const batchMap = new Map<string, { id: string; name: string }>();
  batches.forEach((b) => {
    batchMap.set(b.id, { id: b.id, name: b.name });
    batchMap.set(b.batchCode, { id: b.batchCode, name: b.name });
  });

  return mentors.map((m) => {
    const submissions = m.submissionsAsMentor || [];
    const totalEvaluations = submissions.filter(
      (sub) => sub.status === 'APPROVED' || sub.status === 'REJECTED'
    ).length;

    const totalAssignedStudents = (m.assignedMentorships || []).reduce(
      (sum, quota) => sum + (quota.currentAssignedCount || 0),
      0
    );

    const assignedBatch = m.assignedBatchId ? batchMap.get(m.assignedBatchId) : null;
    const assignedBatches = assignedBatch
      ? [assignedBatch]
      : m.assignedBatchId
      ? [{ id: m.assignedBatchId, name: m.assignedBatchId }]
      : [];

    const { submissionsAsMentor, assignedMentorships, ...rest } = m;

    return {
      ...rest,
      mentorId: m.mentorId || `MEN-${m.id.slice(0, 4)}`,
      contactNumber: m.contactNumber || 'N/A',
      gender: m.gender || 'OTHER',
      expertise: m.expertise || 'General Tech',
      assignedBatches,
      totalAssignedStudents,
      totalEvaluations,
      rating: 4.9,
    };
  });
};

