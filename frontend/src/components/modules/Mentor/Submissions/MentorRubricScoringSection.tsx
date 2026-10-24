'use client';

import { Input } from '@/components/ui/input';
import { IRubricItem, IRubricScoreItem } from '@/types/submission.interface';
import { Award, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MentorRubricScoringSectionProps {
  rubrics?: IRubricItem[];
  initialScores?: IRubricScoreItem[];
  onScoreChange: (total: number, items: IRubricScoreItem[]) => void;
}

export default function MentorRubricScoringSection({
  rubrics = [],
  initialScores,
  onScoreChange,
}: MentorRubricScoringSectionProps) {
  const [scores, setScores] = useState<IRubricScoreItem[]>(() => {
    if (initialScores && initialScores.length > 0) {
      return initialScores;
    }
    if (rubrics && rubrics.length > 0) {
      return rubrics.map((r) => ({
        criteria: r.criteria,
        marksAwarded: r.marks,
        maxMarks: r.marks,
      }));
    }
    return [
      { criteria: 'Code Quality & Clean Architecture', marksAwarded: 25, maxMarks: 25 },
      { criteria: 'UI / UX & Responsiveness', marksAwarded: 25, maxMarks: 25 },
      { criteria: 'Functional Requirements', marksAwarded: 30, maxMarks: 30 },
      { criteria: 'Deployment & Git Commits', marksAwarded: 20, maxMarks: 20 },
    ];
  });

  const totalAwarded = scores.reduce((sum, item) => sum + (item.marksAwarded || 0), 0);
  const maxPossible = scores.reduce((sum, item) => sum + (item.maxMarks || 0), 0);

  useEffect(() => {
    onScoreChange(totalAwarded, scores);
  }, [totalAwarded, scores, onScoreChange]);

  const handleScoreChange = (index: number, valueStr: string) => {
    const val = valueStr === '' ? 0 : Math.max(0, parseInt(valueStr, 10) || 0);
    const updated = [...scores];
    const max = updated[index].maxMarks;
    updated[index] = {
      ...updated[index],
      marksAwarded: Math.min(val, max),
    };
    setScores(updated);
  };

  return (
    <div className="space-y-3 rounded-lg border border-border/70 bg-muted/20 p-3.5">
      <div className="flex items-center justify-between border-b border-border/40 pb-2">
        <div className="flex items-center gap-1.5">
          <Award className="size-4 text-amber-500" />
          <span className="text-xs font-semibold text-foreground">
            Rubric-Based Evaluation Breakdown
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
          <CheckCircle className="size-3.5 text-emerald-500" />
          <span>
            Total: {totalAwarded} / {maxPossible} Marks
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {scores.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-3 text-xs bg-background/80 p-2 rounded-md border border-border/40"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate" title={item.criteria}>
                {item.criteria}
              </p>
              <p className="text-[10px] text-muted-foreground">
                Max points: {item.maxMarks}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Input
                type="number"
                min={0}
                max={item.maxMarks}
                value={item.marksAwarded}
                onChange={(e) => handleScoreChange(index, e.target.value)}
                className="w-16 h-7 text-xs text-right font-semibold"
                aria-label={`Marks for ${item.criteria}`}
              />
              <span className="text-muted-foreground text-[11px] font-medium">
                / {item.maxMarks}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
