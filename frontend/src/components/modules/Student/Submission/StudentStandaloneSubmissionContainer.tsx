import {
  getStudentAvailableAssignments,
  getStudentSubmissions,
} from '@/services/submissions/submissionManagement';
import React from 'react';
import StudentStandaloneSubmissionForm from './StudentStandaloneSubmissionForm';

interface StudentStandaloneSubmissionContainerProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function StudentStandaloneSubmissionContainer({
  searchParams,
}: StudentStandaloneSubmissionContainerProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const initialAssignmentId =
    typeof resolvedSearchParams.assignmentId === 'string'
      ? resolvedSearchParams.assignmentId
      : undefined;

  const [assignmentsResult, submissionsResult] = await Promise.all([
    getStudentAvailableAssignments(),
    getStudentSubmissions(),
  ]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <StudentStandaloneSubmissionForm
        assignments={assignmentsResult.data || []}
        existingSubmissions={submissionsResult.data || []}
        initialAssignmentId={initialAssignmentId}
      />
    </div>
  );
}

