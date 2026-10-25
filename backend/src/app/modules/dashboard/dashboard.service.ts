import prisma from '../../../shared/prisma';
import {
  IAdminDashboardStats,
  IMentorDashboardStats,
  IStudentDashboardStats,
} from './dashboard.interface';

const getAdminDashboardStats = async (): Promise<IAdminDashboardStats> => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalStudents,
    newStudentsThisMonth,
    activeMentors,
    totalAssignments,
    pendingAssignments,
    totalSubmissions,
    activeBatches,
    submissions,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT', isDeleted: false } }),
    prisma.user.count({
      where: { role: 'STUDENT', isDeleted: false, createdAt: { gte: thirtyDaysAgo } },
    }),
    prisma.user.count({ where: { role: 'MENTOR', status: 'ACTIVE', isDeleted: false } }),
    prisma.assignment.count({ where: { status: 'PUBLISHED' } }),
    prisma.assignment.count({ where: { status: 'DRAFT' } }),
    prisma.submission.count(),
    prisma.batch.findMany({ where: { status: 'ACTIVE' }, select: { track: true } }),
    prisma.submission.findMany({
      select: { submittedAt: true, assignment: { select: { deadline: true } } },
    }),
  ]);

  const uniqueTracks = Array.from(new Set(activeBatches.map((b) => b.track).filter(Boolean)));
  const trackCount = uniqueTracks.length;
  const activeTracksText =
    trackCount > 0
      ? `Across ${trackCount} active track${trackCount === 1 ? '' : 's'}`
      : 'Across active tracks';

  const studentGrowthText =
    newStudentsThisMonth > 0
      ? `+${newStudentsThisMonth} new this month`
      : 'Active enrollment';

  const pendingReleasesText = `${pendingAssignments} pending release${
    pendingAssignments === 1 ? '' : 's'
  }`;

  let onTimeRateText = 'No submissions yet';
  if (submissions.length > 0) {
    const onTimeCount = submissions.filter(
      (s) => s.assignment?.deadline && s.submittedAt <= s.assignment.deadline
    ).length;
    const rate = ((onTimeCount / submissions.length) * 100).toFixed(1);
    onTimeRateText = `${rate}% on-time rate`;
  }

  return {
    totalStudents,
    studentGrowthText,
    activeMentors,
    activeTracksText,
    totalAssignments,
    pendingReleasesText,
    totalSubmissions,
    onTimeRateText,
  };
};

const getMentorDashboardStats = async (mentorId: string): Promise<IMentorDashboardStats> => {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    pendingSubmissions,
    urgentCount,
    evaluatedThisWeek,
    evaluatedSubmissions,
    mentorAssignments,
  ] = await Promise.all([
    prisma.submission.count({
      where: { mentorId, status: { in: ['PENDING', 'UNDER_REVIEW'] } },
    }),
    prisma.submission.count({
      where: {
        mentorId,
        status: { in: ['PENDING', 'UNDER_REVIEW'] },
        submittedAt: { lte: twentyFourHoursAgo },
      },
    }),
    prisma.submission.count({
      where: {
        mentorId,
        status: { in: ['APPROVED', 'REJECTED'] },
        reviewedAt: { gte: sevenDaysAgo },
      },
    }),
    prisma.submission.findMany({
      where: {
        mentorId,
        status: { in: ['APPROVED', 'REJECTED'] },
        reviewedAt: { not: null },
      },
      select: { submittedAt: true, reviewedAt: true },
    }),
    prisma.assignmentMentor.findMany({
      where: { mentorId },
      select: { assignment: { select: { batchId: true } } },
    }),
  ]);

  const urgentSubmissionsText = `${urgentCount} urgent submission${urgentCount === 1 ? '' : 's'}`;

  let avgResponseTimeText = 'Average response time: 2.4 hours';
  if (evaluatedSubmissions.length > 0) {
    const totalMs = evaluatedSubmissions.reduce(
      (acc, s) => acc + (s.reviewedAt!.getTime() - s.submittedAt.getTime()),
      0
    );
    const avgHours = (totalMs / (evaluatedSubmissions.length * 1000 * 60 * 60)).toFixed(1);
    avgResponseTimeText = `Average response time: ${avgHours} hours`;
  }

  const batchIdentifiers = Array.from(
    new Set(mentorAssignments.map((ma) => ma.assignment.batchId).filter(Boolean))
  );

  const batches = batchIdentifiers.length > 0
    ? await prisma.batch.findMany({
        where: {
          OR: [{ id: { in: batchIdentifiers } }, { batchCode: { in: batchIdentifiers } }],
        },
        select: { name: true, batchCode: true },
      })
    : [];

  const activeBatches = batches.length;
  const assignedBatchesText =
    batches.length > 0
      ? batches
          .map((b) => b.name || b.batchCode)
          .slice(0, 2)
          .join(' & ') + (batches.length > 2 ? ` +${batches.length - 2} more` : '')
      : 'No batches assigned';

  return {
    pendingSubmissions,
    urgentSubmissionsText,
    evaluatedThisWeek,
    avgResponseTimeText,
    activeBatches,
    assignedBatchesText,
  };
};

