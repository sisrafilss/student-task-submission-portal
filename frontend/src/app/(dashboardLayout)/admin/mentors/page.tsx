import MentorManagementHeader from '@/components/modules/Admin/MentorManagement/MentorManagementHeader';
import MentorTableContainer from '@/components/modules/Admin/MentorManagement/MentorTableContainer';
import RefreshButton from '@/components/shared/RefreshButton';
import SearchFilter from '@/components/shared/SearchFilter';
import SelectFilter from '@/components/shared/SelectFilter';
import TableSkeleton from '@/components/shared/TableSkeleton';
import { mentorSpecializations } from '@/services/admin/mockMentors';
import { Suspense } from 'react';

interface AdminMentorsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function AdminMentorsPage({ searchParams }: AdminMentorsPageProps) {
  const statusOptions = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
    { label: 'On Leave', value: 'ON_LEAVE' },
    { label: 'Blocked', value: 'BLOCKED' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header with Add Mentor Action */}
      <MentorManagementHeader />

      {/* Filter and Search Controls Toolbar wrapped in Suspense for useSearchParams */}
      <Suspense fallback={<div className="h-10 w-full rounded-lg bg-muted/20 animate-pulse" />}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <SearchFilter
            paramName="searchTerm"
            placeholder="Search by mentor name, ID, or email..."
            className="flex-1"
          />
          <div className="flex flex-wrap items-center gap-2">
            <SelectFilter
              paramName="specialization"
              placeholder="Search specialization..."
              allLabel="All Specializations"
              icon="Code"
              options={mentorSpecializations}
            />
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

      {/* Mentor Data Table & Pagination dynamically streamed inside Suspense */}
      <Suspense fallback={<TableSkeleton columns={7} rows={8} />}>
        <MentorTableContainer searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
