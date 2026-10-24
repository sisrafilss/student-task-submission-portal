import AssignmentManagementHeader from '@/components/modules/Admin/AssignmentManagement/AssignmentManagementHeader';
import AssignmentTableContainer from '@/components/modules/Admin/AssignmentManagement/AssignmentTableContainer';
import RefreshButton from '@/components/shared/RefreshButton';
import SearchFilter from '@/components/shared/SearchFilter';
import SelectFilter from '@/components/shared/SelectFilter';
import TableSkeleton from '@/components/shared/TableSkeleton';
import {
  getAdminAssignments,
  getAvailableMentorsList,
} from '@/services/assignments/assignmentManagement';
import React, { Suspense } from 'react';

interface AdminAssignmentsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminAssignmentsPage({
  searchParams,
}: AdminAssignmentsPageProps) {
  const [initialData, mentorsData] = await Promise.all([
    getAdminAssignments(''),
    getAvailableMentorsList(),
  ]);

  const batchOptions = [
    { label: 'Batch 01', value: 'BATCH-01' },
    { label: 'Batch 02', value: 'BATCH-02' },
    { label: 'Batch 03', value: 'BATCH-03' },
  ];

  const statusOptions = [
    { label: 'Published', value: 'PUBLISHED' },
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Archived', value: 'ARCHIVED' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header with modal trigger */}
      <AssignmentManagementHeader
        totalCount={initialData.meta.total}
        availableMentors={mentorsData.data}
      />

      {/* 2. Search & Filter Bar */}
      <Suspense fallback={null}>
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <SearchFilter
            paramName="searchTerm"
            placeholder="Search assignments by title or batch..."
            className="flex-1"
          />
          <div className="flex flex-wrap items-center gap-2">
            <SelectFilter
              paramName="batchId"
              placeholder="Filter Batch"
              allLabel="All Batches"
              icon="Layers"
              options={batchOptions}
            />
            <SelectFilter
              paramName="status"
              placeholder="Filter Status"
              allLabel="All Statuses"
              icon="SlidersHorizontal"
              options={statusOptions}
            />
            <RefreshButton />
          </div>
        </div>
      </Suspense>

      {/* 3. Table Container */}
      <Suspense fallback={<TableSkeleton columns={6} rows={6} />}>
        <AssignmentTableContainer searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
