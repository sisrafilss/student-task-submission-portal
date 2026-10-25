'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface QuickDemoLoginProps {
  onSelectDemo: (email: string, pass: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function QuickDemoLogin({
  onSelectDemo,
  disabled = false,
  className = '',
}: QuickDemoLoginProps) {
  return (
    <div className={`rounded-xl border border-primary/20 bg-primary/5 p-3.5 backdrop-blur-sm sm:p-4 ${className}`}>
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
          <Sparkles className="size-3.5" />
          <span>1-Click Quick Demo Login</span>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] uppercase tracking-wider font-semibold border-primary/30 text-primary"
        >
          Instant Access
        </Badge>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => onSelectDemo('student@gmail.com', '123456')}
          className="h-8 justify-start px-2 sm:px-2.5 border-border bg-card/80 text-[11.5px] sm:text-xs font-medium hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer whitespace-nowrap"
        >
          🎓 <span className="ml-1">Student Demo</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => onSelectDemo('mentor@gmail.com', '123456')}
          className="h-8 justify-start px-2 sm:px-2.5 border-border bg-card/80 text-[11.5px] sm:text-xs font-medium hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer whitespace-nowrap"
        >
          👨‍🏫 <span className="ml-1">Mentor Demo</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => onSelectDemo('admin@gmail.com', '123456')}
          className="h-8 justify-start px-2 sm:px-2.5 border-border bg-card/80 text-[11.5px] sm:text-xs font-medium hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer whitespace-nowrap"
        >
          🛡️ <span className="ml-1">Admin Demo</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => onSelectDemo('newmentor@gmail.com', '123456')}
          className="h-8 justify-start px-2.5 border-amber-500/30 bg-amber-500/10 text-xs font-medium text-amber-600 dark:text-amber-400 hover:border-amber-500/50 hover:bg-amber-500/20 transition-all cursor-pointer col-span-full sm:col-span-3 whitespace-nowrap"
        >
          ⏳ <span className="ml-1">First-Time Mentor (Needs Password Change)</span>
        </Button>
      </div>
    </div>
  );
}
