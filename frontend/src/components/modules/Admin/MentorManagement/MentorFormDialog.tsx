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
import { mentorSpecializations } from '@/services/admin/mockMentors';
import { initialBatches } from '@/services/admin/mockStudents';
import { updateMentor } from '@/services/admin/mentorManagement';
import { IMentor, MentorGender, MentorStatus } from '@/types/mentor.interface';
import { Loader2 } from 'lucide-react';
import React, { useActionState, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface MentorFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mentor: IMentor;
}

export default function MentorFormDialog({
  open,
  onClose,
  onSuccess,
  mentor,
}: MentorFormDialogProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [gender, setGender] = useState<MentorGender>(mentor?.gender || 'MALE');
  const [status, setStatus] = useState<MentorStatus>(mentor?.status || 'ACTIVE');
  const [expertise, setExpertise] = useState<string>(
    mentor?.expertise || mentorSpecializations[0].value
  );
  const [batchId, setBatchId] = useState<string>(
    mentor?.assignedBatches?.[0]?.id || initialBatches[0].id
  );

  const [state, formAction, isPending] = useActionState(
    updateMentor.bind(null, mentor.id),
    null
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || 'Mentor details updated successfully!');
      formRef.current?.reset();
      onSuccess();
      onClose();
    } else if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state, onSuccess, onClose]);

  const handleClose = () => {
    formRef.current?.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] w-full sm:max-w-xl flex flex-col p-0 overflow-hidden shadow-2xl rounded-xl border border-border/70">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50 shrink-0">
          <DialogTitle className="text-xl font-bold tracking-tight">Edit Mentor Details</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Update mentor assignments, specialization, contact information, and status.
          </DialogDescription>
        </DialogHeader>

        <form
          ref={formRef}
          action={formAction}
          noValidate
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <FieldGroup className="gap-5">
              {/* Immutable Credentials Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field className="gap-1.5">
                  <FieldLabel htmlFor="edit-mentor-email" className="text-xs font-semibold text-foreground/90">
                    Email Address (Immutable)
                  </FieldLabel>
                  <Input
                    id="edit-mentor-email"
                    type="email"
                    defaultValue={mentor.email}
                    disabled
                    className="h-10 bg-muted/50 cursor-not-allowed select-none text-muted-foreground text-xs"
                  />
                  <input type="hidden" name="email" value={mentor.email} />
                  <FieldDescription className="text-[11px] text-muted-foreground">
                    Email cannot be modified
                  </FieldDescription>
                </Field>

                <Field className="gap-1.5">
                  <FieldLabel htmlFor="edit-mentor-id" className="text-xs font-semibold text-foreground/90">
                    Mentor ID (Immutable)
                  </FieldLabel>
                  <Input
                    id="edit-mentor-id"
                    defaultValue={mentor.mentorId}
                    disabled
                    className="h-10 font-mono bg-muted/50 cursor-not-allowed select-none text-muted-foreground text-xs"
                  />
                  <input type="hidden" name="mentorId" value={mentor.mentorId} />
                  <FieldDescription className="text-[11px] text-muted-foreground">
                    System-generated identifier
                  </FieldDescription>
                </Field>
              </div>

              {/* Full Name */}
              <Field className="gap-1.5">
                <FieldLabel htmlFor="edit-mentor-name" className="text-xs font-semibold text-foreground/90">
                  Full Name *
                </FieldLabel>
                <Input
                  id="edit-mentor-name"
                  name="name"
                  defaultValue={mentor.name}
                  required
                  disabled={isPending}
                  className="h-10 text-sm"
                />
                <InputFieldError field="name" state={state} />
              </Field>

              {/* Contact Number & Gender Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field className="gap-1.5">
                  <FieldLabel htmlFor="edit-mentor-contact" className="text-xs font-semibold text-foreground/90">
                    Contact Number *
                  </FieldLabel>
                  <Input
                    id="edit-mentor-contact"
                    name="contactNumber"
                    defaultValue={mentor.contactNumber}
                    required
                    disabled={isPending}
                    className="h-10 text-sm"
                  />
                  <InputFieldError field="contactNumber" state={state} />
                </Field>

                <Field className="gap-1.5">
                  <FieldLabel className="text-xs font-semibold text-foreground/90">Gender *</FieldLabel>
                  <input type="hidden" name="gender" value={gender} />
                  <Select value={gender} onValueChange={(val) => { if (val) setGender(val as MentorGender); }} disabled={isPending}>
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

              {/* Specialization & Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field className="gap-1.5">
                  <FieldLabel className="text-xs font-semibold text-foreground/90">Specialization *</FieldLabel>
                  <input type="hidden" name="expertise" value={expertise} />
                  <Select value={expertise} onValueChange={(val) => { if (val) setExpertise(val); }} disabled={isPending}>
                    <SelectTrigger className="w-full h-10 text-xs">
                      <SelectValue placeholder="Select Specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      {mentorSpecializations.map((spec) => (
                        <SelectItem key={spec.value} value={spec.value}>{spec.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <InputFieldError field="expertise" state={state} />
                </Field>

                <Field className="gap-1.5">
                  <FieldLabel className="text-xs font-semibold text-foreground/90">Academic Status *</FieldLabel>
                  <input type="hidden" name="status" value={status} />
                  <Select value={status} onValueChange={(val) => { if (val) setStatus(val as MentorStatus); }} disabled={isPending}>
                    <SelectTrigger className="w-full h-10 text-xs">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                      <SelectItem value="ON_LEAVE">On Leave</SelectItem>
                      <SelectItem value="BLOCKED">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                  <InputFieldError field="status" state={state} />
                </Field>
              </div>

              {/* Assigned Batch */}
              <Field className="gap-1.5">
                <FieldLabel className="text-xs font-semibold text-foreground/90">Assigned Batch *</FieldLabel>
                <input type="hidden" name="assignedBatchId" value={batchId} />
                <Select value={batchId} onValueChange={(val) => { if (val) setBatchId(val); }} disabled={isPending}>
                  <SelectTrigger className="w-full h-10 text-xs">
                    <SelectValue placeholder="Select Batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {initialBatches.map((batch) => (
                      <SelectItem key={batch.id} value={batch.id}>{batch.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputFieldError field="assignedBatchId" state={state} />
              </Field>

              {/* Social Links Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field className="gap-1.5">
                  <FieldLabel htmlFor="edit-mentor-github" className="text-xs font-semibold text-foreground/90">
                    GitHub Username
                  </FieldLabel>
                  <Input
                    id="edit-mentor-github"
                    name="githubUsername"
                    defaultValue={mentor.githubUsername || ''}
                    placeholder="e.g. rasel-mahmud"
                    disabled={isPending}
                    className="h-10 text-sm"
                  />
                </Field>

                <Field className="gap-1.5">
                  <FieldLabel htmlFor="edit-mentor-linkedin" className="text-xs font-semibold text-foreground/90">
                    LinkedIn URL
                  </FieldLabel>
                  <Input
                    id="edit-mentor-linkedin"
                    name="linkedinUrl"
                    defaultValue={mentor.linkedinUrl || ''}
                    placeholder="https://linkedin.com/in/..."
                    disabled={isPending}
                    className="h-10 text-sm"
                  />
                </Field>
              </div>

              {/* Bio Field */}
              <Field className="gap-1.5">
                <FieldLabel htmlFor="edit-mentor-bio" className="text-xs font-semibold text-foreground/90">
                  Bio & Background
                </FieldLabel>
                <Input
                  id="edit-mentor-bio"
                  name="bio"
                  defaultValue={mentor.bio || ''}
                  placeholder="Brief summary of expertise..."
                  disabled={isPending}
                  className="h-10 text-sm"
                />
              </Field>
            </FieldGroup>
          </div>

          {/* Action Footer Buttons */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border/60 bg-muted/15 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={handleClose}
              disabled={isPending}
              className="h-9 px-4 text-xs font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="default"
              disabled={isPending}
              className="h-9 px-5 min-w-28 text-xs font-semibold shadow-sm"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
