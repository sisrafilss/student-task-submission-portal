import StudentSubmissionsContainer from '@/components/modules/Student/Submission/StudentSubmissionsContainer';
import SubmissionPortalHeader from '@/components/modules/Student/Submission/SubmissionPortalHeader';
import RefreshButton from '@/components/shared/RefreshButton';
import SearchFilter from '@/components/shared/SearchFilter';
import SelectFilter from '@/components/shared/SelectFilter';
import TableSkeleton from '@/components/shared/TableSkeleton';
import {
  getStudentSubmissionStats,
} from '@/services/submissions/submissionManagement';
import { Suspense } from 'react';

interface StudentSubmissionsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function StudentSubmissionsPage({
  searchParams,
}: StudentSubmissionsPageProps) {
  // Fetch live student submission stats
  const stats = await getStudentSubmissionStats();

  const totalCount = stats.totalSubmissions;
  const pendingCount = stats.totalPending;
  const evaluatedCount = stats.totalEvaluated;

  const statusOptions = [
    { label: 'Pending', value: 'PENDING' },
    { label: 'Under Review', value: 'UNDER_REVIEW' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  return (
    <div className="space-y-8">
      {/* Portal Header & Live Stats Badges */}
      <SubmissionPortalHeader
        totalCount={totalCount}
        pendingCount={pendingCount}
        evaluatedCount={evaluatedCount}
      />

      {/* Submission History Section */}
      <div className="space-y-4 pt-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            My Submissions History
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Track past project evaluations, view mentor grading, and inspect feedback.
          </p>
        </div>

        {/* Toolbar with Reusable SearchFilter, SelectFilter & RefreshButton */}
        <Suspense fallback={<div className="h-10 w-full rounded-lg bg-muted/20 animate-pulse" />}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <SearchFilter
              paramName="searchTerm"
              placeholder="Search by project name or assignment title..."
              className="flex-1"
            />
            <div className="flex flex-wrap items-center gap-2">
              <SelectFilter
                paramName="status"
                placeholder="Search status..."
                allLabel="All Statuses"
                icon="SlidersHorizontal"
                options={statusOptions}
              />
              <RefreshButton />
            </div>
          </div>
        </Suspense>

        {/* Reusable Data Table & Pagination inside Suspense */}
        <Suspense fallback={<TableSkeleton columns={6} rows={5} />}>
          <StudentSubmissionsContainer searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
