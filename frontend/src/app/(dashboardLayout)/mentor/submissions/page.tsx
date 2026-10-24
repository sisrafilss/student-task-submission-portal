import MentorSubmissionsContainer from '@/components/modules/Mentor/Submissions/MentorSubmissionsContainer';
import MentorSubmissionsHeader from '@/components/modules/Mentor/Submissions/MentorSubmissionsHeader';
import MentorSubmissionStatsCards from '@/components/modules/Mentor/Submissions/MentorSubmissionStatsCards';
import MentorSubmissionsToolbar from '@/components/modules/Mentor/Submissions/MentorSubmissionsToolbar';
import TableSkeleton from '@/components/shared/TableSkeleton';
import {
  getAvailableAssignments,
  getMentorSubmissionStats,
} from '@/services/submissions/submissionManagement';
import { Suspense } from 'react';

interface MentorSubmissionsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function MentorSubmissionsPage({
  searchParams,
}: MentorSubmissionsPageProps) {
  const [stats, assignmentsRes] = await Promise.all([
    getMentorSubmissionStats(),
    getAvailableAssignments(),
  ]);

  return (
    <div className="space-y-6">
      <MentorSubmissionsHeader pendingCount={stats.totalPending} />

      <MentorSubmissionStatsCards stats={stats} />

      <Suspense fallback={null}>
        <MentorSubmissionsToolbar assignments={assignmentsRes.data} />
      </Suspense>

      <Suspense fallback={<TableSkeleton columns={7} rows={8} />}>
        <MentorSubmissionsContainer searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
