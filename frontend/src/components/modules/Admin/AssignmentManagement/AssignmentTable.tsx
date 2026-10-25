'use client';

import DeleteConfirmationDialog from '@/components/shared/DeleteConfirmationDialog';
import ManagementTable from '@/components/shared/ManagementTable';
import { MentorOption } from '@/hooks/useAssignmentCreateForm';
import { deleteAssignmentAction } from '@/services/assignments/assignmentManagement';
import { IBackendAssignment } from '@/types/assignment.interface';
import { IBatchOption } from '@/types/batch.interface';
import { useRouter } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { assignmentColumns } from './assignmentColumn';
import AssignmentEditDialog from './AssignmentEditDialog';
import AssignmentViewDetailDialog from './AssignmentViewDetailDialog';

interface AssignmentTableProps {
  assignments: IBackendAssignment[];
  availableMentors?: MentorOption[];
  availableBatches?: IBatchOption[];
}

export default function AssignmentTable({
  assignments,
  availableMentors = [],
  availableBatches = [],
}: AssignmentTableProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [viewingAssignment, setViewingAssignment] = useState<IBackendAssignment | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<IBackendAssignment | null>(null);
  const [deletingAssignment, setDeletingAssignment] = useState<IBackendAssignment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleView = (assignment: IBackendAssignment) => {
    setViewingAssignment(assignment);
  };

  const handleEdit = (assignment: IBackendAssignment) => {
    setEditingAssignment(assignment);
  };

  const handleDelete = (assignment: IBackendAssignment) => {
    setDeletingAssignment(assignment);
  };

  const confirmDelete = async () => {
    if (!deletingAssignment) return;

    setIsDeleting(true);
    const result = await deleteAssignmentAction(deletingAssignment.id);
    setIsDeleting(false);

    if (result.success) {
      toast.success(result.message || 'Assignment removed successfully');
      setDeletingAssignment(null);
      handleRefresh();
    } else {
      toast.error(result.message || 'Failed to delete assignment');
    }
  };

  const deleteWarningMessage = deletingAssignment
    ? `⚠️ Warning: This action is irreversible! Deleting assignment "${deletingAssignment.title}" will permanently remove all associated student submissions, awarded marks, reviews, and mentor quota allocations from the database. Are you sure you want to proceed?`
    : undefined;

  return (
    <>
      <ManagementTable
        data={assignments}
        columns={assignmentColumns}
        getRowKey={(row) => row.id}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No assignments found. Click 'Create Assignment' to create one."
      />

      {/* 1. View Details Dialog */}
      <AssignmentViewDetailDialog
        open={Boolean(viewingAssignment)}
        assignment={viewingAssignment}
        onClose={() => setViewingAssignment(null)}
      />

      {/* 2. Edit Assignment Dialog */}
      {editingAssignment && (
        <AssignmentEditDialog
          open={Boolean(editingAssignment)}
          assignment={editingAssignment}
          availableMentors={availableMentors}
          availableBatches={availableBatches}
          onClose={() => setEditingAssignment(null)}
          onSuccess={() => {
            setEditingAssignment(null);
            handleRefresh();
          }}
        />
      )}

      {/* 3. High-Caution Cascade Delete Dialog */}
      <DeleteConfirmationDialog
        open={Boolean(deletingAssignment)}
        onOpenChange={(open) => !open && setDeletingAssignment(null)}
        onConfirm={confirmDelete}
        title="Delete Assignment & Associated Records"
        itemName={deletingAssignment?.title}
        description={deleteWarningMessage}
        isDeleting={isDeleting}
      />
    </>
  );
}
