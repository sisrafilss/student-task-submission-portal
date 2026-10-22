'use client';

import { Badge } from '@/components/ui/badge';
import { SubmissionStatus } from '@/types/submission.interface';
import { AlertTriangle, CheckCircle2, Clock, Hourglass } from 'lucide-react';

interface AssignmentStatusBadgeProps {
  deadline: string;
  submissionStatus?: SubmissionStatus | 'NOT_SUBMITTED';
}

export default function AssignmentStatusBadge({
  deadline,
  submissionStatus = 'NOT_SUBMITTED',
}: AssignmentStatusBadgeProps) {
  // If already submitted
  if (submissionStatus === 'EVALUATED') {
    return (
      <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-300 border-emerald-500/30 text-[11px] gap-1 py-0.5">
        <CheckCircle2 className="size-3" />
        Evaluated
      </Badge>
    );
  }

  if (submissionStatus === 'UNDER_REVIEW' || submissionStatus === 'PENDING') {
    return (
      <Badge className="bg-blue-500/15 text-blue-700 hover:bg-blue-500/20 dark:text-blue-300 border-blue-500/30 text-[11px] gap-1 py-0.5">
        <Hourglass className="size-3 animate-pulse" />
        Under Review
      </Badge>
    );
  }

  if (submissionStatus === 'RESUBMISSION_REQUIRED') {
    return (
      <Badge className="bg-rose-500/15 text-rose-700 hover:bg-rose-500/20 dark:text-rose-300 border-rose-500/30 text-[11px] gap-1 py-0.5">
        <AlertTriangle className="size-3" />
        Resubmission Needed
      </Badge>
    );
  }

  // Not submitted yet: Calculate deadline proximity
  const now = new Date().getTime();
  const dueDate = new Date(deadline).getTime();
  const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return (
      <Badge variant="outline" className="border-destructive/30 text-destructive bg-destructive/5 text-[11px] gap-1 py-0.5">
        <AlertTriangle className="size-3" />
        Past Deadline
      </Badge>
    );
  }

  if (diffDays <= 2) {
    return (
      <Badge className="bg-amber-500/20 text-amber-700 hover:bg-amber-500/25 dark:text-amber-300 border-amber-500/40 text-[11px] gap-1 py-0.5 animate-pulse">
        <Clock className="size-3" />
        Due in {diffDays === 0 ? 'Today' : `${diffDays}d`}
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="border-border/80 text-muted-foreground bg-muted/30 text-[11px] gap-1 py-0.5">
      <Clock className="size-3 text-muted-foreground" />
      {diffDays} days left
    </Badge>
  );
}

