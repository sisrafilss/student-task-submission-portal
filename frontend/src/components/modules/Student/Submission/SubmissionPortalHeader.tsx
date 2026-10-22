'use client';

import ManagementPageHeader from '@/components/shared/ManagementPageHeader';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, FileText } from 'lucide-react';

interface SubmissionPortalHeaderProps {
  totalCount?: number;
  pendingCount?: number;
  evaluatedCount?: number;
}

export default function SubmissionPortalHeader({
  totalCount = 2,
  pendingCount = 1,
  evaluatedCount = 1,
}: SubmissionPortalHeaderProps) {
  return (
    <div className="space-y-4">
      <ManagementPageHeader
        title="Assignment Submission Portal"
        description="Submit your assignment projects, track evaluation status, and view mentor feedback"
      />

      {/* Quick Summary Status Badges */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        <Badge variant="outline" className="flex items-center gap-1.5 py-1 px-3 text-xs font-medium">
          <FileText className="size-3.5 text-blue-500" />
          <span>Total Submissions:</span>
          <span className="font-bold text-foreground">{totalCount}</span>
        </Badge>

        <Badge variant="outline" className="flex items-center gap-1.5 py-1 px-3 text-xs font-medium border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400">
          <Clock className="size-3.5 text-amber-500" />
          <span>Pending Review:</span>
          <span className="font-bold">{pendingCount}</span>
        </Badge>

        <Badge variant="outline" className="flex items-center gap-1.5 py-1 px-3 text-xs font-medium border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 className="size-3.5 text-emerald-500" />
          <span>Evaluated:</span>
          <span className="font-bold">{evaluatedCount}</span>
        </Badge>
      </div>
    </div>
  );
}

