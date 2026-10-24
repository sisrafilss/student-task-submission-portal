'use client';

import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, isValid, parseISO } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import React, { useState } from 'react';

interface AssignmentDeadlinePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export default function AssignmentDeadlinePicker({
  value,
  onChange,
}: AssignmentDeadlinePickerProps) {
  const [open, setOpen] = useState(false);

  // Parse existing date or fallback
  const parsedDate = value ? parseISO(value) : new Date();
  const validDate = isValid(parsedDate) ? parsedDate : new Date();

  // Extract hours and minutes
  const timeString = value && value.includes('T') ? value.split('T')[1].slice(0, 5) : '23:59';

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const newDeadline = `${year}-${month}-${day}T${timeString}`;
    onChange(newDeadline);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value || '23:59';
    const datePart = value && value.includes('T') ? value.split('T')[0] : format(new Date(), 'yyyy-MM-dd');
    onChange(`${datePart}T${newTime}`);
  };

  return (
    <div className="relative w-full">
      {/* Hidden input for React 19 FormData */}
      <input type="hidden" name="deadline" value={value} />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className={cn(
            'border-input bg-card text-foreground flex h-9 w-full items-center justify-start gap-2 rounded-lg border px-2.5 text-xs font-normal shadow-xs transition-colors hover:bg-muted/30 cursor-pointer',
            !value && 'text-muted-foreground'
          )}
        >
          <div className="border-border text-primary flex h-full shrink-0 items-center justify-center border-r pr-2">
            <CalendarIcon className="size-3.5 shrink-0" />
          </div>
          <span className="truncate font-medium text-foreground">
            {isValid(validDate)
              ? `${format(validDate, 'PPP')} at ${timeString}`
              : 'Select deadline date & time'}
          </span>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0 z-50 rounded-xl shadow-lg border border-border" align="start">
          <div className="p-3">
            <Calendar
              mode="single"
              selected={validDate}
              onSelect={handleDateSelect}
              className="rounded-md"
            />

            {/* Time Selector Footer */}
            <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-3 mt-2 px-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <Clock className="size-3.5 text-primary" />
                <span>Time:</span>
              </div>
              <input
                type="time"
                value={timeString}
                onChange={handleTimeChange}
                className="h-7 w-28 rounded-md border border-input bg-background px-2 text-xs text-foreground font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
