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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  MentorOption,
  useAssignmentEditForm,
} from '@/hooks/useAssignmentEditForm';
import { IBackendAssignment } from '@/types/assignment.interface';
import { IBatchOption } from '@/types/batch.interface';
import { Edit3, Loader2 } from 'lucide-react';
import React from 'react';
import AssignmentBatchSelect from './AssignmentBatchSelect';
import AssignmentDeadlinePicker from './AssignmentDeadlinePicker';
import AssignmentMentorQuotaPicker from './AssignmentMentorQuotaPicker';
import AssignmentRubricsBuilder from './AssignmentRubricsBuilder';

interface AssignmentEditDialogProps {
  open: boolean;
  assignment: IBackendAssignment | null;
  onClose: () => void;
  onSuccess: () => void;
  availableMentors: MentorOption[];
  availableBatches?: IBatchOption[];
}

export default function AssignmentEditDialog({
  open,
  assignment,
  onClose,
  onSuccess,
  availableMentors,
  availableBatches,
}: AssignmentEditDialogProps) {
  const {
    formRef,
    state,
    formAction,
    isPending,
    formValues,
    setters,
    resetForm,
  } = useAssignmentEditForm({
    assignment,
    open,
    onClose,
    onSuccess,
    availableMentors,
  });

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!assignment) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent className="w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl p-0 overflow-hidden flex flex-col max-h-[88vh] sm:max-h-[90vh] gap-0">
        <DialogHeader className="px-6 sm:px-8 pt-6 pb-4 border-b border-border/60 shrink-0">
          <div className="flex items-center gap-2 text-primary">
            <Edit3 className="size-5" />
            <DialogTitle className="text-lg font-bold">Edit Assignment</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            Modify milestone requirements, batch assignment, rubrics, and mentor allocation.
          </DialogDescription>
        </DialogHeader>

        <form
          ref={formRef}
          action={formAction}
          noValidate
          id="edit-assignment-form"
          className="flex flex-col flex-1 min-h-0 overflow-hidden"
        >
          <ScrollArea
            className="flex-1 min-h-0 max-h-[calc(88vh-145px)] sm:max-h-[calc(90vh-145px)] px-6 sm:px-8 py-5"
            orientation="vertical"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* Left Column: Basic Details */}
              <FieldGroup className="space-y-4">
                {/* Title */}
                <Field>
                  <FieldLabel htmlFor="edit-title" className="text-xs font-semibold">
                    Assignment Title *
                  </FieldLabel>
                  <Input
                    id="edit-title"
                    name="title"
                    value={formValues.title}
                    onChange={(e) => setters.setTitle(e.target.value)}
                    placeholder="e.g. Milestone 04: Full Stack Architecture"
                    className="h-9 text-xs"
                    disabled={isPending}
                  />
                  <InputFieldError field="title" state={state} />
                </Field>

                {/* Description */}
                <Field>
                  <FieldLabel htmlFor="edit-description" className="text-xs font-semibold">
                    Assignment Description *
                  </FieldLabel>
                  <Textarea
                    id="edit-description"
                    name="description"
                    rows={4}
                    value={formValues.description}
                    onChange={(e) => setters.setDescription(e.target.value)}
                    placeholder="Provide comprehensive requirements and instructions..."
                    className="text-xs resize-none"
                    disabled={isPending}
                  />
                  <InputFieldError field="description" state={state} />
                </Field>

                {/* Batch & Deadline Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="edit-batchId" className="text-xs font-semibold">
                      Target Batch *
                    </FieldLabel>
                    <AssignmentBatchSelect
                      value={formValues.batchId}
                      onChange={setters.setBatchId}
                      options={availableBatches && availableBatches.length > 0 ? availableBatches : undefined}
                    />
                    <InputFieldError field="batchId" state={state} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="edit-deadline" className="text-xs font-semibold">
                      Submission Deadline *
                    </FieldLabel>
                    <AssignmentDeadlinePicker
                      value={formValues.deadline}
                      onChange={setters.setDeadline}
                    />
                    <InputFieldError field="deadline" state={state} />
                  </Field>
                </div>

                {/* Status & Total Marks Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="edit-status" className="text-xs font-semibold">
                      Publication Status
                    </FieldLabel>
                    <input type="hidden" name="status" value={formValues.status} />
                    <Select
                      value={formValues.status}
                      onValueChange={(val) => val && setters.setStatus(val)}
                      disabled={isPending}
                    >
                      <SelectTrigger id="edit-status" className="h-9 text-xs">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PUBLISHED">Published (Visible)</SelectItem>
                        <SelectItem value="DRAFT">Draft (Hidden)</SelectItem>
                        <SelectItem value="ARCHIVED">Archived (Closed)</SelectItem>
                      </SelectContent>
                    </Select>
                    <InputFieldError field="status" state={state} />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="edit-totalMarks" className="text-xs font-semibold">
                      Total Marks
                    </FieldLabel>
                    <Input
                      id="edit-totalMarks"
                      name="totalMarks"
                      type="number"
                      min={1}
                      value={formValues.totalMarks}
                      onChange={(e) => setters.setTotalMarks(Number(e.target.value) || 0)}
                      className="h-9 text-xs"
                      disabled={isPending}
                    />
                    <InputFieldError field="totalMarks" state={state} />
                  </Field>
                </div>

                {/* Default Quota Per Mentor */}
                <Field>
                  <FieldLabel htmlFor="edit-maxPerMentor" className="text-xs font-semibold">
                    Default Quota Per Mentor
                  </FieldLabel>
                  <Input
                    id="edit-maxPerMentor"
                    name="maxPerMentor"
                    type="number"
                    min={1}
                    value={formValues.defaultQuota}
                    onChange={(e) =>
                      setters.setDefaultQuota(Number(e.target.value) || 15)
                    }
                    className="h-9 text-xs"
                    disabled={isPending}
                  />
                  <FieldDescription className="text-[11px]">
                    Fallback quota for mentors without individual customization.
                  </FieldDescription>
                </Field>
              </FieldGroup>

              {/* Right Column: Rubrics & Mentors */}
              <div className="space-y-5">
                <AssignmentRubricsBuilder
                  rubrics={formValues.rubrics}
                  onChange={setters.setRubrics}
                />
                <AssignmentMentorQuotaPicker
                  availableMentors={availableMentors}
                  mentorQuotas={formValues.mentorQuotas}
                  defaultQuota={formValues.defaultQuota}
                  onChange={setters.setMentorQuotas}
                />
              </div>
            </div>
          </ScrollArea>

          {/* Fixed Actions Footer */}
          <div className="flex items-center justify-end gap-3 px-6 sm:px-8 py-3.5 border-t border-border/60 shrink-0 bg-background z-10">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className="gap-2 font-medium min-w-28"
            >
              {isPending && <Loader2 className="size-3.5 animate-spin" />}
              {isPending ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

