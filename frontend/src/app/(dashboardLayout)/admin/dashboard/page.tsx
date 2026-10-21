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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
            <CardDescription>Enrolled students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">1,248</div>
            <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
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
            <div className="text-3xl font-bold text-emerald-600">42</div>
            <p className="text-xs text-muted-foreground mt-1">Across 8 active tracks</p>
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
            <div className="text-3xl font-bold text-primary">28</div>
            <p className="text-xs text-muted-foreground mt-1">4 pending releases</p>
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
            <div className="text-3xl font-bold text-primary">18,920</div>
            <p className="text-xs text-muted-foreground mt-1">98.2% on-time rate</p>
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
    </div>
  );
}

