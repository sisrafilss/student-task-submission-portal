'use client';

import Link from 'next/link';
import { Edit3, Mail, Phone, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { IUserProfileSettings } from '@/types/settings.interface';
import { UserRole } from '@/lib/auth-utils';
import { getAvatarInitials } from '@/lib/avatarHelper';

interface ProfileHeaderCardProps {
  role: UserRole;
  profile: IUserProfileSettings;
}

export default function ProfileHeaderCard({
  role,
  profile,
}: ProfileHeaderCardProps) {
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
  const initials = getAvatarInitials(profile.name);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
        <Avatar className="size-20 sm:size-24 border-2 border-primary/20 shadow-xs">
          {profile.avatarUrl ? (
            <AvatarImage
              src={profile.avatarUrl}
              alt={profile.name}
              className="object-cover"
            />
          ) : null}
          <AvatarFallback className="bg-primary/10 font-bold text-2xl text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {profile.name}
            </h1>
            <Badge
              variant="outline"
              className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${badgeInfo.color}`}
            >
              <RoleIcon className="size-3.5" />
              <span>{badgeInfo.label}</span>
            </Badge>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs sm:text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Mail className="size-3.5" />
              <span>{profile.email}</span>
            </span>

            {profile.contactNumber && (
              <span className="inline-flex items-center gap-1.5">
                <Phone className="size-3.5" />
                <span>{profile.contactNumber}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center sm:justify-end">
        <Link
          href="/settings"
          className={buttonVariants({
            variant: 'default',
            className: 'gap-2 cursor-pointer shadow-xs',
          })}
        >
          <Edit3 className="size-4" />
          <span>Edit Profile</span>
        </Link>
      </div>
    </div>
  );
}
