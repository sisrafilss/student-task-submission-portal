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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { submitProject } from '@/services/submissions/submissionManagement';
import { IAssignment } from '@/types/submission.interface';
import { FileText, GitBranch, Globe, Loader2, Send } from 'lucide-react';
import React, { useActionState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface StudentSubmissionDialogProps {
  open: boolean;
  assignment: IAssignment | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function StudentSubmissionDialog({
  open,
  assignment,
  onClose,
  onSuccess,
}: StudentSubmissionDialogProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(submitProject, null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || 'Project submitted successfully!');
      formRef.current?.reset();
      onSuccess();
      onClose();
    } else if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state, onSuccess, onClose]);

  if (!assignment) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-xl md:max-w-2xl p-0 overflow-hidden sm:max-h-[85vh]">
        <DialogHeader className="p-6 pb-2 border-b border-border/60">
          <div className="flex items-center gap-2 text-primary">
            <Send className="size-5" />
            <DialogTitle className="text-lg font-bold">Submit Assignment</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground line-clamp-1">
            Submitting for: <span className="font-semibold text-foreground">{assignment.title}</span>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(80vh-130px)] px-6 py-4" orientation="vertical">
          <form ref={formRef} action={formAction} noValidate className="space-y-4">
            <input type="hidden" name="assignmentId" value={assignment.id} />
            <FieldGroup className="space-y-3.5">
              {/* Project Name */}
              <Field>
                <FieldLabel htmlFor="projectName" className="text-xs font-semibold flex items-center gap-1.5">
                  <FileText className="size-3.5 text-primary" />
                  Project Name *
                </FieldLabel>
                <Input
                  id="projectName"
                  name="projectName"
                  defaultValue={assignment.title}
                  placeholder="e.g. NextraCRM Project Portal"
                  className="h-9 text-xs"
                  required
                />
                <InputFieldError field="projectName" state={state} />
              </Field>

              {/* GitHub Repository URL */}
              <Field>
                <FieldLabel htmlFor="repoUrl" className="text-xs font-semibold flex items-center gap-1.5">
                  <GitBranch className="size-3.5 text-primary" />
                  GitHub Repository URL *
                </FieldLabel>
                <Input
                  id="repoUrl"
                  name="repoUrl"
                  placeholder="https://github.com/username/project-repo"
                  className="h-9 text-xs"
                />
                <FieldDescription className="text-[11px]">
                  Provide a valid, accessible GitHub/GitLab public repository URL.
                </FieldDescription>
                <InputFieldError field="repoUrl" state={state} />
              </Field>

              {/* Live Deployment URL */}
              <Field>
                <FieldLabel htmlFor="liveUrl" className="text-xs font-semibold flex items-center gap-1.5">
                  <Globe className="size-3.5 text-emerald-500" />
                  Live Deployment URL (Optional)
                </FieldLabel>
                <Input
                  id="liveUrl"
                  name="liveUrl"
                  placeholder="https://my-app.vercel.app or surge.sh"
                  className="h-9 text-xs"
                />
                <InputFieldError field="liveUrl" state={state} />
              </Field>

              {/* Submission Notes / Remarks */}
              <Field>
                <FieldLabel htmlFor="description" className="text-xs font-semibold">
                  Submission Notes & Remarks
                </FieldLabel>
                <Textarea
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="Mention bonus criteria implemented, test credentials, or notes for your mentor..."
                  className="text-xs resize-none"
                />
                <InputFieldError field="description" state={state} />
              </Field>
            </FieldGroup>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border/60">
              <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isPending} className="gap-2 font-medium">
                {isPending && <Loader2 className="size-3.5 animate-spin" />}
                {isPending ? 'Submitting Deliverables...' : 'Submit Project'}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

