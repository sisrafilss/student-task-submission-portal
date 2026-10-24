'use client';

import { Column } from '@/components/shared/ManagementTable';
import { Button } from '@/components/ui/button';
import { IBatch } from '@/types/batch.interface';
import { Calendar, Layers, Pencil, Trash2 } from 'lucide-react';
import React from 'react';
import BatchStatusBadge from './BatchStatusBadge';

export const createBatchColumns = (
  onEdit: (batch: IBatch) => void,
  onDelete: (batch: IBatch) => void
): Column<IBatch>[] => [
  {
    header: 'Batch & Code',
    accessor: (row) => (
      <div className="space-y-1">
        <p className="font-semibold text-foreground text-xs line-clamp-1">{row.name}</p>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
          <Layers className="size-3 text-primary" />
          <span>{row.batchCode}</span>
        </div>
      </div>
    ),
  },
  {
    header: 'Course Track',
    accessor: (row) => (
      <span className="text-xs text-foreground font-medium">{row.track}</span>
    ),
  },
  {
    header: 'Status',
    accessor: (row) => <BatchStatusBadge status={row.status} />,
  },
  {
    header: 'Created Date',
    accessor: (row) => (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Calendar className="size-3.5" />
        <span>
          {row.createdAt
            ? new Date(row.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : '—'}
        </span>
      </div>
    ),
  },
  {
    header: 'Actions',
    accessor: (row) => (
      <div className="flex items-center gap-1.5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onEdit(row)}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          title="Edit Batch"
        >
          <Pencil className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onDelete(row)}
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
          title="Delete Batch"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    ),
  },
];

