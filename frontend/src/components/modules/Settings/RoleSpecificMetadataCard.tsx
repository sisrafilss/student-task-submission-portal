'use client';

import { BookOpen, GraduationCap, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { IUserProfileSettings } from '@/types/settings.interface';
import { UserRole } from '@/lib/auth-utils';

interface RoleSpecificMetadataCardProps {
  role: UserRole;
  profile: IUserProfileSettings;
}

export default function RoleSpecificMetadataCard({
  role,
  profile,
}: RoleSpecificMetadataCardProps) {
  if (role === 'STUDENT') {
    return (
      <Card className="border-border shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              <GraduationCap className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">Academic & Enrollment Details</CardTitle>
              <CardDescription className="text-xs">
                Official student record managed by academy administration.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="space-y-1 rounded-lg border border-border/60 bg-muted/20 p-3">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Student ID
            </span>
            <p className="font-mono text-sm font-bold text-foreground">
              {profile.studentId || 'STU-ENROLLED'}
            </p>
          </div>

          <div className="space-y-1 rounded-lg border border-border/60 bg-muted/20 p-3">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Enrolled Track
            </span>
            <p className="text-sm font-semibold text-foreground">
              {profile.enrolledTrack || 'Full Stack Web Development'}
            </p>
          </div>

          <div className="space-y-1 rounded-lg border border-border/60 bg-muted/20 p-3">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Assigned Batch
            </span>
            <div className="flex items-center gap-1.5 pt-0.5">
              <BookOpen className="size-3.5 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                {profile.assignedBatch?.batchName || 'Batch 01 (Full Stack)'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (role === 'MENTOR') {
    return (
      <Card className="border-border shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <UserCheck className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">Mentorship & Expertise Info</CardTitle>
              <CardDescription className="text-xs">
                Professional accreditation and batch allocation parameters.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="space-y-1 rounded-lg border border-border/60 bg-muted/20 p-3">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Mentor ID
            </span>
            <p className="font-mono text-sm font-bold text-foreground">
              {profile.mentorId || 'MEN-CERTIFIED'}
            </p>
          </div>

          <div className="space-y-1 rounded-lg border border-border/60 bg-muted/20 p-3">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Primary Expertise
            </span>
            <div className="flex items-center gap-1.5 pt-0.5">
              <Sparkles className="size-3.5 text-amber-500" />
              <span className="text-sm font-semibold text-foreground">
                {profile.expertise || 'Next.js, TypeScript & PostgreSQL'}
              </span>
            </div>
          </div>

          <div className="space-y-1 rounded-lg border border-border/60 bg-muted/20 p-3">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Assigned Cohort
            </span>
            <p className="text-sm font-semibold text-foreground">
              {profile.assignedBatch?.batchName || 'Active All Batches'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-destructive/10 p-2 text-destructive">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">Platform Administrator Privileges</CardTitle>
            <CardDescription className="text-xs">
              System governance, user authorization & full management permissions.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        <div className="space-y-1 rounded-lg border border-border/60 bg-muted/20 p-3">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Access Scope
          </span>
          <p className="text-sm font-semibold text-foreground">Root Super Administrator</p>
        </div>

        <div className="space-y-1 rounded-lg border border-border/60 bg-muted/20 p-3">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Audit Level
          </span>
          <p className="text-sm font-semibold text-foreground">Full CRUD & Assignment Allocation</p>
        </div>

        <div className="space-y-1 rounded-lg border border-border/60 bg-muted/20 p-3">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Portal Status
          </span>
          <div className="pt-0.5">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs">
              System Online &bull; Active
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

