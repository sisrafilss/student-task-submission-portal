import AssignmentManagementHeaderContainer from '@/components/modules/Admin/AssignmentManagement/AssignmentManagementHeaderContainer';
import AssignmentTableContainer from '@/components/modules/Admin/AssignmentManagement/AssignmentTableContainer';
import RefreshButton from '@/components/shared/RefreshButton';
import SearchFilter from '@/components/shared/SearchFilter';
import SelectFilter from '@/components/shared/SelectFilter';
import TableSkeleton from '@/components/shared/TableSkeleton';
import React, { Suspense } from 'react';

interface AdminAssignmentsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function AdminAssignmentsPage({
  searchParams,
}: AdminAssignmentsPageProps) {
  const batchOptions = [
    { label: 'Batch 01 (Full Stack Web)', value: 'BATCH-01' },
    { label: 'Batch 02 (Next.js & Cloud)', value: 'BATCH-02' },
    { label: 'Batch 03 (React Architecture)', value: 'BATCH-03' },
  ];

  const statusOptions = [
    { label: 'Published', value: 'PUBLISHED' },
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Archived', value: 'ARCHIVED' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header with dynamic mentors & batches loaded inside Suspense */}
      <Suspense fallback={<div className="h-16 w-full rounded-lg bg-muted/20 animate-pulse" />}>
        <AssignmentManagementHeaderContainer />
      </Suspense>

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

      {/* 3. Table Container Streamed inside Suspense */}
      <Suspense fallback={<TableSkeleton columns={6} rows={6} />}>
        <AssignmentTableContainer searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
