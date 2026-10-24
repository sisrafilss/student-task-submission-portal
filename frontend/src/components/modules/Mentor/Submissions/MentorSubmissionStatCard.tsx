'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React from 'react';

export type StatColorVariant = 'blue' | 'amber' | 'emerald' | 'rose' | 'purple';

interface MentorSubmissionStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  colorVariant: StatColorVariant;
}

const colorClasses: Record<
  StatColorVariant,
  { bg: string; text: string; iconBg: string; border: string }
> = {
  blue: {
    bg: 'bg-blue-500/5',
    text: 'text-blue-600 dark:text-blue-400',
    iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/20',
  },
  amber: {
    bg: 'bg-amber-500/5',
    text: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    border: 'border-amber-500/20',
  },
  emerald: {
    bg: 'bg-emerald-500/5',
    text: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-500/20',
  },
  rose: {
    bg: 'bg-rose-500/5',
    text: 'text-rose-600 dark:text-rose-400',
    iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    border: 'border-rose-500/20',
  },
  purple: {
    bg: 'bg-purple-500/5',
    text: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    border: 'border-purple-500/20',
  },
};

export default function MentorSubmissionStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  colorVariant,
}: MentorSubmissionStatCardProps) {
  const styling = colorClasses[colorVariant] || colorClasses.blue;

  return (
    <Card
      className={cn(
        'relative overflow-hidden border transition-all duration-200 hover:shadow-md',
        styling.border,
        styling.bg
      )}
    >
      <CardContent className="p-4 sm:p-5 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className={cn('text-2xl sm:text-3xl font-extrabold tracking-tight', styling.text)}>
              {value}
            </span>
          </div>
          {subtitle && (
            <p className="text-[11px] text-muted-foreground/80">{subtitle}</p>
          )}
        </div>

        <div className={cn('size-11 sm:size-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs', styling.iconBg)}>
          <Icon className="size-5 sm:size-6" />
        </div>
      </CardContent>
    </Card>
  );
}
