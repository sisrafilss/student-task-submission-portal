'use client';

import DateCell from '@/components/shared/cell/DateCell';
import StatusBadgeCell from '@/components/shared/cell/StatusBadgeCell';
import UserInfoCell from '@/components/shared/cell/UserInfoCell';
import { Column } from '@/components/shared/ManagementTable';
import { Badge } from '@/components/ui/badge';
import { IStudent } from '@/types/student.interface';
import { Award, BookOpen } from 'lucide-react';

export const studentColumns: Column<IStudent>[] = [
  {
    header: 'Student',
    accessor: (student) => (
      <UserInfoCell
        name={student.name}
        email={student.email}
        photo={student.avatarUrl}
        subtitle={student.studentId}
      />
    ),
  },
  {
    header: 'Batch',
    accessor: (student) => (
      <Badge variant="outline" className="font-normal bg-muted/30 text-xs">
        {student.batchName}
      </Badge>
    ),
  },
  {
    header: 'Track',
    accessor: (student) => (
      <span className="text-xs font-medium text-foreground">{student.enrolledTrack}</span>
    ),
  },
  {
    header: 'Performance',
    accessor: (student) => (
      <div className="flex items-center gap-3 text-xs">
        <span className="flex items-center gap-1 text-muted-foreground" title="Total Submissions">
          <BookOpen className="size-3.5 text-blue-500" />
          {student.totalSubmissions ?? 0}
        </span>
        <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400" title="Average Score">
          <Award className="size-3.5 text-amber-500" />
          {student.averageScore ? `${student.averageScore}%` : 'N/A'}
        </span>
      </div>
    ),
  },
  {
    header: 'Contact',
    accessor: (student) => (
      <span className="text-xs text-muted-foreground">{student.contactNumber}</span>
    ),
  },
  {
    header: 'Status',
    accessor: (student) => <StatusBadgeCell status={student.status} />,
  },
  {
    header: 'Joined',
    accessor: (student) => <DateCell date={student.createdAt} />,
  },
];

