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
import { getStudentDashboardStats } from '@/services/dashboard/dashboardManagement';

export default async function StudentDashboardContainer() {
  const stats = await getStudentDashboardStats();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Active Assignments</CardTitle>
          <CardDescription>Assignments currently open for submission</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">
            {stats.activeAssignments.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{stats.dueWithinText}</p>
        </CardContent>
        <CardFooter>
          <Link
            href="/student/assignments"
            className={buttonVariants({ variant: 'outline', size: 'sm', className: 'w-full' })}
          >
            View Assignments
          </Link>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Submissions</CardTitle>
          <CardDescription>Track grading and mentor feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-emerald-600">
            {stats.mySubmissions.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{stats.submissionStatusText}</p>
        </CardContent>
        <CardFooter>
          <Link
            href="/student/submissions"
            className={buttonVariants({ variant: 'outline', size: 'sm', className: 'w-full' })}
          >
            View History
          </Link>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Score</CardTitle>
          <CardDescription>Cumulative evaluation grade</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">{stats.averageScoreText}</div>
          <p className="text-xs text-muted-foreground mt-1">{stats.performanceRatingText}</p>
        </CardContent>
        <CardFooter>
          <Link
            href="/student/grades"
            className={buttonVariants({ variant: 'outline', size: 'sm', className: 'w-full' })}
          >
            View Grade Details
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

