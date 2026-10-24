import MentorFilterToolbar from '@/components/modules/Admin/MentorManagement/MentorFilterToolbar';
import MentorManagementHeaderContainer from '@/components/modules/Admin/MentorManagement/MentorManagementHeaderContainer';
import MentorTableContainer from '@/components/modules/Admin/MentorManagement/MentorTableContainer';
import TableSkeleton from '@/components/shared/TableSkeleton';
import { Suspense } from 'react';

interface AdminMentorsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function AdminMentorsPage({ searchParams }: AdminMentorsPageProps) {
  return (
    <div className="space-y-6">
      {/* 1. Page Header with dynamic batches & specializations */}
      <Suspense fallback={<div className="h-16 w-full rounded-lg bg-muted/20 animate-pulse" />}>
        <MentorManagementHeaderContainer />
      </Suspense>

      {/* 2. Filter and Search Controls Toolbar wrapped in Suspense */}
      <Suspense fallback={<div className="h-10 w-full rounded-lg bg-muted/20 animate-pulse" />}>
        <MentorFilterToolbar />
      </Suspense>

      {/* 3. Mentor Data Table & Pagination dynamically streamed inside Suspense */}
      <Suspense fallback={<TableSkeleton columns={7} rows={8} />}>
        <MentorTableContainer searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
