'use client';

import InputFieldError from '@/components/shared/InputFieldError';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  createBatchAction,
  updateBatchAction,
} from '@/services/batch/batchManagement';
import { IActionResult } from '@/types/action.interface';
import { BatchStatus, IBatch } from '@/types/batch.interface';
import React, { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface BatchFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  batchToEdit?: IBatch | null;
}

export default function BatchFormDialog({
  open,
  onClose,
  onSuccess,
  batchToEdit,
}: BatchFormDialogProps) {
  const isEditing = Boolean(batchToEdit);

  // Form action binding based on mode
  const boundAction = async (
    prevState: IActionResult | null,
    formData: FormData
  ): Promise<IActionResult> => {
    if (isEditing && batchToEdit) {
      return updateBatchAction(batchToEdit.id, prevState, formData);
    }
    return createBatchAction(prevState, formData);
  };

  const [state, formAction, isPending] = useActionState(boundAction, null);

  // Local controlled state initialized from batchToEdit (reset via key remounting)
  const [name, setName] = useState(batchToEdit?.name || '');
  const [batchCode, setBatchCode] = useState(batchToEdit?.batchCode || '');
  const [track, setTrack] = useState(batchToEdit?.track || '');
  const [status, setStatus] = useState<BatchStatus>(batchToEdit?.status || 'ACTIVE');

  // Handle toast notifications and modal close
  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message);
    } else if (state && state.success && state.message) {
      toast.success(state.message);
      onSuccess?.();
      onClose();
    }
  }, [state, onSuccess, onClose]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-lg p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-5 border-b border-border/60">
          <DialogTitle className="text-xl font-bold tracking-tight">
            {isEditing ? 'Edit Batch' : 'Create New Batch'}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isEditing
              ? 'Update existing batch parameters and course track details.'
              : 'Add a new academic batch to enroll students and distribute assignments.'}
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} noValidate className="flex flex-col">
          <ScrollArea className="max-h-[75vh] px-6 py-5" orientation="vertical">
            <FieldGroup className="space-y-4">
              {/* Batch Name */}
              <Field>
                <FieldLabel htmlFor="name" className="text-xs font-semibold">
                  Batch Name *
                </FieldLabel>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. Batch 10 - Web Development"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 text-sm"
                  required
                />
                <InputFieldError field="name" state={state} />
              </Field>

              {/* Batch Code */}
              <Field>
                <FieldLabel htmlFor="batchCode" className="text-xs font-semibold">
                  Batch Code / ID *
                </FieldLabel>
                <Input
                  id="batchCode"
                  name="batchCode"
                  placeholder="e.g. BATCH-10"
                  value={batchCode}
                  onChange={(e) => setBatchCode(e.target.value)}
                  className="h-10 text-sm font-mono uppercase"
                  required
                />
                <InputFieldError field="batchCode" state={state} />
              </Field>

              {/* Course Track */}
              <Field>
                <FieldLabel htmlFor="track" className="text-xs font-semibold">
                  Course Track *
                </FieldLabel>
                <Input
                  id="track"
                  name="track"
                  placeholder="e.g. Full Stack Web or Next.js Architecture"
                  value={track}
                  onChange={(e) => setTrack(e.target.value)}
                  className="h-10 text-sm"
                  required
                />
                <InputFieldError field="track" state={state} />
              </Field>

              {/* Status */}
              <Field>
                <FieldLabel htmlFor="status" className="text-xs font-semibold">
                  Status *
                </FieldLabel>
                <select
                  id="status"
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as BatchStatus)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="UPCOMING">UPCOMING</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
                <InputFieldError field="status" state={state} />
              </Field>
            </FieldGroup>
          </ScrollArea>

          <DialogFooter className="px-6 py-4 border-t border-border/60 bg-muted/20 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className="font-medium"
            >
              {isPending
                ? isEditing
                  ? 'Updating...'
                  : 'Creating...'
                : isEditing
                ? 'Save Changes'
                : 'Create Batch'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

