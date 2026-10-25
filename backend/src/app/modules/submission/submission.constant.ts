export const submissionFilterableFields = [
  'searchTerm',
  'status',
  'assignmentId',
  'mentorId',
  'studentId',
  'batchId',
];

export const studentSubmissionFilterableFields = ['searchTerm', 'status', 'assignmentId'];

export const submissionSearchableFields = ['repoUrl', 'liveUrl', 'notes'];

export const submissionStatusEnum = ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'] as const;

