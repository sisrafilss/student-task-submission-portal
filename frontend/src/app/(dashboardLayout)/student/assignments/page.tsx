import AssignmentCardSkeleton from '@/components/modules/Student/Assignment/AssignmentCardSkeleton';
import AssignmentPortalHeader from '@/components/modules/Student/Assignment/AssignmentPortalHeader';
import StudentAssignmentsContainer from '@/components/modules/Student/Assignment/StudentAssignmentsContainer';
import RefreshButton from '@/components/shared/RefreshButton';
import SearchFilter from '@/components/shared/SearchFilter';
import SelectFilter from '@/components/shared/SelectFilter';
import { getStudentAssignmentsWithStatus } from '@/services/assignments/assignmentManagement';
import { Suspense } from 'react';

interface StudentAssignmentsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function StudentAssignmentsPage({
  searchParams,
}: StudentAssignmentsPageProps) {
  // Fetch overall stats for the header counters
  const { stats } = await getStudentAssignmentsWithStatus('', 'std-1');

  const statusOptions = [
    { label: 'Action Required', value: 'NOT_SUBMITTED' },
    { label: 'Under Review', value: 'UNDER_REVIEW' },
    { label: 'Evaluated', value: 'EVALUATED' },
  ];

  const trackOptions = [
    { label: 'Full Stack Web', value: 'Full Stack Web' },
    { label: 'Next.js & TypeScript', value: 'Next.js & TypeScript' },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Header with live stats badges */}
      <AssignmentPortalHeader stats={stats} />

      {/* 2. Interactive Search & Filter Toolbar */}
      <div className="space-y-4 pt-1">
        <Suspense fallback={<div className="h-10 w-full rounded-lg bg-muted/20 animate-pulse" />}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <SearchFilter
              paramName="searchTerm"
              placeholder="Search assignments by title, description or track..."
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
              <SelectFilter
                paramName="courseTrack"
                placeholder="Search track..."
                allLabel="All Tracks"
                icon="Layers"
                options={trackOptions}
              />
              <RefreshButton />
            </div>
          </div>
        </Suspense>

        {/* 3. Pure Card View Grid wrapped in Suspense */}
        <Suspense fallback={<AssignmentCardSkeleton count={4} />}>
          <StudentAssignmentsContainer searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
