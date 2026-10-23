'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/lib/auth-utils';
import { ShieldCheck, UserCheck, Sparkles } from 'lucide-react';

interface SettingsHeaderProps {
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export default function SettingsHeader({
  name,
  email,
  role,
  avatarUrl,
}: SettingsHeaderProps) {
  const getRoleBadgeVariant = (userRole: UserRole) => {
    switch (userRole) {
      case 'ADMIN':
        return {
          label: 'System Administrator',
          color: 'bg-destructive/10 text-destructive border-destructive/20',
          icon: ShieldCheck,
        };
      case 'MENTOR':
        return {
          label: 'Certified Mentor',
          color: 'bg-primary/10 text-primary border-primary/20',
          icon: UserCheck,
        };
      case 'STUDENT':
      default:
        return {
          label: 'Enrolled Student',
          color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          icon: Sparkles,
        };
    }
  };

  const badgeInfo = getRoleBadgeVariant(role);
  const RoleIcon = badgeInfo.icon;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-card p-4 sm:p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Avatar className="size-14 sm:size-16 border-2 border-primary/20 shadow-xs">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt={name} /> : null}
          <AvatarFallback className="bg-primary/10 font-bold text-lg text-primary">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {name}
            </h1>
            <Badge
              variant="outline"
              className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${badgeInfo.color}`}
            >
              <RoleIcon className="size-3" />
              <span>{badgeInfo.label}</span>
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">{email}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-center">
        <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          Portal v1.2 &bull; Active
        </span>
      </div>
    </div>
  );
}

