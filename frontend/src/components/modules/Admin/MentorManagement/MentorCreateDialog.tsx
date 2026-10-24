'use client';

import InputFieldError from '@/components/shared/InputFieldError';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createMentor } from '@/services/admin/mentorManagement';
import { Copy, KeyRound, Loader2, RefreshCw } from 'lucide-react';
import React, { useActionState, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface MentorCreateDialogProps {
  open: boolean;
  batches?: { id: string; name: string }[];
  specializations?: { label: string; value: string }[];
  onClose: () => void;
  onSuccess: () => void;
}

const fallbackSpecializations = [
  { label: 'Next.js & React Ecosystem', value: 'Next.js & React Ecosystem' },
  { label: 'Full Stack MERN', value: 'Full Stack MERN' },
  { label: 'Backend Architecture & Node.js', value: 'Backend Architecture & Node.js' },
  { label: 'TypeScript & System Design', value: 'TypeScript & System Design' },
];

export default function MentorCreateDialog({
  open,
  batches = [],
  specializations = fallbackSpecializations,
  onClose,
  onSuccess,
}: MentorCreateDialogProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [temporaryPassword, setTemporaryPassword] = useState(
    () => 'Pass@' + Math.floor(100000 + Math.random() * 900000)
  );
  const [gender, setGender] = useState('MALE');
  const [expertise, setExpertise] = useState(specializations[0]?.value || 'Next.js & React Ecosystem');
  const [batchId, setBatchId] = useState(batches[0]?.id || 'BATCH-01');

  const [state, formAction, isPending] = useActionState(createMentor, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || 'Mentor registered successfully!');
      formRef.current?.reset();
      onSuccess();
      onClose();
    } else if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state, onSuccess, onClose]);

  const handleGeneratePassword = () => {
    setTemporaryPassword('Pass@' + Math.floor(100000 + Math.random() * 900000));
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(temporaryPassword);
    toast.success('Temporary password copied to clipboard!');
  };

  const availableBatches = batches.length > 0 ? batches : [{ id: 'BATCH-01', name: 'Batch 01 (General)' }];
  const availableSpecs = specializations.length > 0 ? specializations : fallbackSpecializations;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] w-full sm:max-w-xl flex flex-col p-0 overflow-hidden shadow-2xl rounded-xl border border-border/70">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50 shrink-0">
          <DialogTitle className="text-xl font-bold tracking-tight">Add New Mentor</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Onboard a mentor and generate temporary credentials for assignment reviews.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={formAction} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <FieldGroup className="gap-5">
              <Field className="gap-1.5">
                <FieldLabel htmlFor="create-mentor-name" className="text-xs font-semibold text-foreground/90">
                  Full Name *
                </FieldLabel>
                <Input id="create-mentor-name" name="name" placeholder="e.g. Rasel Mahmud" required disabled={isPending} className="h-10 text-sm" />
                <InputFieldError field="name" state={state} />
              </Field>

              <Field className="gap-1.5">
                <FieldLabel htmlFor="create-mentor-email" className="text-xs font-semibold text-foreground/90">
                  Email Address *
                </FieldLabel>
                <Input id="create-mentor-email" name="email" type="email" placeholder="mentor@programminghero.com" required disabled={isPending} className="h-10 text-sm" />
                <InputFieldError field="email" state={state} />
              </Field>

              <Field className="gap-1.5">
                <FieldLabel htmlFor="create-mentor-pass" className="text-xs font-semibold text-foreground/90">
                  One-Time Temporary Password *
                </FieldLabel>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <KeyRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <Input
                      id="create-mentor-pass"
                      name="temporaryPassword"
                      value={temporaryPassword}
                      onChange={(e) => setTemporaryPassword(e.target.value)}
                      className="h-10 pl-9 font-mono text-xs"
                      required
                      disabled={isPending}
                    />
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={handleGeneratePassword} title="Generate new password" disabled={isPending} className="h-10 px-3">
                    <RefreshCw className="size-3.5" />
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={handleCopyPassword} title="Copy password" disabled={isPending} className="h-10 px-3">
                    <Copy className="size-3.5" />
                  </Button>
                </div>
                <FieldDescription className="text-[11px] text-muted-foreground mt-1.5 leading-normal">
                  Mentor will be prompted to change this temporary password upon first sign-in.
                </FieldDescription>
                <InputFieldError field="temporaryPassword" state={state} />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field className="gap-1.5">
                  <FieldLabel htmlFor="create-mentor-contact" className="text-xs font-semibold text-foreground/90">
                    Contact Number *
                  </FieldLabel>
                  <Input id="create-mentor-contact" name="contactNumber" placeholder="+8801700112233" required disabled={isPending} className="h-10 text-sm" />
                  <InputFieldError field="contactNumber" state={state} />
                </Field>

                <Field className="gap-1.5">
                  <FieldLabel className="text-xs font-semibold text-foreground/90">Gender *</FieldLabel>
                  <input type="hidden" name="gender" value={gender} />
                  <Select value={gender} onValueChange={(val) => { if (val) setGender(val); }} disabled={isPending}>
                    <SelectTrigger className="w-full h-10 text-xs">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <InputFieldError field="gender" state={state} />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field className="gap-1.5">
                  <FieldLabel className="text-xs font-semibold text-foreground/90">Specialization *</FieldLabel>
                  <input type="hidden" name="expertise" value={expertise} />
                  <Select value={expertise} onValueChange={(val) => { if (val) setExpertise(val); }} disabled={isPending}>
                    <SelectTrigger className="w-full h-10 text-xs">
                      <SelectValue placeholder="Select Specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSpecs.map((spec) => (
                        <SelectItem key={spec.value} value={spec.value}>{spec.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <InputFieldError field="expertise" state={state} />
                </Field>

                <Field className="gap-1.5">
                  <FieldLabel className="text-xs font-semibold text-foreground/90">Assigned Batch *</FieldLabel>
                  <input type="hidden" name="assignedBatchId" value={batchId} />
                  <Select value={batchId} onValueChange={(val) => { if (val) setBatchId(val); }} disabled={isPending}>
                    <SelectTrigger className="w-full h-10 text-xs">
                      <SelectValue placeholder="Select Batch" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableBatches.map((batch) => (
                        <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <InputFieldError field="assignedBatchId" state={state} />
                </Field>
              </div>

              <Field className="gap-1.5">
                <FieldLabel htmlFor="create-mentor-bio" className="text-xs font-semibold text-foreground/90">
                  Bio & Background (Optional)
                </FieldLabel>
                <Input id="create-mentor-bio" name="bio" placeholder="Brief summary of expertise..." disabled={isPending} className="h-10 text-sm" />
                <InputFieldError field="bio" state={state} />
              </Field>
            </FieldGroup>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border/60 bg-muted/15 shrink-0">
            <Button type="button" variant="outline" size="default" onClick={onClose} disabled={isPending} className="h-9 px-4 text-xs font-medium">
              Cancel
            </Button>
            <Button type="submit" size="default" disabled={isPending} className="h-9 px-5 min-w-28 text-xs font-semibold shadow-sm">
              {isPending ? (
                <>
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Add Mentor'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
