import StudentManagementHeader from '@/components/modules/Admin/StudentManagement/StudentManagementHeader';
import StudentTableContainer from '@/components/modules/Admin/StudentManagement/StudentTableContainer';
import RefreshButton from '@/components/shared/RefreshButton';
import SearchFilter from '@/components/shared/SearchFilter';
import SelectFilter from '@/components/shared/SelectFilter';
import TableSkeleton from '@/components/shared/TableSkeleton';
import { initialBatches } from '@/services/admin/mockStudents';
import { Suspense } from 'react';

interface AdminStudentsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function AdminStudentsPage({ searchParams }: AdminStudentsPageProps) {
  const batchOptions = initialBatches.map((batch) => ({
    label: batch.name,
    value: batch.id,
  }));

  const statusOptions = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
    { label: 'Blocked', value: 'BLOCKED' },
    { label: 'Graduated', value: 'GRADUATED' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <StudentManagementHeader />

      {/* Filter and Search Controls Toolbar wrapped in Suspense for useSearchParams */}
      <Suspense fallback={<div className="h-10 w-full rounded-lg bg-muted/20 animate-pulse" />}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <SearchFilter
            paramName="searchTerm"
            placeholder="Search by student name, ID, or email..."
            className="flex-1"
          />
          <div className="flex flex-wrap items-center gap-2">
            <SelectFilter
              paramName="batch"
              placeholder="Search batch..."
              allLabel="All Batches"
              icon="Layers"
              options={batchOptions}
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

      {/* Student Data Table & Pagination dynamically streamed inside Suspense */}
      <Suspense fallback={<TableSkeleton columns={7} rows={8} />}>
        <StudentTableContainer searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
