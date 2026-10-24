'use client';

import RefreshButton from '@/components/shared/RefreshButton';
import SearchFilter from '@/components/shared/SearchFilter';
import SelectFilter, { SelectFilterOption } from '@/components/shared/SelectFilter';
import { IAssignment } from '@/types/submission.interface';
import { BookOpen, Filter } from 'lucide-react';
import { useMemo } from 'react';

interface MentorSubmissionsToolbarProps {
  assignments: IAssignment[];
}

const STATUS_OPTIONS: SelectFilterOption[] = [
  { label: 'All Statuses', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Under Review', value: 'UNDER_REVIEW' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
];

export default function MentorSubmissionsToolbar({
  assignments = [],
}: MentorSubmissionsToolbarProps) {
  const assignmentOptions: SelectFilterOption[] = useMemo(() => {
    const defaultOpt: SelectFilterOption = { label: 'All Assignments', value: 'ALL' };
    const dynamicOpts: SelectFilterOption[] = assignments.map((a) => ({
      label: a.title,
      value: a.id,
    }));
    return [defaultOpt, ...dynamicOpts];
  }, [assignments]);

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-xl border border-border/70 bg-card p-3 shadow-xs">
      <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        <SearchFilter
          placeholder="Search by student, project, or title..."
          paramName="searchTerm"
          className="w-full sm:max-w-xs"
        />

        <div className="w-full sm:w-44">
          <SelectFilter
            paramName="status"
            placeholder="Filter Status"
            options={STATUS_OPTIONS}
            allLabel="All Statuses"
            prefix={<Filter className="size-3.5 text-muted-foreground mr-1.5" />}
          />
        </div>

        <div className="w-full sm:w-56">
          <SelectFilter
            paramName="assignmentId"
            placeholder="Filter Assignment"
            options={assignmentOptions}
            allLabel="All Assignments"
            prefix={<BookOpen className="size-3.5 text-muted-foreground mr-1.5" />}
          />
        </div>
      </div>

      <div className="flex items-center justify-end shrink-0 pt-1 md:pt-0">
        <RefreshButton />
      </div>
    </div>
  );
}
