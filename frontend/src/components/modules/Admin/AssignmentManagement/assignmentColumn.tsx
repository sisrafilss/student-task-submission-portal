import { Column } from '@/components/shared/ManagementTable';
import { Badge } from '@/components/ui/badge';
import { IBackendAssignment } from '@/types/assignment.interface';
import { Award, Calendar, Layers, Users } from 'lucide-react';
import React from 'react';

export const assignmentColumns: Column<IBackendAssignment>[] = [
  {
    header: 'Assignment & Batch',
    accessor: (row) => (
      <div className="space-y-1">
        <p className="font-semibold text-foreground text-xs line-clamp-1">{row.title}</p>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Layers className="size-3 text-primary" />
          <span>{row.batchId}</span>
        </div>
      </div>
    ),
  },
  {
    header: 'Deadline',
    accessor: (row) => {
      const isPast = new Date(row.deadline).getTime() < Date.now();
      return (
        <div className="flex items-center gap-1.5 text-xs">
          <Calendar className="size-3.5 text-muted-foreground" />
          <span className={isPast ? 'text-destructive font-medium' : 'text-foreground'}>
            {new Date(row.deadline).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      );
    },
  },
  {
    header: 'Total Marks',
    accessor: (row) => (
      <div className="flex items-center gap-1 text-xs font-semibold text-foreground">
        <Award className="size-3.5 text-amber-500" />
        <span>{row.totalMarks} pts</span>
      </div>
    ),
  },
  {
    header: 'Mentors Allocated',
    accessor: (row) => {
      const mentorsCount = row.mentors?.length || 0;
      const totalCapacity = (row.mentors || []).reduce(
        (sum, m) => sum + (m.maxQuota || 0),
        0
      );
      return (
        <div className="flex items-center gap-1.5 text-xs text-foreground">
          <Users className="size-3.5 text-primary" />
          <span className="font-medium">{mentorsCount} Mentors</span>
          <span className="text-[11px] text-muted-foreground">({totalCapacity} quota)</span>
        </div>
      );
    },
  },
  {
    header: 'Submissions',
    accessor: (row) => (
      <span className="text-xs font-medium text-foreground">
        {row._count?.submissions || 0} Submitted
      </span>
    ),
  },
  {
    header: 'Status',
    accessor: (row) => {
      const isPublished = row.status === 'PUBLISHED';
      return (
        <Badge
          variant="outline"
          className={
            isPublished
              ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 text-[11px]'
              : 'border-muted text-muted-foreground bg-muted/20 text-[11px]'
          }
        >
          {row.status}
        </Badge>
      );
    },
  },
];

