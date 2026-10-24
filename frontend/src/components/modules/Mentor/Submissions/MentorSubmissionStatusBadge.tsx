'use client';

import { Badge } from '@/components/ui/badge';
import { SubmissionStatus } from '@/types/submission.interface';
import { AlertCircle, CheckCircle2, Clock, Eye, XCircle } from 'lucide-react';

interface MentorSubmissionStatusBadgeProps {
  status: SubmissionStatus | string;
}

export default function MentorSubmissionStatusBadge({
  status,
}: MentorSubmissionStatusBadgeProps) {
  const normalized = status?.toUpperCase() || 'PENDING';

  switch (normalized) {
    case 'PENDING':
      return (
        <Badge
          variant="outline"
          className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 gap-1 font-medium text-xs py-0.5"
        >
          <Clock className="size-3 shrink-0" />
          <span>Pending</span>
        </Badge>
      );
    case 'UNDER_REVIEW':
      return (
        <Badge
          variant="outline"
          className="border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 gap-1 font-medium text-xs py-0.5"
        >
          <Eye className="size-3 shrink-0" />
          <span>Under Review</span>
        </Badge>
      );
    case 'APPROVED':
    case 'EVALUATED':
      return (
        <Badge
          variant="outline"
          className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 gap-1 font-medium text-xs py-0.5"
        >
          <CheckCircle2 className="size-3 shrink-0" />
          <span>{normalized === 'EVALUATED' ? 'Evaluated' : 'Approved'}</span>
        </Badge>
      );
    case 'REJECTED':
      return (
        <Badge
          variant="outline"
          className="border-destructive/30 bg-destructive/10 text-destructive gap-1 font-medium text-xs py-0.5"
        >
          <XCircle className="size-3 shrink-0" />
          <span>Rejected</span>
        </Badge>
      );
    case 'RESUBMISSION_REQUIRED':
      return (
        <Badge
          variant="outline"
          className="border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400 gap-1 font-medium text-xs py-0.5"
        >
          <AlertCircle className="size-3 shrink-0" />
          <span>Resubmission</span>
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}
