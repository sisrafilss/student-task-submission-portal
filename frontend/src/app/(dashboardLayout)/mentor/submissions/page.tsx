import MentorSubmissionsContainer from '@/components/modules/Mentor/Submissions/MentorSubmissionsContainer';
import MentorSubmissionsOverview from '@/components/modules/Mentor/Submissions/MentorSubmissionsOverview';
import TableSkeleton from '@/components/shared/TableSkeleton';
import { Suspense } from 'react';

interface MentorSubmissionsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default function MentorSubmissionsPage({
  searchParams,
}: MentorSubmissionsPageProps) {
  return (
    <div className="space-y-6">
      <Suspense fallback={<div className="h-32 w-full rounded-lg bg-muted/20 animate-pulse" />}>
        <MentorSubmissionsOverview />
      </Suspense>

      <Suspense fallback={<TableSkeleton columns={7} rows={8} />}>
        <MentorSubmissionsContainer searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
