'use client';

import { Badge } from '@/components/ui/badge';

interface StatusBadgeCellProps {
  status: string;
}

export default function StatusBadgeCell({ status }: StatusBadgeCellProps) {
  const normalizedStatus = status?.toUpperCase() || 'UNKNOWN';

  switch (normalizedStatus) {
    case 'ACTIVE':
      return (
        <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          Active
        </Badge>
      );
    case 'GRADUATED':
      return (
        <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400">
          Graduated
        </Badge>
      );
    case 'INACTIVE':
      return (
        <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
          Inactive
        </Badge>
      );
    case 'BLOCKED':
      return (
        <Badge variant="destructive">
          Blocked
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

