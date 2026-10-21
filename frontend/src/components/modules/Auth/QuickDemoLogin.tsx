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
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => onSelectDemo('student@portal.test', 'Password123!')}
          className="h-8 justify-start border-border bg-card/80 text-xs font-medium hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"
        >
          🎓 <span className="ml-1 truncate">Student Demo</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => onSelectDemo('mentor@portal.test', 'Password123!')}
          className="h-8 justify-start border-border bg-card/80 text-xs font-medium hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"
        >
          👨‍🏫 <span className="ml-1 truncate">Mentor Demo</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => onSelectDemo('admin@portal.test', 'Password123!')}
          className="h-8 justify-start border-border bg-card/80 text-xs font-medium hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer"
        >
          🛡️ <span className="ml-1 truncate">Admin Demo</span>
        </Button>
      </div>
    </div>
  );
}

