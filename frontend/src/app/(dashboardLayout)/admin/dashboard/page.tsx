import { Suspense } from 'react';
import AdminDashboardContainer from '@/components/modules/Admin/AdminDashboardContainer';
import DashboardStatsSkeleton from '@/components/modules/Dashboard/DashboardStatsSkeleton';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Administration</h1>
          <p className="text-sm text-muted-foreground">
            Platform metrics, user role permissions, batches, and system health.
          </p>
        </div>
        <Badge variant="outline" className="w-fit border-primary/30 text-primary">
          🛡️ Admin Role
        </Badge>
      </div>

      <Separator />

      <Suspense fallback={<DashboardStatsSkeleton cardsCount={4} />}>
        <AdminDashboardContainer />
      </Suspense>
    </div>
  );
}
