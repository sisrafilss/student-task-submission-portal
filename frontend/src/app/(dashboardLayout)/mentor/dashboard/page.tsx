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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Pending Submissions</CardTitle>
            <CardDescription>Submissions waiting for evaluation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-500">14</div>
            <p className="text-xs text-muted-foreground mt-1">5 urgent submissions</p>
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
            <div className="text-3xl font-bold text-emerald-600">32</div>
            <p className="text-xs text-muted-foreground mt-1">Average response time: 2.4 hours</p>
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
            <div className="text-3xl font-bold text-primary">2</div>
            <p className="text-xs text-muted-foreground mt-1">Batch 12 & Batch 13</p>
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
    </div>
  );
}

