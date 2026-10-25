'use client';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { ISubmission } from '@/types/submission.interface';
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  GitBranch,
  Globe,
  MessageSquare,
  UserCheck,
  XCircle,
} from 'lucide-react';
import React from 'react';

interface AssignmentSubmissionCardProps {
  submission: ISubmission;
}

export default function AssignmentSubmissionCard({
  submission,
}: AssignmentSubmissionCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[11px] gap-1">
            <CheckCircle2 className="size-3" />
            Approved
          </Badge>
        );
      case 'REJECTED':
        return (
          <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-[11px] gap-1">
            <XCircle className="size-3" />
            Rejected
          </Badge>
        );
      case 'UNDER_REVIEW':
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[11px] gap-1">
            <Clock className="size-3" />
            Under Review
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground text-[11px] gap-1">
            <Clock className="size-3" />
            Pending Review
          </Badge>
        );
    }
  };

  const hasScore = typeof submission.score === 'number';

  return (
    <div className="rounded-xl border border-border/70 bg-card/60 p-4 shadow-sm hover:border-primary/40 transition-colors space-y-3.5">
      {/* Header: Student Profile & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">
            {submission.studentName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h5 className="font-semibold text-foreground text-sm leading-none">
              {submission.studentName}
            </h5>
            <p className="text-xs text-muted-foreground mt-1">
              {submission.studentEmail}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {getStatusBadge(submission.status)}
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Calendar className="size-3" />
            {new Date(submission.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Middle Row: Mentor & Marks Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 rounded-lg border border-border/50 bg-muted/20 p-3 text-xs">
        {/* Mentor Info */}
        <div className="flex items-start gap-2">
          <UserCheck className="size-4 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-muted-foreground text-[11px]">Evaluating Mentor</p>
            {submission.mentorName ? (
              <p className="font-semibold text-foreground">
                {submission.mentorName}
                {submission.mentorEmail && (
                  <span className="block text-[11px] text-muted-foreground font-normal">
                    {submission.mentorEmail}
                  </span>
                )}
              </p>
            ) : (
              <p className="text-muted-foreground italic text-[11px]">
                Pending mentor allocation
              </p>
            )}
          </div>
        </div>

        {/* Score Info */}
        <div className="flex items-start gap-2 sm:border-l sm:border-border/40 sm:pl-3">
          <Award className="size-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-muted-foreground text-[11px]">Marks Awarded</p>
            {hasScore ? (
              <p className="font-bold text-primary text-sm">
                {submission.score} / {submission.maxScore ?? 100}
                <span className="text-[11px] font-normal text-muted-foreground ml-1">
                  Points
                </span>
              </p>
            ) : (
              <p className="text-muted-foreground italic text-[11px]">
                Pending Evaluation
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Mentor Feedback Callout */}
      <div className="rounded-lg border border-border/60 bg-muted/10 p-3 text-xs space-y-1">
        <div className="flex items-center gap-1.5 font-medium text-foreground text-[11px]">
          <MessageSquare className="size-3.5 text-primary shrink-0" />
          <span>Mentor Evaluation Feedback</span>
        </div>
        {submission.feedback ? (
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap break-words pl-5 text-xs italic">
            &ldquo;{submission.feedback}&rdquo;
          </p>
        ) : (
          <p className="text-muted-foreground italic pl-5 text-[11px]">
            No evaluation feedback provided yet.
          </p>
        )}
      </div>

      {/* Student Deliverables & Links */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/40">
        <div className="text-[11px] text-muted-foreground truncate max-w-xs">
          {submission.description ? (
            <span>Note: {submission.description}</span>
          ) : (
            <span>Repository & Deployment Links</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {submission.repoUrl && (
            <a
              href={submission.repoUrl}
              target="_blank"
              rel="noreferrer noopener"
              className={
                buttonVariants({ variant: 'outline', size: 'sm' }) +
                ' h-7 text-xs px-2.5 gap-1.5'
              }
            >
              <GitBranch className="size-3.5" />
              Repository
              <ExternalLink className="size-2.5 ml-0.5 opacity-60" />
            </a>
          )}

          {submission.liveUrl && (
            <a
              href={submission.liveUrl}
              target="_blank"
              rel="noreferrer noopener"
              className={
                buttonVariants({ variant: 'secondary', size: 'sm' }) +
                ' h-7 text-xs px-2.5 gap-1.5'
              }
            >
              <Globe className="size-3.5 text-primary" />
              Live Preview
              <ExternalLink className="size-2.5 ml-0.5 opacity-60" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
