import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

interface FormAlertProps {
  message?: string | null;
  variant?: 'default' | 'destructive';
  className?: string;
}

export default function FormAlert({
  message,
  variant = 'destructive',
  className = '',
}: FormAlertProps) {
  if (!message) return null;

  return (
    <Alert
      variant={variant}
      className={`text-xs py-2.5 px-3 border-destructive/30 bg-destructive/10 text-destructive animate-in fade-in-50 ${className}`}
    >
      <ShieldAlert className="size-4 shrink-0 text-destructive" />
      <AlertDescription className="text-xs font-medium text-destructive">
        {message}
      </AlertDescription>
    </Alert>
  );
}

