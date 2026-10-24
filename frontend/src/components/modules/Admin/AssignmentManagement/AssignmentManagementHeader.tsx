'use client';

import { Button } from '@/components/ui/button';
import { IBatchOption } from '@/types/batch.interface';
import { BookOpen, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import AssignmentCreateDialog from './AssignmentCreateDialog';

interface MentorOption {
  id: string;
  name: string;
  email: string;
  expertise?: string;
}

interface AssignmentManagementHeaderProps {
  totalCount: number;
  availableMentors: MentorOption[];
  availableBatches?: IBatchOption[];
}

export default function AssignmentManagementHeader({
  totalCount,
  availableMentors,
  availableBatches = [],
}: AssignmentManagementHeaderProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleSuccess = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <BookOpen className="size-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Assignments Management
          </h1>
        </div>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Create, schedule, and allocate batch assignments with automated mentor quotas ({totalCount} total).
        </p>
      </div>

      <Button
        onClick={() => setIsCreateOpen(true)}
        className="gap-2 font-medium self-start sm:self-auto"
      >
        <Plus className="size-4" />
        Create Assignment
      </Button>

      {isCreateOpen && (
        <AssignmentCreateDialog
          open={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSuccess={handleSuccess}
          availableMentors={availableMentors}
          availableBatches={availableBatches}
        />
      )}
    </div>
  );
}

