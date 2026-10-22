'use client';

import { Button } from '@/components/ui/button';
import { LucideIcon, Plus } from 'lucide-react';
import React from 'react';

interface ManagementPageHeaderProps {
  title: string;
  description?: string;
  action?: {
    icon?: LucideIcon;
    label: string;
    onClick: () => void;
  };
  children?: React.ReactNode;
}

export default function ManagementPageHeader({
  title,
  description,
  action,
  children,
}: ManagementPageHeaderProps) {
  const Icon = action?.icon || Plus;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>

      <div className="flex items-center gap-2">
        {action && (
          <Button onClick={action.onClick} className="w-full sm:w-auto shadow-sm">
            <Icon className="mr-2 size-4" />
            {action.label}
          </Button>
        )}
        {children}
      </div>
    </div>
  );
}

