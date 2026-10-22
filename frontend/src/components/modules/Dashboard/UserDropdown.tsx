'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { logoutUser } from '@/services/auth/logoutUser';
import { UserInfo } from '@/types/user.interface';
import { LogOut, Settings, User } from 'lucide-react';

interface UserDropdownProps {
  userInfo: UserInfo;
}

export default function UserDropdown({ userInfo }: UserDropdownProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutUser();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background p-0 text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
        aria-label="Open user profile menu"
      >
        <span className="flex size-full items-center justify-center rounded-full bg-primary/10 font-bold text-sm text-primary">
          {userInfo.name.charAt(0).toUpperCase()}
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-64 p-1.5">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-2 font-normal">
            <div className="flex flex-col space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="truncate text-sm font-semibold text-foreground">
                  {userInfo.name}
                </p>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 capitalize">
                  {userInfo.role.toLowerCase()}
                </Badge>
              </div>
              <p className="truncate text-xs text-muted-foreground">{userInfo.email}</p>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer gap-2.5 py-2"
          onClick={() => router.push('/profile')}
        >
          <User className="size-4 text-muted-foreground" aria-hidden="true" />
          <span>My Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer gap-2.5 py-2"
          onClick={() => router.push('/settings')}
        >
          <Settings className="size-4 text-muted-foreground" aria-hidden="true" />
          <span>Account Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer gap-2.5 py-2"
          onClick={handleLogout}
          disabled={isPending}
        >
          <LogOut className="size-4 shrink-0" aria-hidden="true" />
          <span>{isPending ? 'Signing out...' : 'Sign out'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
