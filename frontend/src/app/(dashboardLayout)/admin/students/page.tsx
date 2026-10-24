import StudentFilterToolbar from '@/components/modules/Admin/StudentManagement/StudentFilterToolbar';
import StudentManagementHeaderContainer from '@/components/modules/Admin/StudentManagement/StudentManagementHeaderContainer';
import StudentTableContainer from '@/components/modules/Admin/StudentManagement/StudentTableContainer';
import TableSkeleton from '@/components/shared/TableSkeleton';
import { Suspense } from 'react';

interface AdminStudentsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function AdminStudentsPage({ searchParams }: AdminStudentsPageProps) {
  return (
    <div className="space-y-6">
      {/* 1. Page Header with dynamic batches */}
      <Suspense fallback={<div className="h-16 w-full rounded-lg bg-muted/20 animate-pulse" />}>
        <StudentManagementHeaderContainer />
      </Suspense>

      {/* 2. Filter and Search Controls Toolbar wrapped in Suspense */}
      <Suspense fallback={<div className="h-10 w-full rounded-lg bg-muted/20 animate-pulse" />}>
        <StudentFilterToolbar />
      </Suspense>

      {/* 3. Student Data Table & Pagination dynamically streamed inside Suspense */}
      <Suspense fallback={<TableSkeleton columns={7} rows={8} />}>
        <StudentTableContainer searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
