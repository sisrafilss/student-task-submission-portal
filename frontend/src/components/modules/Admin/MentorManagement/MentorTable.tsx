'use client';

import DeleteConfirmationDialog from '@/components/shared/DeleteConfirmationDialog';
import ManagementTable from '@/components/shared/ManagementTable';
import { deleteMentor } from '@/services/admin/mentorManagement';
import { IMentor } from '@/types/mentor.interface';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { mentorColumns } from './mentorColumn';
import MentorFormDialog from './MentorFormDialog';
import MentorViewDetailDialog from './MentorViewDetailDialog';

interface MentorTableProps {
  mentors: IMentor[];
  batches?: { id: string; name: string }[];
  specializations?: { label: string; value: string }[];
}

export default function MentorTable({
  mentors,
  batches = [],
  specializations = [],
}: MentorTableProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [deletingMentor, setDeletingMentor] = useState<IMentor | null>(null);
  const [viewingMentor, setViewingMentor] = useState<IMentor | null>(null);
  const [editingMentor, setEditingMentor] = useState<IMentor | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleView = (mentor: IMentor) => {
    setViewingMentor(mentor);
  };

  const handleEdit = (mentor: IMentor) => {
    setEditingMentor(mentor);
  };

  const handleDelete = (mentor: IMentor) => {
    setDeletingMentor(mentor);
  };

  const confirmDelete = async () => {
    if (!deletingMentor) return;

    setIsDeleting(true);
    const result = await deleteMentor(deletingMentor.id);
    setIsDeleting(false);

    if (result.success) {
      toast.success(result.message || 'Mentor removed successfully');
      setDeletingMentor(null);
      handleRefresh();
    } else {
      toast.error(result.message || 'Failed to remove mentor');
    }
  };

  return (
    <>
      <ManagementTable
        data={mentors}
        columns={mentorColumns}
        getRowKey={(row) => row.id}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No Mentors found with the selected filters"
      />

      {/* Edit Mentor Form Modal */}
      {editingMentor && (
        <MentorFormDialog
          open={Boolean(editingMentor)}
          mentor={editingMentor}
          batches={batches}
          specializations={specializations}
          onClose={() => setEditingMentor(null)}
          onSuccess={() => {
            setEditingMentor(null);
            handleRefresh();
          }}
        />
      )}

      {/* Mentor View Detail Profile Modal */}
      <MentorViewDetailDialog
        open={Boolean(viewingMentor)}
        mentor={viewingMentor}
        onClose={() => setViewingMentor(null)}
      />

      {/* Delete Confirmation Alert Modal */}
      <DeleteConfirmationDialog
        open={Boolean(deletingMentor)}
        onOpenChange={(open) => !open && setDeletingMentor(null)}
        onConfirm={confirmDelete}
        title="Remove Mentor Record"
        itemName={deletingMentor?.name}
        description={`Are you sure you want to remove ${deletingMentor?.name} (${deletingMentor?.mentorId})? This action will unassign them from their batches.`}
        isDeleting={isDeleting}
      />
    </>
  );
}

