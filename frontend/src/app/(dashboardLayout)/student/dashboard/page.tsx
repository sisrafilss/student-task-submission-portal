import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Active Assignments</CardTitle>
            <CardDescription>Assignments currently open for submission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">3</div>
            <p className="text-xs text-muted-foreground mt-1">Due within the next 7 days</p>
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
            <div className="text-3xl font-bold text-emerald-600">8</div>
            <p className="text-xs text-muted-foreground mt-1">All submissions evaluated</p>
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
            <div className="text-3xl font-bold text-primary">94.5%</div>
            <p className="text-xs text-muted-foreground mt-1">Excellent performance</p>
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
    </div>
  );
}

