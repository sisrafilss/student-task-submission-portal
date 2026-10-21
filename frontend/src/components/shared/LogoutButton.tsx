'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { logoutUser } from '@/services/auth/logoutUser';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'secondary' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'xs';
  showIcon?: boolean;
  label?: string;
}

export default function LogoutButton({
  className = '',
  variant = 'destructive',
  size = 'sm',
  showIcon = true,
  label = 'Sign out',
}: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutUser();
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isPending}
      className={className}
      aria-label="Log out of session"
    >
      {showIcon && <LogOut className="size-4 shrink-0" aria-hidden="true" />}
      <span>{isPending ? 'Signing out...' : label}</span>
    </Button>
  );
}

