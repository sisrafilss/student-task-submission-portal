'use server';

import { IAssignment, SubmissionStatus } from '@/types/submission.interface';
import { initialSubmissions, mockAssignments } from '../submissions/mockSubmissions';

export interface IAssignmentStats {
  totalCount: number;
  actionRequiredCount: number;
  underReviewCount: number;
  evaluatedCount: number;
}

export interface IStudentAssignmentsResponse {
  assignments: IAssignment[];
  stats: IAssignmentStats;
}

export async function getStudentAssignmentsWithStatus(
  searchQuery = '',
  studentId = 'std-1'
): Promise<IStudentAssignmentsResponse> {
  // Parse query parameters
  const params = new URLSearchParams(searchQuery);
  const searchTerm = (params.get('searchTerm') || '').toLowerCase().trim();
  const statusFilter = params.get('status') || '';
  const trackFilter = params.get('courseTrack') || '';

  // Get all submissions by this student
  const studentSubmissions = initialSubmissions.filter(
    (sub) => sub.studentId === studentId
  );

  // Map each assignment with student's personal submission status
  const allEnrichedAssignments: IAssignment[] = mockAssignments.map((assignment) => {
    const existingSubmission = studentSubmissions.find(
      (sub) => sub.assignmentId === assignment.id
    );

    const submissionStatus: SubmissionStatus | 'NOT_SUBMITTED' = existingSubmission
      ? existingSubmission.status
      : 'NOT_SUBMITTED';

    return {
      ...assignment,
      studentSubmissionStatus: submissionStatus,
      mySubmission: existingSubmission || null,
    };
  });

  // Calculate overall student metrics
  const stats: IAssignmentStats = {
    totalCount: allEnrichedAssignments.length,
    actionRequiredCount: allEnrichedAssignments.filter(
      (a) => a.studentSubmissionStatus === 'NOT_SUBMITTED'
    ).length,
    underReviewCount: allEnrichedAssignments.filter(
      (a) =>
        a.studentSubmissionStatus === 'PENDING' ||
        a.studentSubmissionStatus === 'UNDER_REVIEW'
    ).length,
    evaluatedCount: allEnrichedAssignments.filter(
      (a) => a.studentSubmissionStatus === 'EVALUATED'
    ).length,
  };

  // Apply filters
  let filtered = allEnrichedAssignments;

  if (searchTerm) {
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(searchTerm) ||
        (a.description && a.description.toLowerCase().includes(searchTerm)) ||
        a.courseTrack.toLowerCase().includes(searchTerm) ||
        a.batchName.toLowerCase().includes(searchTerm)
    );
  }

  if (statusFilter && statusFilter !== 'ALL') {
    filtered = filtered.filter((a) => a.studentSubmissionStatus === statusFilter);
  }

  if (trackFilter && trackFilter !== 'ALL') {
    filtered = filtered.filter((a) => a.courseTrack === trackFilter);
  }

  return {
    assignments: filtered,
    stats,
  };
}

export async function getAssignmentById(id: string): Promise<IAssignment | null> {
  const found = mockAssignments.find((a) => a.id === id);
  if (!found) return null;
  return found;
}

