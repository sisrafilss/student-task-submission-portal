'use client';

import InfoRow from '@/components/shared/InfoRow';
import StatusBadgeCell from '@/components/shared/cell/StatusBadgeCell';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { formatDateTime } from '@/lib/formatters';
import { ISubmission } from '@/types/submission.interface';
import {
  Award,
  Calendar,
  ExternalLink,
  GitBranch,
  Globe,
  MessageSquare,
  UserCheck,
} from 'lucide-react';

interface SubmissionDetailDialogProps {
  open: boolean;
  onClose: () => void;
  submission: ISubmission | null;
}

export default function SubmissionDetailDialog({
  open,
  onClose,
  submission,
}: SubmissionDetailDialogProps) {
  if (!submission) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] w-full sm:max-w-2xl flex flex-col p-0 overflow-hidden shadow-2xl rounded-xl border border-border/70">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50 shrink-0">
          <div className="flex items-center justify-between pr-4">
            <DialogTitle className="text-xl font-bold tracking-tight">
              Submission & Evaluation Details
            </DialogTitle>
            <StatusBadgeCell status={submission.status} />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Project Overview Card */}
          <div className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Assignment
            </span>
            <h3 className="text-base font-bold text-foreground">
              {submission.assignmentTitle}
            </h3>
            <p className="text-sm font-semibold text-primary">
              {submission.projectName}
            </p>
          </div>

          {/* Links & Dates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <InfoRow
              label="Repository URL"
              value={
                <a
                  href={submission.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-primary hover:underline font-mono"
                >
                  <GitBranch className="size-3.5 text-foreground" />
                  <span className="truncate">{submission.repoUrl}</span>
                  <ExternalLink className="size-3 shrink-0" />
                </a>
              }
            />

            <InfoRow
              label="Live Deployment URL"
              value={
                <a
                  href={submission.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-primary hover:underline font-mono"
                >
                  <Globe className="size-3.5 text-blue-500" />
                  <span className="truncate">{submission.liveUrl}</span>
                  <ExternalLink className="size-3 shrink-0" />
                </a>
              }
            />

            <InfoRow
              label="Submitted At"
              value={
                <div className="flex items-center gap-1.5 text-xs">
                  <Calendar className="size-3.5 text-muted-foreground" />
                  <span>{formatDateTime(submission.createdAt)}</span>
                </div>
              }
            />

            <InfoRow
              label="Marks / Score"
              value={
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <Award className="size-3.5 text-amber-500" />
                  <span className={submission.score ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}>
                    {submission.score !== null && submission.score !== undefined
                      ? `${submission.score} Marks`
                      : 'Pending Evaluation'}
                  </span>
                </div>
              }
            />
          </div>

          <Separator />

          {/* Description Section */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Project Description & Key Features
            </h4>
            <div className="rounded-lg bg-muted/30 p-3.5 border border-border/40 text-xs text-foreground/90 leading-relaxed">
              {submission.description}
            </div>
          </div>

          {/* Additional Remarks if present */}
          {submission.remarks && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Student Notes / Test Credentials
              </h4>
              <p className="text-xs text-muted-foreground bg-muted/20 p-2.5 rounded border border-border/30">
                {submission.remarks}
              </p>
            </div>
          )}

          <Separator />

          {/* Mentor Evaluation Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <MessageSquare className="size-3.5 text-primary" />
              <span>Mentor Feedback & Grading</span>
            </h4>

            {submission.feedback ? (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                  <span className="font-semibold flex items-center gap-1.5">
                    <UserCheck className="size-4" />
                    Evaluated by {submission.evaluatedBy || 'Assigned Mentor'}
                  </span>
                  {submission.evaluatedAt && (
                    <span className="text-[11px] opacity-80">
                      {formatDateTime(submission.evaluatedAt)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-foreground/90 leading-relaxed italic border-l-2 border-emerald-500 pl-3">
                  &ldquo;{submission.feedback}&rdquo;
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-border/50 bg-muted/20 p-4 text-center space-y-1">
                <p className="text-xs font-medium text-foreground">
                  Evaluation in Progress
                </p>
                <p className="text-[11px] text-muted-foreground">
                  A mentor is reviewing your code quality, architecture, and live deployment. Feedback will appear here once evaluation is completed.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 border-t border-border/60 bg-muted/15 shrink-0">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
