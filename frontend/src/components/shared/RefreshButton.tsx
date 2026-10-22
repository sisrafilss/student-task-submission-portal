'use client';

import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

interface RefreshButtonProps {
  size?: 'sm' | 'default' | 'lg' | 'icon' | 'icon-sm';
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  showLabel?: boolean;
  className?: string;
}

export default function RefreshButton({
  size = 'default',
  variant = 'outline',
  showLabel = true,
  className = '',
}: RefreshButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleRefresh}
      disabled={isPending}
      className={`h-9 shadow-xs ${className}`}
    >
      <RefreshCw
        className={`size-4 ${isPending ? 'animate-spin text-primary' : ''} ${showLabel ? 'mr-1.5' : ''}`}
      />
      {showLabel && <span>Refresh</span>}
    </Button>
  );
}

