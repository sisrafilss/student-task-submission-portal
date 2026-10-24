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
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createStudent } from '@/services/admin/studentManagement';
import { IBatch, StudentGender, StudentStatus } from '@/types/student.interface';
import { Loader2 } from 'lucide-react';
import React, { useActionState, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface StudentCreateDialogProps {
  open: boolean;
  batches: IBatch[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function StudentCreateDialog({
  open,
  batches,
  onClose,
  onSuccess,
}: StudentCreateDialogProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [gender, setGender] = useState<StudentGender>('MALE');
  const [status, setStatus] = useState<StudentStatus>('ACTIVE');
  const [batchId, setBatchId] = useState<string>(batches[0]?.id || 'BATCH-01');

  const [state, formAction, isPending] = useActionState(createStudent, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || 'Student enrolled successfully!');
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
          <DialogTitle className="text-xl font-bold tracking-tight">Add New Student</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            Enroll a new student to a batch and configure their track credentials.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={formAction} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <FieldGroup className="gap-4">
              <Field className="gap-1.5">
                <FieldLabel htmlFor="create-stu-name" className="text-xs font-semibold">Full Name *</FieldLabel>
                <Input id="create-stu-name" name="name" placeholder="e.g. Tanvir Rahman" required disabled={isPending} className="h-10 text-sm" />
                <InputFieldError field="name" state={state} />
              </Field>

              <Field className="gap-1.5">
                <FieldLabel htmlFor="create-stu-email" className="text-xs font-semibold">Email Address *</FieldLabel>
                <Input id="create-stu-email" name="email" type="email" placeholder="student@example.com" required disabled={isPending} className="h-10 text-sm" />
                <InputFieldError field="email" state={state} />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field className="gap-1.5">
                  <FieldLabel htmlFor="create-stu-pass" className="text-xs font-semibold">Password *</FieldLabel>
                  <Input id="create-stu-pass" name="password" type="password" placeholder="Min 6 characters" required disabled={isPending} className="h-10 text-sm" />
                  <InputFieldError field="password" state={state} />
                </Field>
                <Field className="gap-1.5">
                  <FieldLabel htmlFor="create-stu-confpass" className="text-xs font-semibold">Confirm Password *</FieldLabel>
                  <Input id="create-stu-confpass" name="confirmPassword" type="password" placeholder="Re-enter password" required disabled={isPending} className="h-10 text-sm" />
                  <InputFieldError field="confirmPassword" state={state} />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field className="gap-1.5">
                  <FieldLabel htmlFor="create-stu-id" className="text-xs font-semibold">Student ID / Roll *</FieldLabel>
                  <Input id="create-stu-id" name="studentId" placeholder="e.g. WEB-B10-045" required disabled={isPending} className="h-10 text-sm font-mono" />
                  <InputFieldError field="studentId" state={state} />
                </Field>

                <Field className="gap-1.5">
                  <FieldLabel className="text-xs font-semibold">Target Batch *</FieldLabel>
                  <input type="hidden" name="batchId" value={batchId} />
                  <Select value={batchId} onValueChange={(val) => { if (val) setBatchId(val); }} disabled={isPending}>
                    <SelectTrigger className="w-full h-10 text-xs">
                      <SelectValue placeholder="Select Batch" />
                    </SelectTrigger>
                    <SelectContent>
                      {batches.map((b) => (
                        <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <InputFieldError field="batchId" state={state} />
                </Field>
              </div>

              <Field className="gap-1.5">
                <FieldLabel htmlFor="create-stu-track" className="text-xs font-semibold">Enrolled Track / Program *</FieldLabel>
                <Input id="create-stu-track" name="enrolledTrack" placeholder="e.g. Full Stack Web Development" defaultValue="Full Stack Web Development" required disabled={isPending} className="h-10 text-sm" />
                <InputFieldError field="enrolledTrack" state={state} />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field className="gap-1.5">
                  <FieldLabel htmlFor="create-stu-phone" className="text-xs font-semibold">Contact Number *</FieldLabel>
                  <Input id="create-stu-phone" name="contactNumber" placeholder="+8801700000000" required disabled={isPending} className="h-10 text-sm" />
                  <InputFieldError field="contactNumber" state={state} />
                </Field>

                <Field className="gap-1.5">
                  <FieldLabel className="text-xs font-semibold">Gender *</FieldLabel>
                  <input type="hidden" name="gender" value={gender} />
                  <Select value={gender} onValueChange={(val) => { if (val) setGender(val as StudentGender); }} disabled={isPending}>
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

              <Field className="gap-1.5">
                <FieldLabel htmlFor="create-stu-address" className="text-xs font-semibold">Address</FieldLabel>
                <Input id="create-stu-address" name="address" placeholder="e.g. Dhanmondi, Dhaka" disabled={isPending} className="h-10 text-sm" />
                <InputFieldError field="address" state={state} />
              </Field>
            </FieldGroup>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border/60 bg-muted/15 shrink-0">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending} className="h-9 px-4 text-xs font-medium">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="h-9 px-5 min-w-28 text-xs font-semibold shadow-sm">
              {isPending ? (
                <>
                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                  Enrolling...
                </>
              ) : (
                'Add Student'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

