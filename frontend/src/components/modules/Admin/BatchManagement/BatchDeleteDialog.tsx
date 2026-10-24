'use client';

import DeleteConfirmationDialog from '@/components/shared/DeleteConfirmationDialog';
import { deleteBatchAction } from '@/services/batch/batchManagement';
import { IBatch } from '@/types/batch.interface';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

interface BatchDeleteDialogProps {
  batch: IBatch | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function BatchDeleteDialog({
  batch,
  open,
  onClose,
  onSuccess,
}: BatchDeleteDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    if (!batch) return;

    startTransition(async () => {
      const result = await deleteBatchAction(batch.id);
      if (result.success) {
        toast.success(result.message || 'Batch deleted successfully');
        onSuccess?.();
        onClose();
      } else {
        toast.error(result.message || 'Failed to delete batch');
      }
    });
  };

  if (!batch) return null;

  return (
    <DeleteConfirmationDialog
      open={open}
      onOpenChange={(isOpen) => !isOpen && onClose()}
      onConfirm={handleConfirm}
      isDeleting={isPending}
      title="Delete Batch"
      description={`Are you sure you want to delete batch "${batch.name}" (${batch.batchCode})? This action cannot be undone if no assignments are associated.`}
    />
  );
}
