'use client';

import InputFieldError from '@/components/shared/InputFieldError';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useSubmissionCooldown } from '@/hooks/useSubmissionCooldown';
import { submitProject } from '@/services/submissions/submissionManagement';
import { IAssignment, ISubmission } from '@/types/submission.interface';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  GitBranch,
  Globe,
  Loader2,
  Send,
  Sparkles,
} from 'lucide-react';
import React, { useActionState, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import SubmissionEligibilityAlert from './SubmissionEligibilityAlert';
import SubmissionRateLimitBadge from './SubmissionRateLimitBadge';

interface ProjectSubmissionFormProps {
  existingSubmissions?: ISubmission[];
  assignments?: IAssignment[];
  onSuccess?: () => void;
}

export default function ProjectSubmissionForm({
  existingSubmissions = [],
  assignments = [],
  onSuccess,
}: ProjectSubmissionFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(
    assignments[0]?.id || ''
  );
  const [charCount, setCharCount] = useState(0);

  const { isCoolingDown, remainingSeconds, startCooldown } = useSubmissionCooldown();

  const [state, formAction, isPending] = useActionState(submitProject, null);

  useEffect(() => {
    if (
      assignments.length > 0 &&
      (!selectedAssignmentId || !assignments.some((a) => a.id === selectedAssignmentId))
    ) {
      setSelectedAssignmentId(assignments[0].id);
    }
  }, [assignments, selectedAssignmentId]);

  // Check if currently selected assignment is already submitted
  const alreadySubmittedRecord = useMemo(() => {
    return (
      existingSubmissions.find((s) => s.assignmentId === selectedAssignmentId) || null
    );
  }, [existingSubmissions, selectedAssignmentId]);

  const selectedAssignment = useMemo(() => {
    return assignments.find((a) => a.id === selectedAssignmentId);
  }, [assignments, selectedAssignmentId]);

  // Handle form state side-effects
  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || 'Project submitted successfully!');
      startCooldown(60);
      if (formRef.current) {
        formRef.current.reset();
        formRef.current.dispatchEvent(new Event('reset', { bubbles: true }));
      }
      router.refresh();
      onSuccess?.();
    } else if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state, startCooldown, router, onSuccess]);

  return (
    <Card className="border border-border/80 shadow-md overflow-hidden bg-card/60 backdrop-blur-sm">
      <CardHeader className="px-6 pt-6 pb-4 border-b border-border/50 bg-muted/10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              <span>Submit Project Assignment</span>
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Provide project credentials, live links, and features for mentor grading.
            </CardDescription>
          </div>

          <SubmissionRateLimitBadge remainingSeconds={remainingSeconds} />
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <form
          ref={formRef}
          action={formAction}
          onReset={() => setCharCount(0)}
          noValidate
          className="space-y-5"
        >
          {/* Hidden metadata fields */}
          <input type="hidden" name="studentId" value="std-1" />
          <input type="hidden" name="studentName" value="Tanvir Hossain" />
          <input type="hidden" name="studentEmail" value="tanvir.hossain@example.com" />

          {/* Duplicate Submission Warning Alert */}
          {alreadySubmittedRecord && (
            <SubmissionEligibilityAlert existingSubmission={alreadySubmittedRecord} />
          )}

          <FieldGroup className="gap-5">
            {/* Assignment Selector */}
            <Field className="gap-1.5">
              <FieldLabel className="text-xs font-semibold text-foreground/90">
                Select Assignment *
              </FieldLabel>
              <input type="hidden" name="assignmentId" value={selectedAssignmentId} />
              <Select
                value={selectedAssignmentId}
                onValueChange={(val) => {
                  if (val) setSelectedAssignmentId(val);
                }}
                disabled={isPending}
              >
                <SelectTrigger className="w-full h-10 text-xs">
                  <SelectValue
                    placeholder={
                      assignments.length === 0
                        ? 'No assignments available'
                        : 'Select an assignment'
                    }
                  >
                    {selectedAssignment
                      ? `${selectedAssignment.title} (Max: ${selectedAssignment.maxScore} marks)`
                      : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {assignments.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No assignments available for your batch
                    </SelectItem>
                  ) : (
                    assignments.map((assignment) => (
                      <SelectItem key={assignment.id} value={assignment.id}>
                        {assignment.title} (Max: {assignment.maxScore} marks)
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {selectedAssignment && (
                <FieldDescription className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-1">
                  <Calendar className="size-3 text-muted-foreground" />
                  <span>Deadline: {new Date(selectedAssignment.deadline).toLocaleDateString()}</span>
                  <span className="mx-1">•</span>
                  <span>Track: {selectedAssignment.courseTrack}</span>
                </FieldDescription>
              )}
              <InputFieldError field="assignmentId" state={state} />
            </Field>

            {/* Project Name */}
            <Field className="gap-1.5">
              <FieldLabel htmlFor="submission-project-name" className="text-xs font-semibold text-foreground/90">
                Project Name *
              </FieldLabel>
              <Input
                id="submission-project-name"
                name="projectName"
                placeholder="e.g. SwiftCart - Full Stack MERN Store"
                required
                disabled={isPending || isCoolingDown || Boolean(alreadySubmittedRecord)}
                className="h-10 text-sm"
              />
              <InputFieldError field="projectName" state={state} />
            </Field>

            {/* Repository URL & Live URL Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field className="gap-1.5">
                <FieldLabel htmlFor="submission-repo-url" className="text-xs font-semibold text-foreground/90">
                  GitHub / Git Repository URL *
                </FieldLabel>
                <div className="relative">
                  <GitBranch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    id="submission-repo-url"
                    name="repoUrl"
                    type="url"
                    placeholder="https://github.com/username/project-repo"
                    required
                    disabled={isPending || isCoolingDown || Boolean(alreadySubmittedRecord)}
                    className="h-10 pl-9 text-xs font-mono"
                  />
                </div>
                <InputFieldError field="repoUrl" state={state} />
              </Field>

              <Field className="gap-1.5">
                <FieldLabel htmlFor="submission-live-url" className="text-xs font-semibold text-foreground/90">
                  Live Deployment URL *
                </FieldLabel>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    id="submission-live-url"
                    name="liveUrl"
                    type="url"
                    placeholder="https://my-app.vercel.app"
                    required
                    disabled={isPending || isCoolingDown || Boolean(alreadySubmittedRecord)}
                    className="h-10 pl-9 text-xs font-mono"
                  />
                </div>
                <InputFieldError field="liveUrl" state={state} />
              </Field>
            </div>

            {/* Description Textarea with Character Counter */}
            <Field className="gap-1.5">
              <div className="flex items-center justify-between">
                <FieldLabel htmlFor="submission-description" className="text-xs font-semibold text-foreground/90">
                  Project Description & Key Features *
                </FieldLabel>
                <span className={`text-[11px] font-mono ${charCount < 20 ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground'}`}>
                  {charCount} / 1000 characters
                </span>
              </div>
              <Textarea
                id="submission-description"
                name="description"
                rows={4}
                defaultValue=""
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCharCount(e.target.value.length)}
                placeholder="Highlight key features implemented, technologies used, responsive design considerations, and user workflows..."
                required
                disabled={isPending || isCoolingDown || Boolean(alreadySubmittedRecord)}
                className="text-xs resize-y"
              />
              <InputFieldError field="description" state={state} />
            </Field>

            {/* Additional Remarks for Mentor (Optional) */}
            <Field className="gap-1.5">
              <FieldLabel htmlFor="submission-remarks" className="text-xs font-semibold text-foreground/90">
                Additional Notes / Test Credentials (Optional)
              </FieldLabel>
              <Input
                id="submission-remarks"
                name="remarks"
                placeholder="e.g. Test credentials: demo@example.com / password123"
                disabled={isPending || isCoolingDown || Boolean(alreadySubmittedRecord)}
                className="h-10 text-xs"
              />
              <InputFieldError field="remarks" state={state} />
            </Field>
          </FieldGroup>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border/60">
            <p className="text-xs text-muted-foreground">
              Please double check links before submitting.
            </p>

            <Button
              type="submit"
              disabled={
                isPending ||
                isCoolingDown ||
                Boolean(alreadySubmittedRecord) ||
                assignments.length === 0
              }
              className="min-w-44 h-10 font-semibold shadow-sm"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Submitting Project...
                </>
              ) : isCoolingDown ? (
                `Please wait (${remainingSeconds}s)`
              ) : alreadySubmittedRecord ? (
                'Already Submitted'
              ) : assignments.length === 0 ? (
                'No Assignment to Submit'
              ) : (
                <>
                  <Send className="mr-2 size-4" />
                  Submit Project
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
