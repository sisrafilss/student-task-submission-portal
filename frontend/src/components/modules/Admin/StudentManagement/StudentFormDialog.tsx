'use client';

import InputFieldError from '@/components/shared/InputFieldError';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateStudent } from '@/services/admin/studentManagement';
import { IBatch, IStudent, StudentGender, StudentStatus } from '@/types/student.interface';
import { Loader2 } from 'lucide-react';
import React, { useActionState, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface StudentFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  student: IStudent;
  batches: IBatch[];
}

export default function StudentFormDialog({
  open,
  onClose,
  onSuccess,
  student,
  batches,
}: StudentFormDialogProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [gender, setGender] = useState<StudentGender>(student?.gender || 'MALE');
  const [status, setStatus] = useState<StudentStatus>(student?.status || 'ACTIVE');
  const [batchId, setBatchId] = useState<string>(student?.batchId || batches[0]?.id || 'batch-10');

  const [state, formAction, isPending] = useActionState(
    updateStudent.bind(null, student.id),
    null
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || 'Student details updated successfully!');
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
      <DialogContent className="max-h-[90vh] w-full sm:max-w-xl flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2 border-b border-border/40">
          <DialogTitle className="text-lg font-bold">
            Edit Student Details
          </DialogTitle>
        </DialogHeader>

        <form ref={formRef} action={formAction} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
            {/* Student Full Name */}
            <Field>
              <FieldLabel htmlFor="name">Full Name *</FieldLabel>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Tanvir Hossain"
                defaultValue={student.name}
              />
              <InputFieldError field="name" state={state} />
            </Field>

            {/* Email Address - Non-editable / Disabled */}
            <Field>
              <FieldLabel htmlFor="email">Email Address *</FieldLabel>
              <input type="hidden" name="email" value={student.email} />
              <Input
                id="email"
                type="email"
                defaultValue={student.email}
                disabled
                className="bg-muted/50 cursor-not-allowed text-muted-foreground select-none"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Email cannot be modified (permanent unique identity)
              </p>
              <InputFieldError field="email" state={state} />
            </Field>

            {/* Student ID & Batch */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Student ID - Non-editable / Disabled */}
              <Field>
                <FieldLabel htmlFor="studentId">Student ID / Roll *</FieldLabel>
                <input type="hidden" name="studentId" value={student.studentId} />
                <Input
                  id="studentId"
                  defaultValue={student.studentId}
                  disabled
                  className="bg-muted/50 cursor-not-allowed text-muted-foreground select-none font-mono"
                />
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Auto-generated unique student identifier
                </p>
                <InputFieldError field="studentId" state={state} />
              </Field>

              {/* Batch Selector */}
              <Field>
                <FieldLabel htmlFor="batchId">Batch *</FieldLabel>
                <input type="hidden" name="batchId" value={batchId} />
                <Select value={batchId} onValueChange={(val) => val && setBatchId(val)}>
                  <SelectTrigger id="batchId" className="w-full">
                    <SelectValue placeholder="Select Batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <InputFieldError field="batchId" state={state} />
              </Field>
            </div>

            {/* Track / Program */}
            <Field>
              <FieldLabel htmlFor="enrolledTrack">Enrolled Track / Program *</FieldLabel>
              <Input
                id="enrolledTrack"
                name="enrolledTrack"
                placeholder="e.g. Full Stack Web Development"
                defaultValue={student.enrolledTrack}
              />
              <InputFieldError field="enrolledTrack" state={state} />
            </Field>

            {/* Contact Number & Gender */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="contactNumber">Contact Number *</FieldLabel>
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  placeholder="+8801700000000"
                  defaultValue={student.contactNumber}
                />
                <InputFieldError field="contactNumber" state={state} />
              </Field>

              <Field>
                <FieldLabel htmlFor="gender">Gender *</FieldLabel>
                <input type="hidden" name="gender" value={gender} />
                <Select value={gender} onValueChange={(val) => val && setGender(val as StudentGender)}>
                  <SelectTrigger id="gender" className="w-full">
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

            {/* Student Status */}
            <Field>
              <FieldLabel htmlFor="status">Student Status *</FieldLabel>
              <input type="hidden" name="status" value={status} />
              <Select value={status} onValueChange={(val) => val && setStatus(val as StudentStatus)}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="BLOCKED">Blocked</SelectItem>
                  <SelectItem value="GRADUATED">Graduated</SelectItem>
                </SelectContent>
              </Select>
              <InputFieldError field="status" state={state} />
            </Field>

            {/* Address */}
            <Field>
              <FieldLabel htmlFor="address">Address</FieldLabel>
              <Input
                id="address"
                name="address"
                placeholder="e.g. Dhanmondi, Dhaka"
                defaultValue={student.address || ''}
              />
              <InputFieldError field="address" state={state} />
            </Field>

            {/* Social & Portfolio Links */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="githubUsername">GitHub Username</FieldLabel>
                <Input
                  id="githubUsername"
                  name="githubUsername"
                  placeholder="e.g. tanvirhossain"
                  defaultValue={student.githubUsername || ''}
                />
                <InputFieldError field="githubUsername" state={state} />
              </Field>

              <Field>
                <FieldLabel htmlFor="linkedinUrl">LinkedIn URL</FieldLabel>
                <Input
                  id="linkedinUrl"
                  name="linkedinUrl"
                  placeholder="https://linkedin.com/in/..."
                  defaultValue={student.linkedinUrl || ''}
                />
                <InputFieldError field="linkedinUrl" state={state} />
              </Field>
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-border/40 bg-muted/30 px-6 py-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending && <Loader2 className="size-4 animate-spin" />}
              {isPending ? 'Updating...' : 'Update Student'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
