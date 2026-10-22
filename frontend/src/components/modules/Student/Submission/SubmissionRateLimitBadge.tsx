'use client';

import { Badge } from '@/components/ui/badge';
import { Timer } from 'lucide-react';

interface SubmissionRateLimitBadgeProps {
  remainingSeconds: number;
}

export default function SubmissionRateLimitBadge({
  remainingSeconds,
}: SubmissionRateLimitBadgeProps) {
  if (remainingSeconds <= 0) return null;

  return (
    <Badge
      variant="outline"
      className="flex items-center gap-1.5 py-1 px-2.5 text-xs font-medium border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400 animate-pulse"
    >
      <Timer className="size-3.5 text-amber-500 shrink-0" />
      <span>Cooldown active: please wait {remainingSeconds}s before next submission</span>
    </Badge>
  );
}

