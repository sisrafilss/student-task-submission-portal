'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/formatters';

interface UserInfoCellProps {
  name: string;
  email: string;
  photo?: string | null;
  subtitle?: string;
}

export default function UserInfoCell({ name, email, photo, subtitle }: UserInfoCellProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-9 border border-border">
        {photo && <AvatarImage src={photo} alt={name} />}
        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="font-medium text-sm text-foreground truncate">{name}</p>
        <p className="text-xs text-muted-foreground truncate">{subtitle || email}</p>
      </div>
    </div>
  );
}

