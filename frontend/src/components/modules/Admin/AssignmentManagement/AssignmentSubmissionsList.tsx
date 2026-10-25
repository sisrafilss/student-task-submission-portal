'use client';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { getAssignmentSubmissions } from '@/services/submissions/submissionManagement';
import { ISubmission } from '@/types/submission.interface';
import { FileQuestion, RefreshCw, Search, Users } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import AssignmentSubmissionCard from './AssignmentSubmissionCard';

interface AssignmentSubmissionsListProps {
  assignmentId: string;
  initialSubmissions?: ISubmission[];
}

export default function AssignmentSubmissionsList({
  assignmentId,
  initialSubmissions,
}: AssignmentSubmissionsListProps) {
  const [submissions, setSubmissions] = useState<ISubmission[]>(
    initialSubmissions || []
  );
  const [loading, setLoading] = useState<boolean>(!initialSubmissions);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (initialSubmissions) {
      setSubmissions(initialSubmissions);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    getAssignmentSubmissions(assignmentId)
      .then((res) => {
        if (isMounted && res.success) {
          setSubmissions(res.data);
        }
      })
      .catch(() => {
        if (isMounted) setSubmissions([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [assignmentId, initialSubmissions]);

  const filteredSubmissions = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return submissions;

    return submissions.filter(
      (sub) =>
        sub.studentName.toLowerCase().includes(term) ||
        sub.studentEmail.toLowerCase().includes(term) ||
        (sub.mentorName && sub.mentorName.toLowerCase().includes(term)) ||
        sub.status.toLowerCase().includes(term)
    );
  }, [submissions, searchTerm]);

  if (loading) {
    return (
      <div className="space-y-3 py-2">
        <Skeleton className="h-9 w-full rounded-lg" />
        <div className="space-y-3">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Bar: Count and Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-primary" />
          <span className="text-xs font-semibold text-foreground">
            Student Submissions
          </span>
          <Badge variant="secondary" className="text-xs">
            {submissions.length} Total
          </Badge>
        </div>

        {submissions.length > 0 && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by student or mentor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8 pl-8 text-xs bg-background"
            />
          </div>
        )}
      </div>

      {/* Submissions List / Empty States */}
      {submissions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/70 p-8 text-center bg-muted/10 space-y-2.5">
          <FileQuestion className="size-8 text-muted-foreground mx-auto opacity-70" />
          <h4 className="text-sm font-semibold text-foreground">
            No student submissions yet for this assignment
          </h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Once enrolled students submit their project deliverables, their
            repositories, scores, and mentor feedback will appear here in real time.
          </p>
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="rounded-lg border border-border/60 p-6 text-center text-xs text-muted-foreground">
          No submissions matching &ldquo;{searchTerm}&rdquo;
        </div>
      ) : (
        <ScrollArea className="max-h-[calc(85vh-200px)] pr-2" orientation="vertical">
          <div className="space-y-3 pb-2">
            {filteredSubmissions.map((sub) => (
              <AssignmentSubmissionCard key={sub.id} submission={sub} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

