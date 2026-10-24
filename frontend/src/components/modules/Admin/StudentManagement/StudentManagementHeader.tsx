'use client';

import ManagementPageHeader from '@/components/shared/ManagementPageHeader';
import { IBatch } from '@/types/student.interface';
import { UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import StudentCreateDialog from './StudentCreateDialog';

interface StudentManagementHeaderProps {
  batches?: IBatch[];
}

export default function StudentManagementHeader({
  batches = [],
}: StudentManagementHeaderProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const handleSuccess = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <>
      <ManagementPageHeader
        title="Student Management"
        description="Monitor student records, track batch enrollments, and manage academic statuses"
        action={{
          icon: UserPlus,
          label: 'Add Student',
          onClick: () => setIsAddOpen(true),
        }}
      />

      {isAddOpen && (
        <StudentCreateDialog
          open={isAddOpen}
          batches={batches}
          onClose={() => setIsAddOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
