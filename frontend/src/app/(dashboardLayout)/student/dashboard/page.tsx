import { Suspense } from 'react';
import DashboardStatsSkeleton from '@/components/modules/Dashboard/DashboardStatsSkeleton';
import StudentDashboardContainer from '@/components/modules/Student/StudentDashboardContainer';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function StudentDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome to your student submission portal dashboard.
          </p>
        </div>
        <Badge variant="outline" className="w-fit border-primary/30 text-primary">
          🎓 Student Role
        </Badge>
      </div>

      <Separator />

      <Suspense fallback={<DashboardStatsSkeleton cardsCount={3} />}>
        <StudentDashboardContainer />
      </Suspense>
    </div>
  );
}
