'use client';

import DateCell from '@/components/shared/cell/DateCell';
import StatusBadgeCell from '@/components/shared/cell/StatusBadgeCell';
import UserInfoCell from '@/components/shared/cell/UserInfoCell';
import { Column } from '@/components/shared/ManagementTable';
import { Badge } from '@/components/ui/badge';
import { IMentor } from '@/types/mentor.interface';
import { CheckCircle2, Star, Users } from 'lucide-react';

export const mentorColumns: Column<IMentor>[] = [
  {
    header: 'Mentor',
    accessor: (mentor) => (
      <UserInfoCell
        name={mentor.name}
        email={mentor.email}
        photo={mentor.avatarUrl}
        subtitle={mentor.mentorId}
      />
    ),
  },
  {
    header: 'Specialization',
    accessor: (mentor) => (
      <Badge variant="secondary" className="font-medium text-xs bg-primary/10 text-primary border-primary/20">
        {mentor.expertise}
      </Badge>
    ),
  },
  {
    header: 'Assigned Batches',
    accessor: (mentor) => (
      <div className="flex flex-wrap gap-1 max-w-[200px]">
        {mentor.assignedBatches.map((batch) => (
          <Badge
            key={batch.id}
            variant="outline"
            className="font-normal text-[11px] bg-muted/40 py-0.5 px-1.5"
          >
            {batch.name.split(' - ')[0]}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    header: 'Workload & Rating',
    accessor: (mentor) => (
      <div className="flex items-center gap-3 text-xs">
        <span
          className="flex items-center gap-1 text-muted-foreground"
          title="Total Assigned Students"
        >
          <Users className="size-3.5 text-blue-500" />
          {mentor.totalAssignedStudents}
        </span>
        <span
          className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400"
          title="Evaluations Completed"
        >
          <CheckCircle2 className="size-3.5 text-emerald-500" />
          {mentor.totalEvaluations}
        </span>
        {mentor.rating && (
          <span
            className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400"
            title="Mentor Rating"
          >
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            {mentor.rating.toFixed(1)}
          </span>
        )}
      </div>
    ),
  },
  {
    header: 'Contact',
    accessor: (mentor) => (
      <span className="text-xs text-muted-foreground">{mentor.contactNumber}</span>
    ),
  },
  {
    header: 'Status',
    accessor: (mentor) => <StatusBadgeCell status={mentor.status} />,
  },
  {
    header: 'Joined',
    accessor: (mentor) => <DateCell date={mentor.createdAt} />,
  },
];

