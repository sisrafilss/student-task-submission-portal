'use client';

import InfoRow from '@/components/shared/InfoRow';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { formatDateTime } from '@/lib/formatters';
import { ISubmission } from '@/types/submission.interface';
import {
  Award,
  Calendar,
  CheckCircle2,
  ExternalLink,
  GitBranch,
  Globe,
  MessageSquare,
  User,
  XCircle,
} from 'lucide-react';
import MentorSubmissionStatusBadge from './MentorSubmissionStatusBadge';

interface MentorSubmissionViewDialogProps {
  open: boolean;
  submission: ISubmission | null;
  onClose: () => void;
  onEvaluate?: (submission: ISubmission) => void;
}

export default function MentorSubmissionViewDialog({
  open,
  submission,
  onClose,
  onEvaluate,
}: MentorSubmissionViewDialogProps) {
  if (!submission) return null;

  const isEvaluated =
    submission.status === 'APPROVED' ||
    submission.status === 'REJECTED' ||
    submission.status === 'EVALUATED';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] w-[95vw] sm:max-w-2xl lg:max-w-3xl flex flex-col p-0 overflow-hidden shadow-2xl rounded-xl border border-border/70">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50 shrink-0">
          <div className="flex items-center justify-between pr-4">
            <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
              Submission Details & History
            </DialogTitle>
            <MentorSubmissionStatusBadge status={submission.status} />
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-hidden px-6 py-4">
          <ScrollArea className="h-[420px] sm:h-[460px] pr-3" orientation="vertical">
            <div className="space-y-4">
              {/* Assignment & Project Header */}
              <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {submission.assignmentTitle}
                </span>
                <h3 className="text-base font-bold text-foreground">
                  {submission.projectName}
                </h3>
              </div>

              {/* Student Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoRow
                  label="Student Name"
                  value={
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                      <User className="size-3.5 text-primary" />
                      <span>{submission.studentName}</span>
                    </div>
                  }
                />
                <InfoRow
                  label="Student Email"
                  value={<span className="font-mono text-xs">{submission.studentEmail}</span>}
                />
              </div>

              {/* Repository & Live Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoRow
                  label="Git Repository"
                  value={
                    <a
                      href={submission.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs text-primary hover:underline font-mono"
                    >
                      <GitBranch className="size-3.5 text-foreground shrink-0" />
                      <span className="truncate">{submission.repoUrl}</span>
                      <ExternalLink className="size-3 shrink-0" />
                    </a>
                  }
                />
                <InfoRow
                  label="Live Deployment"
                  value={
                    <a
                      href={submission.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-xs text-primary hover:underline font-mono"
                    >
                      <Globe className="size-3.5 text-blue-500 shrink-0" />
                      <span className="truncate">{submission.liveUrl}</span>
                      <ExternalLink className="size-3 shrink-0" />
                    </a>
                  }
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InfoRow
                  label="Submitted On"
                  value={
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="size-3.5" />
                      <span>{formatDateTime(submission.createdAt)}</span>
                    </div>
                  }
                />
                <InfoRow
                  label="Last Updated"
                  value={
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="size-3.5" />
                      <span>{formatDateTime(submission.updatedAt)}</span>
                    </div>
                  }
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground">
                  Project Description
                </span>
                <p className="rounded-lg border border-border/50 bg-background/60 p-3 text-xs leading-relaxed text-foreground whitespace-pre-line">
                  {submission.description}
                </p>
              </div>

              {/* Remarks if present */}
              {submission.remarks && (
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-muted-foreground">
                    Student Remarks / Notes
                  </span>
                  <p className="rounded-lg border border-border/50 bg-background/60 p-3 text-xs italic text-muted-foreground">
                    &quot;{submission.remarks}&quot;
                  </p>
                </div>
              )}

              {/* Evaluation History Section (if already evaluated) */}
              {isEvaluated && (
                <>
                  <Separator className="my-2" />
                  <div className="rounded-xl border border-border/70 bg-card p-4 space-y-3">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2">
                      <div className="flex items-center gap-2">
                        {submission.status === 'REJECTED' ? (
                          <XCircle className="size-4 text-destructive" />
                        ) : (
                          <CheckCircle2 className="size-4 text-emerald-500" />
                        )}
                        <h4 className="text-sm font-bold text-foreground">
                          Evaluation & Mentor Feedback
                        </h4>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-primary">
                        <Award className="size-4 text-amber-500" />
                        <span>
                          Score: {submission.score ?? 0} / {submission.maxScore || 100}
                        </span>
                      </div>
                    </div>

                    {submission.rejectionReason && (
                      <div className="rounded-md border border-destructive/20 bg-destructive/10 p-2.5 text-xs text-destructive">
                        <span className="font-semibold">Rejection Reason: </span>
                        {submission.rejectionReason}
                      </div>
                    )}

                    {submission.rubricScores && submission.rubricScores.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                          Rubric Breakdown
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {submission.rubricScores.map((r, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between text-xs bg-muted/30 px-2.5 py-1.5 rounded-md border border-border/40"
                            >
                              <span className="truncate pr-2 font-medium">{r.criteria}</span>
                              <span className="font-bold text-foreground shrink-0">
                                {r.marksAwarded} / {r.maxMarks}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {submission.feedback && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                          <MessageSquare className="size-3.5 text-primary" />
                          <span>Mentor Feedback:</span>
                        </div>
                        <p className="rounded-md bg-muted/40 p-3 text-xs leading-relaxed text-foreground whitespace-pre-line">
                          {submission.feedback}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/30">
                      <span>Evaluated by: {submission.evaluatedBy || 'Senior Mentor'}</span>
                      {submission.evaluatedAt && (
                        <span>On: {formatDateTime(submission.evaluatedAt)}</span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="px-6 py-3.5 border-t border-border/50 shrink-0 flex items-center justify-between sm:justify-between">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>

          {onEvaluate && (
            <Button
              type="button"
              size="sm"
              onClick={() => {
                onClose();
                onEvaluate(submission);
              }}
              className="gap-1.5"
            >
              <Award className="size-4" />
              <span>{isEvaluated ? 'Re-evaluate' : 'Evaluate Submission'}</span>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
