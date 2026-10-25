'use client';

import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IAssignment } from '@/types/submission.interface';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ExternalLink,
  FileCode,
  Layers,
  Send,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

interface AssignmentDetailDialogProps {
  assignment: IAssignment | null;
  open: boolean;
  onClose: () => void;
  onSubmit?: (assignment: IAssignment) => void;
}

export default function AssignmentDetailDialog({
  assignment,
  open,
  onClose,
  onSubmit,
}: AssignmentDetailDialogProps) {
  if (!assignment) return null;

  const isAlreadySubmitted =
    assignment.studentSubmissionStatus &&
    assignment.studentSubmissionStatus !== 'NOT_SUBMITTED';

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-3xl lg:max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        {/* Modal Header */}
        <DialogHeader className="p-6 pb-4 border-b border-border/50 bg-muted/10">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="outline" className="border-primary/40 text-primary bg-primary/5 text-xs">
              <Layers className="size-3 mr-1" />
              {assignment.courseTrack}
            </Badge>
            <Badge variant="outline" className="border-border text-muted-foreground text-xs">
              {assignment.batchName}
            </Badge>
            <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 text-xs">
              <Award className="size-3 mr-1" />
              Max: {assignment.maxScore} Marks
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <BookOpen className="size-5 text-primary shrink-0" />
            <span>{assignment.title}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="size-3 text-muted-foreground" />
              Deadline: {new Date(assignment.deadline).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Modal Body with shadcn Tabs & ScrollArea */}
        <div className="flex-1 overflow-hidden p-6 pt-2">
          <Tabs defaultValue="requirements" className="w-full flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="requirements" className="text-xs">
                Requirements
              </TabsTrigger>
              <TabsTrigger value="rubrics" className="text-xs">
                Marking Rubrics
              </TabsTrigger>
              <TabsTrigger value="resources" className="text-xs">
                Resources
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[320px] pr-3">
              {/* Requirements Tab Content */}
              <TabsContent value="requirements" className="space-y-4 mt-0">
                {assignment.description && (
                  <div className="rounded-lg bg-muted/30 p-3.5 border border-border/60">
                    <p className="text-xs leading-relaxed text-foreground/90">
                      {assignment.description}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Project Deliverables & Features Checklist
                  </h4>
                  <div className="space-y-2">
                    {assignment.requirements && assignment.requirements.length > 0 ? (
                      assignment.requirements.map((req, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 rounded-md border border-border/40 p-2.5 bg-card/40 text-xs"
                        >
                          <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
                          <span className="text-foreground/90 leading-relaxed">{req}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground italic">
                        Detailed requirements will be updated shortly by mentors.
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Rubrics Tab Content */}
              <TabsContent value="rubrics" className="space-y-3 mt-0">
                <div className="flex items-center justify-between pb-1">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Evaluation Criteria & Mark Distribution
                  </h4>
                  <span className="text-xs font-bold text-primary">
                    Total: {assignment.maxScore} Marks
                  </span>
                </div>

                <div className="space-y-2.5">
                  {assignment.rubrics && assignment.rubrics.length > 0 ? (
                    assignment.rubrics.map((rubric, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-border/60 p-3 bg-card/60 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-foreground">
                            {rubric.criteria}
                          </span>
                          <Badge variant="secondary" className="text-[11px] font-mono">
                            {rubric.marks} Marks
                          </Badge>
                        </div>
                        {rubric.description && (
                          <p className="text-[11px] text-muted-foreground leading-relaxed">
                            {rubric.description}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      Standard evaluation guidelines apply.
                    </p>
                  )}
                </div>
              </TabsContent>

              {/* Resources Tab Content */}
              <TabsContent value="resources" className="space-y-3 mt-0">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Reference Materials & Starter Kits
                </h4>

                <div className="grid gap-2.5">
                  {assignment.resources && assignment.resources.length > 0 ? (
                    assignment.resources.map((res, idx) => (
                      <a
                        key={idx}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between rounded-lg border border-border/60 p-3 bg-card/60 transition-colors hover:bg-muted/40 hover:border-primary/40 group"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileCode className="size-4 text-primary group-hover:scale-110 transition-transform" />
                          <div>
                            <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                              {res.title}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-mono truncate max-w-sm">
                              {res.url}
                            </p>
                          </div>
                        </div>
                        <ExternalLink className="size-3.5 text-muted-foreground group-hover:text-primary" />
                      </a>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      No additional resources attached for this assignment.
                    </p>
                  )}
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>

        {/* Modal Footer with Actions */}
        <DialogFooter className="m-0 border-t border-border/60 bg-muted/20 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="size-3 text-primary shrink-0" />
            <span>Ensure all functional requirements are satisfied before final submission.</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-9 px-4 text-xs font-medium"
            >
              Close
            </Button>
            {isAlreadySubmitted ? (
              <Link
                href="/student/submissions"
                className={buttonVariants({ variant: 'default', size: 'sm', className: 'h-9 px-4 text-xs font-medium' })}
              >
                View Submission Status
              </Link>
            ) : (
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => {
                  onSubmit?.(assignment);
                }}
                className="h-9 px-4 text-xs font-medium gap-1.5"
              >
                <Send className="size-3.5" />
                Submit Assignment
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

