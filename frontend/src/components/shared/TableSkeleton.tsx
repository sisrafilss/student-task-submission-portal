'use client';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
  showActions?: boolean;
}

export default function TableSkeleton({
  columns = 7,
  rows = 8,
  showActions = true,
}: TableSkeletonProps) {
  return (
    <div className="rounded-xl border border-border/70 bg-card shadow-xs overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            {Array.from({ length: columns }).map((_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-4 w-24" />
              </TableHead>
            ))}
            {showActions && (
              <TableHead className="w-[60px] text-right">
                <Skeleton className="ml-auto h-4 w-10" />
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <TableRow key={rowIdx}>
              {Array.from({ length: columns }).map((_, colIdx) => (
                <TableCell key={colIdx} className="py-3.5">
                  {colIdx === 0 ? (
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-9 rounded-full shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    </div>
                  ) : (
                    <Skeleton className="h-4 w-20" />
                  )}
                </TableCell>
              ))}
              {showActions && (
                <TableCell className="text-right">
                  <Skeleton className="ml-auto size-8 rounded-md" />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

