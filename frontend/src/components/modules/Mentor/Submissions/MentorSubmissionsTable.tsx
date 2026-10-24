'use client';

import ManagementTable from '@/components/shared/ManagementTable';
import { ISubmission } from '@/types/submission.interface';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { createMentorSubmissionColumns } from './mentorSubmissionColumns';
import MentorSubmissionReviewDialog from './MentorSubmissionReviewDialog';
import MentorSubmissionViewDialog from './MentorSubmissionViewDialog';

interface MentorSubmissionsTableProps {
  submissions: ISubmission[];
}

export default function MentorSubmissionsTable({
  submissions,
}: MentorSubmissionsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [viewingSubmission, setViewingSubmission] = useState<ISubmission | null>(null);
  const [reviewingSubmission, setReviewingSubmission] = useState<ISubmission | null>(null);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleView = (sub: ISubmission) => {
    setViewingSubmission(sub);
  };

  const handleReview = (sub: ISubmission) => {
    setReviewingSubmission(sub);
  };

  const columns = useMemo(
    () =>
      createMentorSubmissionColumns({
        onView: handleView,
        onReview: handleReview,
      }),
    []
  );

  return (
    <>
      <ManagementTable
        data={submissions}
        columns={columns}
        getRowKey={(row) => row.id}
        emptyMessage="No submissions found matching your search or filters."
        isRefreshing={isPending}
      />

      {/* Details View Modal */}
      <MentorSubmissionViewDialog
        open={Boolean(viewingSubmission)}
        submission={viewingSubmission}
        onClose={() => setViewingSubmission(null)}
        onEvaluate={(sub) => {
          setViewingSubmission(null);
          setReviewingSubmission(sub);
        }}
      />

      {/* Review / Evaluation Form Modal */}
      <MentorSubmissionReviewDialog
        open={Boolean(reviewingSubmission)}
        submission={reviewingSubmission}
        onClose={() => setReviewingSubmission(null)}
        onSuccess={() => {
          setReviewingSubmission(null);
          handleRefresh();
        }}
      />
    </>
  );
}
