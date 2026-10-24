'use client';

import { Badge } from '@/components/ui/badge';
import { Clock, Sparkles } from 'lucide-react';

interface MentorSubmissionsHeaderProps {
  pendingCount?: number;
}

export default function MentorSubmissionsHeader({
  pendingCount = 0,
}: MentorSubmissionsHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-border/40">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Submissions Queue & Evaluation
          </h1>
          <Sparkles className="size-5 text-amber-500 hidden sm:inline-block animate-pulse" />
        </div>
        <p className="text-sm text-muted-foreground">
          Review submitted student assignments, assign rubric-based points, and provide constructive feedback.
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Badge
          variant="outline"
          className="px-3 py-1.5 text-xs font-semibold rounded-full border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center gap-1.5 shadow-xs"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-amber-500" />
          </span>
          <Clock className="size-3.5" />
          <span>{pendingCount} Pending Reviews</span>
        </Badge>
      </div>
    </div>
  );
}
