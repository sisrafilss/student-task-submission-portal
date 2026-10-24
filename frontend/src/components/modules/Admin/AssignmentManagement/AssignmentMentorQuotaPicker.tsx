'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IMentorQuotaInput } from '@/types/assignment.interface';
import { Users } from 'lucide-react';
import React from 'react';

interface MentorOption {
  id: string;
  name: string;
  email: string;
  expertise?: string;
}

interface AssignmentMentorQuotaPickerProps {
  availableMentors: MentorOption[];
  mentorQuotas: IMentorQuotaInput[];
  defaultQuota: number;
  onChange: (quotas: IMentorQuotaInput[]) => void;
}

export default function AssignmentMentorQuotaPicker({
  availableMentors,
  mentorQuotas,
  defaultQuota,
  onChange,
}: AssignmentMentorQuotaPickerProps) {
  const handleToggleMentor = (mentor: MentorOption, checked: boolean) => {
    if (checked) {
      onChange([
        ...mentorQuotas,
        {
          mentorId: mentor.id,
          mentorName: mentor.name,
          maxQuota: defaultQuota || 15,
        },
      ]);
    } else {
      onChange(mentorQuotas.filter((item) => item.mentorId !== mentor.id));
    }
  };

  const handleUpdateQuota = (mentorId: string, quota: number) => {
    const updated = mentorQuotas.map((item) =>
      item.mentorId === mentorId ? { ...item, maxQuota: Math.max(1, quota) } : item
    );
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <FieldLabel className="text-sm font-semibold flex items-center gap-1.5">
          <Users className="size-4 text-primary" />
          Assign Mentors & Quotas
        </FieldLabel>
        <span className="text-xs text-muted-foreground font-medium">
          {mentorQuotas.length} selected
        </span>
      </div>

      <ScrollArea className="h-56 rounded-lg border border-border/80 bg-muted/10 p-2.5" orientation="vertical">
        <div className="space-y-2 pr-2">
          {availableMentors.length === 0 ? (
            <div className="p-3 text-center text-xs text-muted-foreground">
              No active mentors found.
            </div>
          ) : (
            availableMentors.map((mentor) => {
              const isSelected = mentorQuotas.some((item) => item.mentorId === mentor.id);
              const currentQuota =
                mentorQuotas.find((item) => item.mentorId === mentor.id)?.maxQuota || defaultQuota;

              return (
                <div
                  key={mentor.id}
                  className="flex items-center justify-between gap-3 rounded-md border border-border/50 bg-background/80 p-2.5 transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <Checkbox
                      id={`mentor-${mentor.id}`}
                      checked={isSelected}
                      onCheckedChange={(checked) => handleToggleMentor(mentor, Boolean(checked))}
                    />
                    <label
                      htmlFor={`mentor-${mentor.id}`}
                      className="cursor-pointer text-xs font-medium text-foreground truncate select-none"
                    >
                      {mentor.name}{' '}
                      <span className="text-muted-foreground font-normal">({mentor.email})</span>
                    </label>
                  </div>

                  {isSelected && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[11px] text-muted-foreground">Quota:</span>
                      <Input
                        type="number"
                        min={1}
                        max={200}
                        value={currentQuota}
                        onChange={(e) => handleUpdateQuota(mentor.id, Number(e.target.value))}
                        className="h-7 w-16 text-xs text-center"
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Hidden input to pass stringified JSON into React 19 FormData */}
      <input type="hidden" name="mentorQuotasJson" value={JSON.stringify(mentorQuotas)} />
    </div>
  );
}
