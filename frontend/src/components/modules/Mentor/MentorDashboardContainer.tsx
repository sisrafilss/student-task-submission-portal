import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getMentorDashboardStats } from '@/services/dashboard/dashboardManagement';

export default async function MentorDashboardContainer() {
  const stats = await getMentorDashboardStats();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Pending Submissions</CardTitle>
          <CardDescription>Submissions waiting for evaluation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-amber-500">
            {stats.pendingSubmissions.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{stats.urgentSubmissionsText}</p>
        </CardContent>
        <CardFooter>
          <Link
            href="/mentor/submissions"
            className={buttonVariants({ variant: 'outline', size: 'sm', className: 'w-full' })}
          >
            Start Evaluating
          </Link>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Evaluated This Week</CardTitle>
          <CardDescription>Submissions evaluated by you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-emerald-600">
            {stats.evaluatedThisWeek.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{stats.avgResponseTimeText}</p>
        </CardContent>
        <CardFooter>
          <Link
            href="/mentor/history"
            className={buttonVariants({ variant: 'outline', size: 'sm', className: 'w-full' })}
          >
            Evaluation History
          </Link>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Batches</CardTitle>
          <CardDescription>Assigned student batches</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">
            {stats.activeBatches.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{stats.assignedBatchesText}</p>
        </CardContent>
        <CardFooter>
          <Link
            href="/mentor/batches"
            className={buttonVariants({ variant: 'outline', size: 'sm', className: 'w-full' })}
          >
            View Batches
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

