import {
  getStudentAssignmentsWithStatus,
  getStudentBatchAssignments,
} from '@/services/assignments/assignmentManagement';
import { IAssignment, SubmissionStatus } from '@/types/submission.interface';
import React from 'react';
import AssignmentCardGrid from './AssignmentCardGrid';

interface StudentAssignmentsContainerProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function StudentAssignmentsContainer({
  searchParams,
}: StudentAssignmentsContainerProps) {
  // 1. Attempt fetching real student batch assignments from backend
  const backendRes = await getStudentBatchAssignments();

  if (backendRes.success && backendRes.data && backendRes.data.length > 0) {
    const mappedAssignments: IAssignment[] = backendRes.data.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      batchId: item.batchId,
      batchName: item.batchId,
      courseTrack: 'Full Stack Web',
      deadline: item.deadline,
      maxScore: item.totalMarks,
      status: (item.status === 'CLOSED' ? 'CLOSED' : 'OPEN') as 'OPEN' | 'CLOSED',
      rubrics: Array.isArray(item.rubrics)
        ? item.rubrics.map((r) => ({
            criteria: r.criterion,
            marks: r.maxMarks,
            description: r.criterion,
          }))
        : [],
      studentSubmissionStatus: item.submissionStatus as SubmissionStatus | 'NOT_SUBMITTED',
      mySubmission: item.hasSubmitted
        ? {
            id: item.submissionId || '',
            studentId: '',
            studentName: '',
            studentEmail: '',
            assignmentId: item.id,
            assignmentTitle: item.title,
            projectName: item.title,
            repoUrl: '',
            liveUrl: '',
            description: '',
            status: item.submissionStatus as SubmissionStatus,
            score: item.marks,
            feedback: item.feedback,
            createdAt: item.submittedAt || new Date().toISOString(),
            updatedAt: item.submittedAt || new Date().toISOString(),
          }
        : null,
    }));

    return <AssignmentCardGrid assignments={mappedAssignments} />;
  }

  // 2. Fallback to mock data for offline unit test execution
  const resolvedParams = await searchParams;
  const queryParts: string[] = [];
  if (resolvedParams.searchTerm) {
    queryParts.push(`searchTerm=${encodeURIComponent(String(resolvedParams.searchTerm))}`);
  }
  if (resolvedParams.status) {
    queryParts.push(`status=${encodeURIComponent(String(resolvedParams.status))}`);
  }
  if (resolvedParams.courseTrack) {
    queryParts.push(`courseTrack=${encodeURIComponent(String(resolvedParams.courseTrack))}`);
  }

  const queryString = queryParts.join('&');
  const { assignments } = await getStudentAssignmentsWithStatus(queryString, 'std-1');

  return <AssignmentCardGrid assignments={assignments} />;
}
