'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { IAssignmentStats } from '@/services/assignments/assignmentManagement';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';

interface AssignmentPortalHeaderProps {
  stats: IAssignmentStats;
  batchId?: string;
}

export default function AssignmentPortalHeader({ stats, batchId }: AssignmentPortalHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Title & Badge */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Course Assignments Hub
            </h1>
            {batchId ? (
              <Badge variant="secondary" className="border border-primary/25 bg-primary/10 text-primary text-xs font-semibold">
                <Layers className="size-3 mr-1" />
                Enrolled: {batchId}
              </Badge>
            ) : (
              <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 text-xs">
                <Sparkles className="size-3 mr-1" />
                Academic Portal
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Explore your active projects, inspect guidelines & rubrics, and submit on time.
          </p>
        </div>
      </div>

      {/* Metrics Cards Grid using shadcn Card */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
        <Card className="border-border/60 bg-card/60 backdrop-blur-sm shadow-xs transition-all hover:shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <BookOpen className="size-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                Total Assigned
              </p>
              <p className="text-xl font-bold tracking-tight text-foreground">
                {stats.totalCount}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-500/20 bg-amber-500/5 backdrop-blur-sm shadow-xs transition-all hover:shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
              <Clock className="size-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-amber-700/80 dark:text-amber-400 uppercase tracking-wider">
                Action Required
              </p>
              <p className="text-xl font-bold tracking-tight text-amber-700 dark:text-amber-300">
                {stats.actionRequiredCount}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20 bg-blue-500/5 backdrop-blur-sm shadow-xs transition-all hover:shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
              <AlertCircle className="size-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-blue-700/80 dark:text-blue-400 uppercase tracking-wider">
                Under Review
              </p>
              <p className="text-xl font-bold tracking-tight text-blue-700 dark:text-blue-300">
                {stats.underReviewCount}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm shadow-xs transition-all hover:shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-emerald-700/80 dark:text-emerald-400 uppercase tracking-wider">
                Evaluated
              </p>
              <p className="text-xl font-bold tracking-tight text-emerald-700 dark:text-emerald-300">
                {stats.evaluatedCount}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

