'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ThemeToggle from '@/components/shared/ThemeToggle';
import { NavSection } from '@/types/dashboard.interface';
import { UserInfo } from '@/types/user.interface';
import { Bell, Layers, Menu, Search } from 'lucide-react';
import DashboardMobileSidebar from './DashboardMobileSidebar';
import UserDropdown from './UserDropdown';

interface DashboardNavbarContentProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashboardHome: string;
}

export default function DashboardNavbarContent({
  userInfo,
  navItems,
  dashboardHome,
}: DashboardNavbarContentProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/80">
      <div className="flex h-16 items-center justify-between gap-3 px-4 md:px-6">
        {/* Mobile Navigation Drawer Trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              aria-label="Open mobile navigation drawer"
            >
              <Menu className="size-5" aria-hidden="true" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <DashboardMobileSidebar
                userInfo={userInfo}
                navItems={navItems}
                dashboardHome={dashboardHome}
                onNavigate={() => setIsOpen(false)}
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Global Search Bar */}
        <div className="flex flex-1 items-center max-w-md">
          <div className="relative w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              placeholder="Search assignments, submissions, portal..."
              className="h-9 pl-9 pr-3 text-sm bg-muted/30 focus-visible:bg-background"
              aria-label="Search dashboard portal"
            />
          </div>
        </div>

        {/* Right Action Controls: Student Batch Badge, Notification Bell, ThemeToggle, User Profile Dropdown */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {userInfo.role === 'STUDENT' && userInfo.assignedBatchId && (
            <Badge
              variant="outline"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-primary/10 text-primary border-primary/25 rounded-md"
            >
              <Layers className="size-3.5" />
              <span>{userInfo.assignedBatchId}</span>
            </Badge>
          )}

          <Button
            variant="outline"
            size="icon"
            className="relative size-9"
            aria-label="View system notifications"
          >
            <Bell className="size-4.5 text-muted-foreground" aria-hidden="true" />
            <span className="absolute top-2 right-2 size-2 rounded-full bg-destructive ring-2 ring-background" />
          </Button>

          <ThemeToggle />

          <UserDropdown userInfo={userInfo} />
        </div>
      </div>
    </header>
  );
}
