'use client';

import { Card, CardContent } from '@/components/ui/card';
import { IAssignment } from '@/types/submission.interface';
import { FolderOpen } from 'lucide-react';
import React, { useState } from 'react';
import AssignmentCard from './AssignmentCard';
import AssignmentDetailDialog from './AssignmentDetailDialog';

interface AssignmentCardGridProps {
  assignments: IAssignment[];
}

export default function AssignmentCardGrid({ assignments }: AssignmentCardGridProps) {
  const [selectedAssignment, setSelectedAssignment] = useState<IAssignment | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewDetails = (assignment: IAssignment) => {
    setSelectedAssignment(assignment);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedAssignment(null);
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
          />
        ))}
      </div>

      {/* Assignment Detail & Rubrics Modal */}
      <AssignmentDetailDialog
        assignment={selectedAssignment}
        open={dialogOpen}
        onClose={handleCloseDialog}
      />
    </>
  );
}
