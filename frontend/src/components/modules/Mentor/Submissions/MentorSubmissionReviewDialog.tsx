'use client';

import InputFieldError from '@/components/shared/InputFieldError';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { reviewSubmission } from '@/services/submissions/submissionManagement';
import { IRubricScoreItem, ISubmission } from '@/types/submission.interface';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Loader2,
  User,
  XCircle,
} from 'lucide-react';
import React, { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
import MentorRubricScoringSection from './MentorRubricScoringSection';

interface MentorSubmissionReviewDialogProps {
  open: boolean;
  submission: ISubmission | null;
  onClose: () => void;
  onSuccess: () => void;
}

const COMMON_REJECTION_REASONS = [
  'Broken repository link (returns 404 or private)',
  'Missing or crashing live deployment URL',
  'Required features from rubric not implemented',
  'Plagiarized or hardcoded credentials detected',
];

export default function MentorSubmissionReviewDialog({
  open,
  submission,
  onClose,
  onSuccess,
}: MentorSubmissionReviewDialogProps) {
  const [state, formAction, isPending] = useActionState(reviewSubmission, null);

  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT'>('APPROVE');
  const [score, setScore] = useState<number>(85);
  const [rubricScores, setRubricScores] = useState<IRubricScoreItem[]>([]);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    if (submission) {
      const isRej = submission.status === 'REJECTED';
      setActionType(isRej ? 'REJECT' : 'APPROVE');
      setScore(submission.score ?? 85);
      setRubricScores(submission.rubricScores || []);
      setRejectionReason(submission.rejectionReason || '');
      setFeedback(submission.feedback || '');
    }
  }, [submission]);

  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message);
    } else if (state && state.success && state.message) {
      toast.success(state.message);
      onSuccess();
      onClose();
    }
  }, [state, onSuccess, onClose]);

  if (!submission) return null;

  const handleRubricScoreChange = (total: number, items: IRubricScoreItem[]) => {
    setRubricScores(items);
    setScore(total);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[92vh] w-full sm:max-w-2xl flex flex-col p-0 overflow-hidden shadow-2xl rounded-xl border border-border/70">
        <DialogHeader className="px-6 pt-5 pb-3 border-b border-border/50 shrink-0">
          <div className="space-y-1">
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Award className="size-5 text-primary" />
              <span>Evaluate Student Submission</span>
            </DialogTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <User className="size-3.5" />
              <span className="font-medium text-foreground">{submission.studentName}</span>
              <span>•</span>
              <span className="truncate max-w-[280px]">{submission.projectName}</span>
            </div>
          </div>
        </DialogHeader>

        <form action={formAction} noValidate className="flex-1 min-h-0 flex flex-col">
          <input type="hidden" name="submissionId" value={submission.id} />
          <input type="hidden" name="actionType" value={actionType} />
          <input type="hidden" name="rubricScoresJson" value={JSON.stringify(rubricScores)} />

          <div className="flex-1 min-h-0 overflow-hidden px-6 py-4">
            <ScrollArea className="h-[430px] sm:h-[470px] pr-3">
              <FieldGroup className="space-y-4">
                {/* Decision Toggle */}
                <Field>
                  <FieldLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Evaluation Decision *
                  </FieldLabel>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setActionType('APPROVE')}
                      className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-xs font-semibold transition-all cursor-pointer ${
                        actionType === 'APPROVE'
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-xs ring-1 ring-emerald-500/40'
                          : 'border-border/60 hover:bg-muted/40 text-muted-foreground'
                      }`}
                    >
                      <CheckCircle2 className="size-4 shrink-0" />
                      <span>Approve Submission</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActionType('REJECT')}
                      className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-xs font-semibold transition-all cursor-pointer ${
                        actionType === 'REJECT'
                          ? 'border-destructive bg-destructive/10 text-destructive shadow-xs ring-1 ring-destructive/40'
                          : 'border-border/60 hover:bg-muted/40 text-muted-foreground'
                      }`}
                    >
                      <XCircle className="size-4 shrink-0" />
                      <span>Reject Submission</span>
                    </button>
                  </div>
                  <InputFieldError field="actionType" state={state} />
                </Field>

                {/* Approve Mode: Score & Rubric Section */}
                {actionType === 'APPROVE' ? (
                  <div className="space-y-3.5">
                    <Field>
                      <FieldLabel htmlFor="score" className="text-xs font-medium">
                        Total Marks Awarded *
                      </FieldLabel>
                      <div className="flex items-center gap-2">
                        <Input
                          id="score"
                          name="score"
                          type="number"
                          min={0}
                          max={submission.maxScore || 100}
                          value={score}
                          onChange={(e) => setScore(Number(e.target.value))}
                          className="w-28 font-bold text-sm"
                          required
                        />
                        <span className="text-xs text-muted-foreground">
                          / {submission.maxScore || 100} Maximum Points
                        </span>
                      </div>
                      <InputFieldError field="score" state={state} />
                    </Field>

                    <MentorRubricScoringSection
                      initialScores={rubricScores}
                      onScoreChange={handleRubricScoreChange}
                    />
                  </div>
                ) : (
                  /* Reject Mode: Rejection Reason */
                  <div className="space-y-3">
                    <Field>
                      <FieldLabel htmlFor="rejectionReason" className="text-xs font-medium flex items-center gap-1.5 text-destructive">
                        <AlertTriangle className="size-3.5" />
                        <span>Rejection Reason *</span>
                      </FieldLabel>
                      <Input
                        id="rejectionReason"
                        name="rejectionReason"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Specify the reason why this project is rejected..."
                        className="text-xs"
                        required
                      />
                      <InputFieldError field="rejectionReason" state={state} />
                    </Field>

                    <div className="space-y-1.5">
                      <span className="text-[11px] text-muted-foreground font-medium">
                        Quick Reason Templates:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {COMMON_REJECTION_REASONS.map((reason, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setRejectionReason(reason)}
                            className="text-[11px] rounded-md border border-border/70 bg-muted/40 px-2 py-1 hover:bg-muted text-foreground transition-colors cursor-pointer"
                          >
                            {reason}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Feedback Textarea */}
                <Field>
                  <FieldLabel htmlFor="feedback" className="text-xs font-medium">
                    Constructive Feedback & Recommendations *
                  </FieldLabel>
                  <Textarea
                    id="feedback"
                    name="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                    placeholder="Provide constructive feedback highlighting positive aspects, code improvements, and clear guidance..."
                    className="text-xs leading-relaxed"
                    required
                  />
                  <InputFieldError field="feedback" state={state} />
                </Field>
              </FieldGroup>
            </ScrollArea>
          </div>

          <DialogFooter className="px-6 py-3.5 border-t border-border/50 shrink-0 flex items-center justify-between sm:justify-between">
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
              className={`gap-1.5 min-w-[140px] font-semibold ${
                actionType === 'REJECT'
                  ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : actionType === 'APPROVE' ? (
                <>
                  <CheckCircle2 className="size-3.5" />
                  <span>Approve & Score</span>
                </>
              ) : (
                <>
                  <XCircle className="size-3.5" />
                  <span>Reject Project</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
