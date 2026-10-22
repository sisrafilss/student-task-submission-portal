'use client';

import ManagementPageHeader from '@/components/shared/ManagementPageHeader';
import { UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import MentorCreateDialog from './MentorCreateDialog';

export default function MentorManagementHeader() {
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
        title="Mentor Management"
        description="Oversee mentor assignments, evaluate student submissions, and manage academic specializations"
        action={{
          icon: UserPlus,
          label: 'Add Mentor',
          onClick: () => setIsAddOpen(true),
        }}
      />

      {isAddOpen && (
        <MentorCreateDialog
          open={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}

