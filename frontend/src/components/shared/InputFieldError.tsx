import { getInputFieldError, type IInputErrorState } from '@/lib/getInputFieldError';
import { AlertCircle } from 'lucide-react';

interface InputFieldErrorProps {
  field: string;
  state: IInputErrorState | null | undefined;
  className?: string;
}

export default function InputFieldError({ field, state, className = '' }: InputFieldErrorProps) {
  const errorMessage = getInputFieldError(field, state);

  if (!errorMessage) return null;

  return (
    <p
      role="alert"
      className={`mt-1.5 flex items-center gap-1.5 text-xs font-medium text-destructive transition-all duration-200 ${className}`}
    >
      <AlertCircle className="size-3.5 shrink-0" />
      <span>{errorMessage}</span>
    </p>
  );
}

