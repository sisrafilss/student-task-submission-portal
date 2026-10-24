'use client';

import { Button } from '@/components/ui/button';
import { Layers, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import BatchFormDialog from './BatchFormDialog';

interface BatchManagementHeaderProps {
  totalCount: number;
}

export default function BatchManagementHeader({
  totalCount,
}: BatchManagementHeaderProps) {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleSuccess = () => {
    router.refresh();
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Layers className="size-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Batch Management
          </h1>
        </div>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Create, organize, and manage student batches and course tracks ({totalCount} total).
        </p>
      </div>

      <Button
        onClick={() => setIsCreateOpen(true)}
        className="gap-2 font-medium self-start sm:self-auto"
      >
        <Plus className="size-4" />
        Add New Batch
      </Button>

      {isCreateOpen && (
        <BatchFormDialog
          open={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

