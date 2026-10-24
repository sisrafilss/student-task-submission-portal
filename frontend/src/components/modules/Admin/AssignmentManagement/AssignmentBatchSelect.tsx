'use client';

import { cn } from '@/lib/utils';
import { Check, ChevronDown, Layers } from 'lucide-react';
import React, { useEffect, useId, useRef, useState } from 'react';

export interface BatchOption {
  label: string;
  value: string;
}

interface AssignmentBatchSelectProps {
  value: string;
  onChange: (value: string) => void;
  options?: BatchOption[];
}

const DEFAULT_BATCH_OPTIONS: BatchOption[] = [
  { label: 'Batch 01 (Full Stack Web)', value: 'BATCH-01' },
  { label: 'Batch 02 (Next.js & Cloud)', value: 'BATCH-02' },
  { label: 'Batch 03 (React Architecture)', value: 'BATCH-03' },
];

export default function AssignmentBatchSelect({
  value,
  onChange,
  options = DEFAULT_BATCH_OPTIONS,
}: AssignmentBatchSelectProps) {
  const generatedId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  // Auto-sync initial value if value is empty and options are available
  useEffect(() => {
    if (!value && options.length > 0) {
      onChange(options[0].value);
    }
  }, [value, options, onChange]);

  // Click outside listener
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option: BatchOption) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Hidden input for React 19 FormData */}
      <input type="hidden" name="batchId" value={value} />

      {/* SelectFilter style Combobox Trigger */}
      <div
        role="button"
        tabIndex={0}
        id={generatedId}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
        className={cn(
          'border-input bg-card text-foreground flex h-9 w-full items-center overflow-hidden rounded-lg border transition-colors shadow-xs cursor-pointer',
          'focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 outline-none',
          'hover:bg-muted/30 select-none'
        )}
      >
        {/* Left Icon with subtle vertical divider (SelectFilter Pattern) */}
        <div className="border-border text-primary flex h-full shrink-0 items-center justify-center border-r px-2.5 bg-muted/20">
          <Layers className="size-3.5 shrink-0" />
        </div>

        {/* Selected Label */}
        <div className="flex-1 px-2.5 py-1 text-xs text-foreground font-medium truncate">
          {selectedOption?.label || 'Select Batch'}
        </div>

        {/* Right Chevron Down Button */}
        <div className="text-muted-foreground flex h-full shrink-0 items-center justify-center px-2">
          <ChevronDown
            className={cn(
              'size-3.5 shrink-0 transition-transform duration-200',
              isOpen && 'rotate-180 text-primary'
            )}
          />
        </div>
      </div>

      {/* Dropdown Popup */}
      {isOpen && (
        <div className="bg-popover text-popover-foreground border-border absolute left-0 top-full z-50 mt-1.5 w-full rounded-lg border p-1 shadow-lg ring-1 ring-black/5 animate-in fade-in-0 zoom-in-95">
          <div className="space-y-0.5 py-0.5 max-h-56 overflow-y-auto">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-center text-xs text-muted-foreground">
                No active batches found
              </div>
            ) : (
              options.map((opt) => {
                const isSelected = opt.value === value;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt)}
                    className={cn(
                      'flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-xs transition-colors cursor-pointer',
                      isSelected
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-foreground hover:bg-muted/70 font-normal'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="size-3.5 text-muted-foreground" />
                      <span>{opt.label}</span>
                    </div>
                    {isSelected && (
                      <Check className="text-primary size-3.5 shrink-0 stroke-[2.5]" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

