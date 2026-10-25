'use client';

import { Card, CardContent } from '@/components/ui/card';
import { IAssignment } from '@/types/submission.interface';
import { FolderOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import AssignmentCard from './AssignmentCard';
import AssignmentDetailDialog from './AssignmentDetailDialog';
import StudentSubmissionDialog from './StudentSubmissionDialog';

interface AssignmentCardGridProps {
  assignments: IAssignment[];
}

export default function AssignmentCardGrid({ assignments }: AssignmentCardGridProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [selectedAssignment, setSelectedAssignment] = useState<IAssignment | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [submittingAssignment, setSubmittingAssignment] = useState<IAssignment | null>(null);
  const [submissionOpen, setSubmissionOpen] = useState(false);

  const handleViewDetails = (assignment: IAssignment) => {
    setSelectedAssignment(assignment);
    setDetailOpen(true);
  };

  const handleSubmitAssignment = (assignment: IAssignment) => {
    setSubmittingAssignment(assignment);
    setSubmissionOpen(true);
  };

  const handleSubmissionSuccess = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  if (!assignments || assignments.length === 0) {
    return (
      <Card className="border-border/60 bg-muted/10 p-12 text-center">
        <CardContent className="flex flex-col items-center justify-center space-y-3 p-0">
          <div className="rounded-full bg-muted/50 p-4 text-muted-foreground">
            <FolderOpen className="size-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">
              No Assignments Found
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              We couldn&apos;t find any assignments matching your current search or filter criteria. Try adjusting your filters.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {assignments.map((assignment) => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            onViewDetails={handleViewDetails}
            onSubmit={handleSubmitAssignment}
          />
        ))}
      </div>

      {/* Assignment Detail & Rubrics Modal */}
      <AssignmentDetailDialog
        assignment={selectedAssignment}
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedAssignment(null);
        }}
        onSubmit={(assignment) => {
          setDetailOpen(false);
          setSelectedAssignment(null);
          handleSubmitAssignment(assignment);
        }}
      />

      {/* Direct Student Submission Modal */}
      <StudentSubmissionDialog
        open={submissionOpen}
        assignment={submittingAssignment}
        onClose={() => {
          setSubmissionOpen(false);
          setSubmittingAssignment(null);
        }}
        onSuccess={handleSubmissionSuccess}
      />
    </>
  );
}
