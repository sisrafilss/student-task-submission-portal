import { Suspense } from 'react';
import DashboardStatsSkeleton from '@/components/modules/Dashboard/DashboardStatsSkeleton';
import MentorDashboardContainer from '@/components/modules/Mentor/MentorDashboardContainer';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function MentorDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mentor Evaluation Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Review student submissions, assign scores, and provide actionable feedback.
          </p>
        </div>
        <Badge variant="outline" className="w-fit border-primary/30 text-primary">
          👨‍🏫 Mentor Role
        </Badge>
      </div>

      <Separator />

      <Suspense fallback={<DashboardStatsSkeleton cardsCount={3} />}>
        <MentorDashboardContainer />
      </Suspense>
    </div>
  );
}
