import { getStudentAssignmentsWithStatus } from '@/services/assignments/assignmentManagement';
import AssignmentCardGrid from './AssignmentCardGrid';

interface StudentAssignmentsContainerProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function StudentAssignmentsContainer({
  searchParams,
}: StudentAssignmentsContainerProps) {
  const resolvedParams = await searchParams;

  // Convert resolved search params to query string
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

  // Fetch enriched assignments for the student
  const { assignments } = await getStudentAssignmentsWithStatus(queryString, 'std-1');

  return <AssignmentCardGrid assignments={assignments} />;
}

