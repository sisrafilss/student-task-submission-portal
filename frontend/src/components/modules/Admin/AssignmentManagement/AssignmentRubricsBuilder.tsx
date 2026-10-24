'use client';

import { Button } from '@/components/ui/button';
import { FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IRubricItem } from '@/types/assignment.interface';
import { Plus, Trash2 } from 'lucide-react';
import React from 'react';

interface AssignmentRubricsBuilderProps {
  rubrics: IRubricItem[];
  onChange: (rubrics: IRubricItem[]) => void;
}

export default function AssignmentRubricsBuilder({
  rubrics,
  onChange,
}: AssignmentRubricsBuilderProps) {
  const handleAddRubric = () => {
    onChange([
      ...rubrics,
      {
        id: 'rubric-' + Date.now(),
        criterion: '',
        maxMarks: 20,
      },
    ]);
  };

  const handleRemoveRubric = (index: number) => {
    const updated = rubrics.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleUpdateCriterion = (index: number, criterion: string) => {
    const updated = [...rubrics];
    updated[index] = { ...updated[index], criterion };
    onChange(updated);
  };

  const handleUpdateMarks = (index: number, marks: number) => {
    const updated = [...rubrics];
    updated[index] = { ...updated[index], maxMarks: marks };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <FieldLabel className="text-sm font-semibold">Marking Rubrics Criteria</FieldLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddRubric}
          className="h-8 gap-1.5 text-xs font-medium"
        >
          <Plus className="size-3.5" />
          Add Rubric Item
        </Button>
      </div>

      {rubrics.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/80 p-4 text-center text-xs text-muted-foreground">
          No custom rubric criteria added yet. Click &quot;Add Rubric Item&quot; to define grading breakdown.
        </div>
      ) : (
        <ScrollArea className="max-h-56 p-1 pr-2 rounded-lg" orientation="vertical">
          <div className="space-y-2.5">
            {rubrics.map((rubric, idx) => (
              <div
                key={rubric.id || idx}
                className="flex items-center gap-2 rounded-lg border border-border/70 bg-muted/20 p-2.5"
              >
                <div className="flex-1">
                  <Input
                    placeholder="Criterion (e.g. Responsive Design & Clean Layout)"
                    value={rubric.criterion}
                    onChange={(e) => handleUpdateCriterion(idx, e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="w-24">
                  <Input
                    type="number"
                    min={1}
                    placeholder="Marks"
                    value={rubric.maxMarks || ''}
                    onChange={(e) => handleUpdateMarks(idx, Number(e.target.value))}
                    className="h-9 text-xs"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveRubric(idx)}
                  className="size-8 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Hidden input to pass stringified JSON into React 19 FormData */}
      <input type="hidden" name="rubricsJson" value={JSON.stringify(rubrics)} />
    </div>
  );
}
