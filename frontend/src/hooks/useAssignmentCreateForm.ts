'use client';

import { createAssignmentAction } from '@/services/assignments/assignmentManagement';
import { IMentorQuotaInput, IRubricItem } from '@/types/assignment.interface';
import { useCallback, useEffect, useRef, useState, useActionState } from 'react';
import { toast } from 'sonner';

export interface MentorOption {
  id: string;
  name: string;
  email: string;
  expertise?: string;
}

export interface UseAssignmentCreateFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  availableMentors?: MentorOption[];
}

const getDefaultDeadline = () =>
  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);

const getDefaultRubrics = (): IRubricItem[] => [
  { id: '1', criterion: 'Responsive Design & Neat Layout', maxMarks: 50 },
  { id: '2', criterion: 'Clean Architecture & Best Practices', maxMarks: 50 },
];

export function useAssignmentCreateForm({
  onClose,
  onSuccess,
}: UseAssignmentCreateFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  // Controlled form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [batchId, setBatchId] = useState('BATCH-01');
  const [deadline, setDeadline] = useState(getDefaultDeadline);
  const [totalMarks, setTotalMarks] = useState(100);
  const [defaultQuota, setDefaultQuota] = useState(15);
  const [rubrics, setRubrics] = useState<IRubricItem[]>(getDefaultRubrics);
  const [mentorQuotas, setMentorQuotas] = useState<IMentorQuotaInput[]>([]);

  // React 19 Action State Binding
  const [state, formAction, isPending] = useActionState(createAssignmentAction, null);

  const resetForm = useCallback(() => {
    setTitle('');
    setDescription('');
    setBatchId('BATCH-01');
    setDeadline(getDefaultDeadline());
    setTotalMarks(100);
    setDefaultQuota(15);
    setRubrics(getDefaultRubrics());
    setMentorQuotas([]);
    formRef.current?.reset();
  }, []);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || 'Assignment created successfully!');
      onSuccess();
      onClose();
    } else if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state, onSuccess, onClose]);

  return {
    formRef,
    state,
    formAction,
    isPending,
    formValues: {
      title,
      description,
      batchId,
      deadline,
      totalMarks,
      defaultQuota,
      rubrics,
      mentorQuotas,
    },
    setters: {
      setTitle,
      setDescription,
      setBatchId,
      setDeadline,
      setTotalMarks,
      setDefaultQuota,
      setRubrics,
      setMentorQuotas,
    },
    resetForm,
  };
}
