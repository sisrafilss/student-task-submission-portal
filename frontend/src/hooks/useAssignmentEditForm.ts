'use client';

import { updateAssignmentAction } from '@/services/assignments/assignmentManagement';
import { IBackendAssignment, IMentorQuotaInput, IRubricItem } from '@/types/assignment.interface';
import { useCallback, useEffect, useRef, useState, useActionState } from 'react';
import { toast } from 'sonner';

export interface MentorOption {
  id: string;
  name: string;
  email: string;
  expertise?: string;
}

export interface UseAssignmentEditFormProps {
  assignment: IBackendAssignment | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  availableMentors?: MentorOption[];
}

export function useAssignmentEditForm({
  assignment,
  open,
  onClose,
  onSuccess,
}: UseAssignmentEditFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  // Controlled form states
  const [title, setTitle] = useState(assignment?.title || '');
  const [description, setDescription] = useState(assignment?.description || '');
  const [batchId, setBatchId] = useState(assignment?.batchId || 'BATCH-01');
  const [deadline, setDeadline] = useState(
    assignment?.deadline
      ? new Date(assignment.deadline).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16)
  );
  const [totalMarks, setTotalMarks] = useState(assignment?.totalMarks || 100);
  const [defaultQuota, setDefaultQuota] = useState(assignment?.maxPerMentor || 15);
  const [status, setStatus] = useState<string>(assignment?.status || 'PUBLISHED');
  const [rubrics, setRubrics] = useState<IRubricItem[]>(() => {
    if (Array.isArray(assignment?.rubrics) && assignment.rubrics.length > 0) {
      return assignment.rubrics.map((r, i) => ({
        id: (r as { id?: string }).id || String(i + 1),
        criterion: (r as { criterion: string }).criterion,
        maxMarks: (r as { maxMarks: number }).maxMarks,
      }));
    }
    return [
      { id: '1', criterion: 'Responsive Design & Neat Layout', maxMarks: 50 },
      { id: '2', criterion: 'Clean Architecture & Best Practices', maxMarks: 50 },
    ];
  });
  const [mentorQuotas, setMentorQuotas] = useState<IMentorQuotaInput[]>(() => {
    if (Array.isArray(assignment?.mentors) && assignment.mentors.length > 0) {
      return assignment.mentors.map((m) => ({
        mentorId: m.mentorId,
        mentorName: m.mentor?.name,
        maxQuota: m.maxQuota,
      }));
    }
    return [];
  });

  // Re-synchronize when a different assignment is selected or modal opens
  useEffect(() => {
    if (assignment && open) {
      setTitle(assignment.title || '');
      setDescription(assignment.description || '');
      setBatchId(assignment.batchId || 'BATCH-01');
      setDeadline(
        assignment.deadline
          ? new Date(assignment.deadline).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16)
      );
      setTotalMarks(assignment.totalMarks || 100);
      setDefaultQuota(assignment.maxPerMentor || 15);
      setStatus(assignment.status || 'PUBLISHED');

      if (Array.isArray(assignment.rubrics) && assignment.rubrics.length > 0) {
        setRubrics(
          assignment.rubrics.map((r, i) => ({
            id: (r as { id?: string }).id || String(i + 1),
            criterion: (r as { criterion: string }).criterion,
            maxMarks: (r as { maxMarks: number }).maxMarks,
          }))
        );
      }

      if (Array.isArray(assignment.mentors) && assignment.mentors.length > 0) {
        setMentorQuotas(
          assignment.mentors.map((m) => ({
            mentorId: m.mentorId,
            mentorName: m.mentor?.name,
            maxQuota: m.maxQuota,
          }))
        );
      }
    }
  }, [assignment, open]);

  // React 19 Action State Binding with bound assignmentId
  const updateActionWithId = updateAssignmentAction.bind(null, assignment?.id || '');
  const [state, formAction, isPending] = useActionState(updateActionWithId, null);

  const resetForm = useCallback(() => {
    formRef.current?.reset();
  }, []);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || 'Assignment updated successfully!');
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
      status,
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
      setStatus,
      setRubrics,
      setMentorQuotas,
    },
    resetForm,
  };
}

