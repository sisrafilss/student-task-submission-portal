'use client';

import { ISubmission } from '@/types/submission.interface';
import { AlertCircle } from 'lucide-react';

interface SubmissionEligibilityAlertProps {
  existingSubmission: ISubmission | null;
}

export default function SubmissionEligibilityAlert({
  existingSubmission,
}: SubmissionEligibilityAlertProps) {
  if (!existingSubmission) return null;

  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3.5 text-xs text-amber-800 dark:text-amber-300">
      <AlertCircle className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <div className="space-y-1">
        <p className="font-semibold">
          Already Submitted ({existingSubmission.status})
        </p>
        <p className="text-amber-700/90 dark:text-amber-300/90 leading-relaxed">
          You have already submitted a project for this assignment (&ldquo;{existingSubmission.projectName}&rdquo;). Duplicate submissions for the same assignment are restricted to maintain submission integrity.
        </p>
      </div>
    </div>
  );
}
