import BatchManagementHeader from '@/components/modules/Admin/BatchManagement/BatchManagementHeader';
import BatchTableContainer from '@/components/modules/Admin/BatchManagement/BatchTableContainer';
import RefreshButton from '@/components/shared/RefreshButton';
import SearchFilter from '@/components/shared/SearchFilter';
import SelectFilter from '@/components/shared/SelectFilter';
import TableSkeleton from '@/components/shared/TableSkeleton';
import React, { Suspense } from 'react';

interface AdminBatchesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function AdminBatchesPage({
  searchParams,
}: AdminBatchesPageProps) {
  const statusOptions = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Upcoming', value: 'UPCOMING' },
    { label: 'Completed', value: 'COMPLETED' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header with modal trigger */}
      <BatchManagementHeader totalCount={0} />

      {/* 2. Search & Filter Bar */}
      <Suspense fallback={<div className="h-10 w-full rounded-lg bg-muted/20 animate-pulse" />}>
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <SearchFilter
            paramName="searchTerm"
            placeholder="Search batches by name, code, or track..."
            className="flex-1"
          />
          <div className="flex flex-wrap items-center gap-2">
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
      <Suspense fallback={<TableSkeleton columns={5} rows={6} />}>
        <BatchTableContainer searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
