'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IBackendAssignment } from '@/types/assignment.interface';
import { Award, BookOpen, Calendar, CheckCircle2, Layers, Users } from 'lucide-react';
import React from 'react';
import AssignmentSubmissionsList from './AssignmentSubmissionsList';

interface AssignmentViewDetailDialogProps {
  open: boolean;
  assignment: IBackendAssignment | null;
  onClose: () => void;
}

export default function AssignmentViewDetailDialog({
  open,
  assignment,
  onClose,
}: AssignmentViewDetailDialogProps) {
  if (!assignment) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-0 overflow-hidden flex flex-col sm:max-h-[85vh]">
        <DialogHeader className="px-6 sm:px-8 pt-6 pb-4 border-b border-border/60 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 text-xs">
              <Layers className="size-3 mr-1" />
              {assignment.batchId}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {assignment.status}
            </Badge>
          </div>
          <DialogTitle className="text-lg font-bold text-foreground mt-2">
            {assignment.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            Created on {new Date(assignment.createdAt).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="flex flex-col flex-1 overflow-hidden">
          <div className="px-6 sm:px-8 pt-3 pb-2 border-b border-border/50 shrink-0 bg-muted/15">
            <TabsList className="bg-muted/70 p-1">
              <TabsTrigger value="overview" className="text-xs px-3.5 py-1.5 gap-1.5">
                <BookOpen className="size-3.5" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="submissions" className="text-xs px-3.5 py-1.5 gap-1.5">
                <Users className="size-3.5" />
                Submissions & Feedback
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="flex-1 overflow-hidden m-0 p-0">
            <ScrollArea className="max-h-[calc(85vh-210px)] px-6 sm:px-8 py-5" orientation="vertical">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start pb-2">
                {/* Left Column: Metadata & Description */}
                <div className="space-y-4">
                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-3 rounded-lg border border-border/60 bg-muted/20 p-3.5 text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-primary" />
                      <div>
                        <p className="text-muted-foreground text-[11px]">Deadline</p>
                        <p className="font-semibold text-foreground">
                          {new Date(assignment.deadline).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Award className="size-4 text-amber-500" />
                      <div>
                        <p className="text-muted-foreground text-[11px]">Total Marks</p>
                        <p className="font-semibold text-foreground">{assignment.totalMarks} Points</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5 rounded-lg border border-border/60 bg-muted/10 p-3.5">
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
                      Assignment Description
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {assignment.description}
                    </p>
                  </div>
                </div>

                {/* Right Column: Rubrics & Mentors */}
                <div className="space-y-5">
                  {/* Marking Rubrics */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <BookOpen className="size-4 text-primary" />
                      <span>Marking Rubrics Criteria ({assignment.rubrics?.length || 0})</span>
                    </div>

                    {(!assignment.rubrics || assignment.rubrics.length === 0) ? (
                      <p className="text-xs text-muted-foreground italic">No custom rubrics configured.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {assignment.rubrics.map((r, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-2 rounded-md border border-border/50 bg-background/60 p-2 text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
                              <span className="text-foreground">{r.criterion}</span>
                            </div>
                            <span className="font-semibold text-primary">{r.maxMarks} pts</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <Separator className="my-2" />

                  {/* Allocated Mentors */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <Users className="size-4 text-primary" />
                      <span>Allocated Mentors ({assignment.mentors?.length || 0})</span>
                    </div>

                    {(!assignment.mentors || assignment.mentors.length === 0) ? (
                      <p className="text-xs text-muted-foreground italic">No mentors allocated yet.</p>
                    ) : (
                      <div className="space-y-1.5">
                        {assignment.mentors.map((m) => (
                          <div
                            key={m.id}
                            className="flex items-center justify-between gap-2 rounded-md border border-border/50 bg-background/60 p-2 text-xs"
                          >
                            <div>
                              <p className="font-medium text-foreground">{m.mentor?.name || 'Mentor'}</p>
                              <p className="text-[11px] text-muted-foreground">{m.mentor?.email}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="text-[10px]">
                                {m.currentAssignedCount} / {m.maxQuota} assigned
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="submissions" className="flex-1 overflow-hidden m-0 p-0">
            <div className="px-6 sm:px-8 py-5">
              <AssignmentSubmissionsList assignmentId={assignment.id} />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end px-6 sm:px-8 py-4 border-t border-border/60 shrink-0 bg-background/95">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
