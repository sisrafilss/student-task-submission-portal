'use client';

import ManagementTable from '@/components/shared/ManagementTable';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { IBatch } from '@/types/batch.interface';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import BatchDeleteDialog from './BatchDeleteDialog';
import BatchFormDialog from './BatchFormDialog';
import { createBatchColumns } from './batchColumn';

interface BatchTableProps {
  batches: IBatch[];
}

export default function BatchTable({ batches }: BatchTableProps) {
  const router = useRouter();
  const [editingBatch, setEditingBatch] = useState<IBatch | null>(null);
  const [deletingBatch, setDeletingBatch] = useState<IBatch | null>(null);

  const handleEdit = (batch: IBatch) => {
    setEditingBatch(batch);
  };

  const handleDelete = (batch: IBatch) => {
    setDeletingBatch(batch);
  };

  const handleRefresh = () => {
    router.refresh();
  };

  const columns = createBatchColumns(handleEdit, handleDelete);

  return (
    <div className="rounded-xl border border-border/80 bg-card overflow-hidden">
      <ScrollArea className="w-full" orientation="horizontal">
        <ManagementTable<IBatch>
          columns={columns}
          data={batches}
          getRowKey={(row: IBatch) => row.id}
          emptyMessage="No batches found. Click '+ Add New Batch' to create your first batch."
        />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Edit Modal */}
      {editingBatch && (
        <BatchFormDialog
          key={editingBatch.id}
          open={Boolean(editingBatch)}
          batchToEdit={editingBatch}
          onClose={() => setEditingBatch(null)}
          onSuccess={handleRefresh}
        />
      )}

      {/* Delete Modal */}
      {deletingBatch && (
        <BatchDeleteDialog
          open={Boolean(deletingBatch)}
          batch={deletingBatch}
          onClose={() => setDeletingBatch(null)}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
}
