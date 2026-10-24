'use client';

import DateCell from '@/components/shared/cell/DateCell';
import UserInfoCell from '@/components/shared/cell/UserInfoCell';
import { Column } from '@/components/shared/ManagementTable';
import { Button } from '@/components/ui/button';
import { ISubmission } from '@/types/submission.interface';
import {
  Award,
  CheckSquare,
  ExternalLink,
  Eye,
  GitBranch,
  Globe,
} from 'lucide-react';
import MentorSubmissionStatusBadge from './MentorSubmissionStatusBadge';

interface MentorSubmissionColumnsProps {
  onView: (submission: ISubmission) => void;
  onReview: (submission: ISubmission) => void;
}

export const createMentorSubmissionColumns = ({
  onView,
  onReview,
}: MentorSubmissionColumnsProps): Column<ISubmission>[] => [
  {
    header: 'Student',
    accessor: (sub) => (
      <UserInfoCell
        name={sub.studentName}
        email={sub.studentEmail}
        subtitle={sub.id}
      />
    ),
  },
  {
    header: 'Assignment & Project',
    accessor: (sub) => (
      <div className="space-y-0.5 max-w-[220px]">
        <p className="font-semibold text-xs text-foreground line-clamp-1" title={sub.assignmentTitle}>
          {sub.assignmentTitle}
        </p>
        <p className="text-[11px] text-muted-foreground font-medium line-clamp-1" title={sub.projectName}>
          {sub.projectName}
        </p>
      </div>
    ),
  },
  {
    header: 'Links',
    accessor: (sub) => (
      <div className="flex items-center gap-1.5">
        <a
          href={sub.repoUrl}
          target="_blank"
          rel="noreferrer"
          title="Open Git Repository"
          className="inline-flex items-center gap-1 h-7 px-2 text-[11px] font-medium rounded-md border border-border bg-muted/40 hover:bg-muted/80 text-foreground transition-colors"
        >
          <GitBranch className="size-3 text-foreground" />
          <span>Repo</span>
          <ExternalLink className="size-2.5 opacity-60" />
        </a>

        <a
          href={sub.liveUrl}
          target="_blank"
          rel="noreferrer"
          title="Open Live Preview"
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
    accessor: (sub) => <MentorSubmissionStatusBadge status={sub.status} />,
  },
  {
    header: 'Score',
    accessor: (sub) => (
      <div className="flex items-center gap-1.5 text-xs">
        <Award className="size-3.5 text-amber-500 shrink-0" />
        <span
          className={`font-semibold ${
            typeof sub.score === 'number' && sub.score !== null
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-muted-foreground font-normal'
          }`}
        >
          {typeof sub.score === 'number' && sub.score !== null
            ? `${sub.score} / ${sub.maxScore || 100}`
            : 'Pending'}
        </span>
      </div>
    ),
  },
  {
    header: 'Submitted',
    accessor: (sub) => <DateCell date={sub.createdAt} />,
  },
  {
    header: 'Actions',
    className: 'text-right',
    accessor: (sub) => {
      const isEvaluated =
        sub.status === 'APPROVED' || sub.status === 'REJECTED' || sub.status === 'EVALUATED';

      return (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onView(sub)}
            className="h-7 px-2 text-xs gap-1 border-border/80 hover:bg-muted"
            title="View Details"
          >
            <Eye className="size-3.5 text-primary" />
            <span className="hidden sm:inline">View</span>
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => onReview(sub)}
            className={`h-7 px-2.5 text-xs gap-1 font-medium shadow-xs ${
              isEvaluated
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground'
            }`}
            title={isEvaluated ? 'Re-evaluate Submission' : 'Evaluate Submission'}
          >
            <CheckSquare className="size-3.5" />
            <span>{isEvaluated ? 'Re-evaluate' : 'Evaluate'}</span>
          </Button>
        </div>
      );
    },
  },
];
