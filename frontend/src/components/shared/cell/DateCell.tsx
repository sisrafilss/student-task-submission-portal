'use client';

import { formatDateTime } from '@/lib/formatters';

interface DateCellProps {
  date?: string | Date;
}

export default function DateCell({ date }: DateCellProps) {
  if (!date) return <span className="text-xs text-muted-foreground">N/A</span>;
  return <span className="text-xs text-muted-foreground whitespace-nowrap">{formatDateTime(date)}</span>;
}

