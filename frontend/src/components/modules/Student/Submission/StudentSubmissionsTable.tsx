'use client';

import ManagementTable from '@/components/shared/ManagementTable';
import { ISubmission } from '@/types/submission.interface';
import { useState } from 'react';
import { submissionColumns } from './submissionColumn';
import SubmissionDetailDialog from './SubmissionDetailDialog';

interface StudentSubmissionsTableProps {
  submissions: ISubmission[];
}

export default function StudentSubmissionsTable({
  submissions,
}: StudentSubmissionsTableProps) {
  const [viewingSubmission, setViewingSubmission] = useState<ISubmission | null>(null);

  const handleView = (submission: ISubmission) => {
    setViewingSubmission(submission);
  };

  return (
    <>
      <ManagementTable
        data={submissions}
        columns={submissionColumns}
        getRowKey={(row) => row.id}
        onView={handleView}
        emptyMessage="No Submissions found with the selected filters"
      />

      {/* Submission & Evaluation Details Modal */}
      <SubmissionDetailDialog
        open={Boolean(viewingSubmission)}
        submission={viewingSubmission}
        onClose={() => setViewingSubmission(null)}
      />
    </>
  );
}

