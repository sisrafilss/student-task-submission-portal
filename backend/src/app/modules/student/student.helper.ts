import prisma from '../../../shared/prisma';

export interface IRawStudent {
  id: string;
  name: string;
  email: string;
  role: string;
  studentId: string | null;
  assignedBatchId: string | null;
  enrolledTrack: string | null;
  contactNumber: string | null;
  gender: string | null;
  address: string | null;
  status: string;
  avatarUrl: string | null;
  githubUsername: string | null;
  linkedinUrl: string | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  submissionsAsStudent?: { marks: number | null; status: string }[];
}

export const formatStudentsWithBatches = async (students: IRawStudent[]) => {
  const batchCodes = Array.from(
    new Set(students.map((s) => s.assignedBatchId).filter(Boolean) as string[])
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

  const batchMap = new Map<string, string>();
  batches.forEach((b) => {
    batchMap.set(b.id, b.name);
    batchMap.set(b.batchCode, b.name);
  });

  return students.map((s) => {
    const submissions = s.submissionsAsStudent || [];
    const totalSubmissions = submissions.length;
    const reviewed = submissions.filter((sub) => sub.marks !== null);
    const averageScore =
      reviewed.length > 0
        ? Math.round(
            (reviewed.reduce((acc, curr) => acc + (curr.marks || 0), 0) /
              reviewed.length) *
              10
          ) / 10
        : 0;

    const { submissionsAsStudent, ...rest } = s;

    return {
      ...rest,
      batchId: s.assignedBatchId || '',
      batchName:
        (s.assignedBatchId && batchMap.get(s.assignedBatchId)) ||
        s.assignedBatchId ||
        'N/A',
      totalSubmissions,
      averageScore,
    };
  });
};

