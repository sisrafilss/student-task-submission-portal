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
import { getAdminDashboardStats } from '@/services/dashboard/dashboardManagement';

export default async function AdminDashboardContainer() {
  const stats = await getAdminDashboardStats();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Students</CardTitle>
          <CardDescription>Enrolled students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">
            {stats.totalStudents.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{stats.studentGrowthText}</p>
        </CardContent>
        <CardFooter>
          <Link
            href="/admin/students"
            className={buttonVariants({ variant: 'outline', size: 'sm', className: 'w-full' })}
          >
            Manage Students
          </Link>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Mentors</CardTitle>
          <CardDescription>Teaching & evaluation staff</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-emerald-600">
            {stats.activeMentors.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{stats.activeTracksText}</p>
        </CardContent>
        <CardFooter>
          <Link
            href="/admin/mentors"
            className={buttonVariants({ variant: 'outline', size: 'sm', className: 'w-full' })}
          >
            Manage Mentors
          </Link>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assignments</CardTitle>
          <CardDescription>Active assignment tracks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">
            {stats.totalAssignments.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{stats.pendingReleasesText}</p>
        </CardContent>
        <CardFooter>
          <Link
            href="/admin/assignments"
            className={buttonVariants({ variant: 'outline', size: 'sm', className: 'w-full' })}
          >
            Assignments
          </Link>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Submissions</CardTitle>
          <CardDescription>Lifetime submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">
            {stats.totalSubmissions.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{stats.onTimeRateText}</p>
        </CardContent>
        <CardFooter>
          <Link
            href="/admin/reports"
            className={buttonVariants({ variant: 'outline', size: 'sm', className: 'w-full' })}
          >
            View Analytics
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

