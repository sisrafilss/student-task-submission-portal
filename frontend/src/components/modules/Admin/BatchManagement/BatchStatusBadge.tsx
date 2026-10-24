'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BatchStatus } from '@/types/batch.interface';
import React from 'react';

interface BatchStatusBadgeProps {
  status: BatchStatus;
  className?: string;
}

export default function BatchStatusBadge({
  status,
  className,
}: BatchStatusBadgeProps) {
  const getStatusStyles = (currentStatus: BatchStatus) => {
    switch (currentStatus) {
      case 'ACTIVE':
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium';
      case 'UPCOMING':
        return 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400 font-medium';
      case 'COMPLETED':
        return 'border-muted-foreground/30 bg-muted/30 text-muted-foreground font-medium';
      default:
        return 'border-border bg-muted/20 text-foreground';
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn('text-xs px-2.5 py-0.5 rounded-full capitalize', getStatusStyles(status), className)}
    >
      {status.toLowerCase()}
    </Badge>
  );
}

