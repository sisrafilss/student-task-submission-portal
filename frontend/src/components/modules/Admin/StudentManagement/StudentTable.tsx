'use client';

import DeleteConfirmationDialog from '@/components/shared/DeleteConfirmationDialog';
import ManagementTable from '@/components/shared/ManagementTable';
import { deleteStudent } from '@/services/admin/studentManagement';
import { IBatch, IStudent } from '@/types/student.interface';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { studentColumns } from './studentColumn';
import StudentFormDialog from './StudentFormDialog';
import StudentViewDetailDialog from './StudentViewDetailDialog';

interface StudentTableProps {
  students: IStudent[];
  batches: IBatch[];
}

export default function StudentTable({ students, batches }: StudentTableProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [deletingStudent, setDeletingStudent] = useState<IStudent | null>(null);
  const [viewingStudent, setViewingStudent] = useState<IStudent | null>(null);
  const [editingStudent, setEditingStudent] = useState<IStudent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleView = (student: IStudent) => {
    setViewingStudent(student);
  };

  const handleEdit = (student: IStudent) => {
    setEditingStudent(student);
  };

  const handleDelete = (student: IStudent) => {
    setDeletingStudent(student);
  };

  const confirmDelete = async () => {
    if (!deletingStudent) return;

    setIsDeleting(true);
    const result = await deleteStudent(deletingStudent.id);
    setIsDeleting(false);

    if (result.success) {
      toast.success(result.message || 'Student removed successfully');
      setDeletingStudent(null);
      handleRefresh();
    } else {
      toast.error(result.message || 'Failed to delete student');
    }
  };

  return (
    <>
      <ManagementTable
        data={students}
        columns={studentColumns}
        getRowKey={(row) => row.id}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyMessage="No Students Found with the selected filters"
      />

      {/* Edit Student Form Modal */}
      {editingStudent && (
        <StudentFormDialog
          open={Boolean(editingStudent)}
          student={editingStudent}
          batches={batches}
          onClose={() => setEditingStudent(null)}
          onSuccess={() => {
            setEditingStudent(null);
            handleRefresh();
          }}
        />
      )}

      {/* Student View Detail Profile Modal */}
      <StudentViewDetailDialog
        open={Boolean(viewingStudent)}
        student={viewingStudent}
        onClose={() => setViewingStudent(null)}
      />

      {/* Delete Confirmation Alert Modal */}
      <DeleteConfirmationDialog
        open={Boolean(deletingStudent)}
        onOpenChange={(open) => !open && setDeletingStudent(null)}
        onConfirm={confirmDelete}
        title="Remove Student Record"
        itemName={deletingStudent?.name}
        description={`Are you sure you want to delete ${deletingStudent?.name} (${deletingStudent?.studentId})? This action cannot be undone.`}
        isDeleting={isDeleting}
      />
    </>
  );
}

