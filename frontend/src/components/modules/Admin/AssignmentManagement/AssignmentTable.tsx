'use client';

import ManagementTable from '@/components/shared/ManagementTable';
import { IBackendAssignment } from '@/types/assignment.interface';
import React, { useState } from 'react';
import { assignmentColumns } from './assignmentColumn';
import AssignmentViewDetailDialog from './AssignmentViewDetailDialog';

interface AssignmentTableProps {
  assignments: IBackendAssignment[];
}

export default function AssignmentTable({ assignments }: AssignmentTableProps) {
  const [viewingAssignment, setViewingAssignment] = useState<IBackendAssignment | null>(null);

  const handleView = (assignment: IBackendAssignment) => {
    setViewingAssignment(assignment);
  };

  return (
    <>
      <ManagementTable
        data={assignments}
        columns={assignmentColumns}
        getRowKey={(row) => row.id}
        onView={handleView}
        emptyMessage="No assignments found. Click 'Create Assignment' to create one."
      />

      <AssignmentViewDetailDialog
        open={Boolean(viewingAssignment)}
        assignment={viewingAssignment}
        onClose={() => setViewingAssignment(null)}
      />
    </>
  );
}