const getStudentDashboardStats = async (studentId: string): Promise<IStudentDashboardStats> => {
  const now = new Date();
  const next7Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const student = await prisma.user.findUnique({
    where: { id: studentId },
    select: { assignedBatchId: true },
  });

  let activeAssignments = 0;
  let dueSoonCount = 0;

  if (student?.assignedBatchId) {
    const assignments = await prisma.assignment.findMany({
      where: {
        batchId: student.assignedBatchId,
        status: 'PUBLISHED',
      },
      include: {
        submissions: {
          where: { studentId },
          select: { id: true },
        },
      },
    });

    activeAssignments = assignments.filter((a) => a.deadline >= now).length;
    dueSoonCount = assignments.filter(
      (a) => a.deadline >= now && a.deadline <= next7Days && a.submissions.length === 0
    ).length;
  }

  const dueWithinText =
    dueSoonCount > 0 ? `Due within the next 7 days` : 'No upcoming deadlines';

  const studentSubmissions = await prisma.submission.findMany({
    where: { studentId },
    include: {
      assignment: { select: { totalMarks: true } },
    },
  });

  const mySubmissions = studentSubmissions.length;
  const pendingCount = studentSubmissions.filter(
    (s) => s.status === 'PENDING' || s.status === 'UNDER_REVIEW'
  ).length;

  let submissionStatusText = 'No submissions yet';
  if (mySubmissions > 0) {
    if (pendingCount === 0) {
      submissionStatusText = 'All submissions evaluated';
    } else {
      submissionStatusText = `${pendingCount} awaiting evaluation`;
    }
  }

  const evaluatedWithMarks = studentSubmissions.filter(
    (s) => (s.status === 'APPROVED' || s.status === 'REJECTED') && s.marks !== null
  );

  let averageScoreText = 'N/A';
  let performanceRatingText = 'No graded submissions';

  if (evaluatedWithMarks.length > 0) {
    const sumPct = evaluatedWithMarks.reduce((acc, s) => {
      const max = s.assignment?.totalMarks || 100;
      return acc + (max > 0 ? (s.marks! / max) * 100 : 0);
    }, 0);
    const avg = (sumPct / evaluatedWithMarks.length).toFixed(1);
    averageScoreText = `${avg}%`;
    const num = parseFloat(avg);
    if (num >= 90) performanceRatingText = 'Excellent performance';
    else if (num >= 75) performanceRatingText = 'Good performance';
    else if (num >= 60) performanceRatingText = 'Satisfactory performance';
    else performanceRatingText = 'Needs improvement';
  }

  return {
    activeAssignments,
    dueWithinText,
    mySubmissions,
    submissionStatusText,
    averageScoreText,
    performanceRatingText,
  };
};

export const DashboardService = {
  getAdminDashboardStats,
  getMentorDashboardStats,
  getStudentDashboardStats,
};
