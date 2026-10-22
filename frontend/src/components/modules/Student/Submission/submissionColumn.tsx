'use client';

import DateCell from '@/components/shared/cell/DateCell';
import StatusBadgeCell from '@/components/shared/cell/StatusBadgeCell';
import { Column } from '@/components/shared/ManagementTable';
import { ISubmission } from '@/types/submission.interface';
import { Award, ExternalLink, GitBranch, Globe } from 'lucide-react';

export const submissionColumns: Column<ISubmission>[] = [
  {
    header: 'Assignment',
    accessor: (submission) => (
      <div className="space-y-0.5">
        <p className="font-semibold text-xs text-foreground leading-snug">
          {submission.assignmentTitle}
        </p>
      </div>
    ),
  },
  {
    header: 'Project Name',
    accessor: (submission) => (
      <span className="font-medium text-xs text-foreground">{submission.projectName}</span>
    ),
  },
  {
    header: 'Links',
    accessor: (submission) => (
      <div className="flex items-center gap-1.5">
        <a
          href={submission.repoUrl}
          target="_blank"
          rel="noreferrer"
          title="Open Repository"
          className="inline-flex items-center gap-1 h-7 px-2 text-[11px] font-medium rounded-md border border-border bg-muted/40 hover:bg-muted/80 text-foreground transition-colors"
        >
          <GitBranch className="size-3 text-foreground" />
          <span>Repo</span>
          <ExternalLink className="size-2.5 opacity-60" />
        </a>

        <a
          href={submission.liveUrl}
          target="_blank"
          rel="noreferrer"
          title="Open Live Demo"
          className="inline-flex items-center gap-1 h-7 px-2 text-[11px] font-medium rounded-md border border-border bg-muted/40 hover:bg-muted/80 text-foreground transition-colors"
        >
          <Globe className="size-3 text-blue-500" />
          <span>Live</span>
          <ExternalLink className="size-2.5 opacity-60" />
        </a>
      </div>
    ),
  },
  {
    header: 'Status',
    accessor: (submission) => <StatusBadgeCell status={submission.status} />,
  },
  {
    header: 'Score / Marks',
    accessor: (submission) => (
      <div className="flex items-center gap-1.5">
        <Award className="size-3.5 text-amber-500 shrink-0" />
        <span
          className={`text-xs font-semibold ${
            submission.score !== null && submission.score !== undefined
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-muted-foreground font-normal'
          }`}
        >
          {submission.score !== null && submission.score !== undefined
            ? `${submission.score} Marks`
            : 'Pending'}
        </span>
      </div>
    ),
  },
  {
    header: 'Submitted At',
    accessor: (submission) => <DateCell date={submission.createdAt} />,
  },
];
