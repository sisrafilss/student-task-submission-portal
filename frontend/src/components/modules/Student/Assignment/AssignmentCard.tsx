'use client';

import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { IAssignment } from '@/types/submission.interface';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Layers,
  Send,
} from 'lucide-react';
import Link from 'next/link';
import AssignmentStatusBadge from './AssignmentStatusBadge';

interface AssignmentCardProps {
  assignment: IAssignment;
  onViewDetails: (assignment: IAssignment) => void;
}

export default function AssignmentCard({
  assignment,
  onViewDetails,
}: AssignmentCardProps) {
  const isSubmitted =
    assignment.studentSubmissionStatus &&
    assignment.studentSubmissionStatus !== 'NOT_SUBMITTED';

  const isEvaluated = assignment.studentSubmissionStatus === 'EVALUATED';

  return (
    <Card className="flex flex-col h-full border border-border/80 bg-card/70 backdrop-blur-sm shadow-xs transition-all duration-200 hover:shadow-md hover:border-primary/40 group overflow-hidden">
      {/* Card Header */}
      <CardHeader className="p-5 pb-3 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <Badge
            variant="outline"
            className="border-primary/30 text-primary bg-primary/5 text-[11px] font-medium"
          >
            <Layers className="size-3 mr-1" />
            {assignment.courseTrack}
          </Badge>
          <AssignmentStatusBadge
            deadline={assignment.deadline}
            submissionStatus={assignment.studentSubmissionStatus}
          />
        </div>

        <div>
          <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {assignment.title}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {assignment.description || 'Complete and submit project assignment deliverables before the deadline.'}
          </CardDescription>
        </div>
      </CardHeader>

      {/* Card Content with Metadata */}
      <CardContent className="p-5 pt-0 flex-1 space-y-3">
        <Separator className="bg-border/60" />

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="space-y-0.5">
            <span className="text-[11px] text-muted-foreground">Deadline</span>
            <p className="font-medium text-foreground flex items-center gap-1">
              <Calendar className="size-3 text-muted-foreground" />
              {new Date(assignment.deadline).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] text-muted-foreground">Max Score</span>
            <p className="font-medium text-foreground flex items-center gap-1">
              <Award className="size-3 text-amber-600 dark:text-amber-400" />
              {assignment.maxScore} Marks
            </p>
          </div>
        </div>

        {/* Display Score if already evaluated */}
        {isEvaluated && assignment.mySubmission?.score !== undefined && (
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-2.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5" />
              Your Score:
            </span>
            <span className="text-xs font-bold font-mono text-emerald-700 dark:text-emerald-300">
              {assignment.mySubmission.score} / {assignment.maxScore}
            </span>
          </div>
        )}
      </CardContent>

      <Separator className="bg-border/60" />

      {/* Card Footer with Dual Action Buttons */}
      <CardFooter className="p-4 px-5 bg-muted/15 flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(assignment)}
          className="text-xs h-9 gap-1.5 flex-1"
        >
          <BookOpen className="size-3.5" />
          View Details
        </Button>

        {isSubmitted ? (
          <Link
            href="/student/submissions"
            className={buttonVariants({
              variant: 'secondary',
              size: 'sm',
              className: 'text-xs h-9 gap-1.5 flex-1',
            })}
          >
            <ExternalLink className="size-3.5" />
            My Submission
          </Link>
        ) : (
          <Link
            href={`/student/submissions?assignmentId=${assignment.id}`}
            className={buttonVariants({
              variant: 'default',
              size: 'sm',
              className: 'text-xs h-9 gap-1.5 flex-1 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
            })}
          >
            <Send className="size-3.5" />
            Submit
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}

