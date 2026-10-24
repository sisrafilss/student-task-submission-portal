'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import PortalLogo from '@/components/shared/PortalLogo';
import { getIconComponent } from '@/lib/icon-mapper';
import { getAvatarInitials } from '@/lib/avatarHelper';
import { cn } from '@/lib/utils';
import { NavSection } from '@/types/dashboard.interface';
import { UserInfo } from '@/types/user.interface';

interface DashboardSidebarContentProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashboardHome: string;
}

export default function DashboardSidebarContent({
  userInfo,
  navItems,
  dashboardHome,
}: DashboardSidebarContentProps) {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Sidebar navigation"
      className="hidden md:flex h-full w-64 shrink-0 flex-col border-r border-border bg-card select-none"
    >
      {/* Brand & Logo Header */}
      <div className="flex h-16 shrink-0 items-center border-b border-border px-5">
        <PortalLogo href={dashboardHome} size="sm" />
      </div>

      {/* Navigation Sections */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav aria-label="Main Navigation" className="space-y-6">
          {navItems.map((section, sectionIdx) => (
            <div key={section.title || `section-${sectionIdx}`}>
              {section.title && (
                <h3 className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  {section.title}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== dashboardHome && pathname.startsWith(item.href));
                  const Icon = getIconComponent(item.icon);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-xs'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden="true" />
                      <span className="flex-1 truncate">{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant={isActive ? 'secondary' : 'default'}
                          className="ml-auto text-[11px] px-1.5 py-0"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
              {sectionIdx < navItems.length - 1 && <Separator className="my-3" />}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Authenticated User Snapshot at Footer */}
      <div className="shrink-0 border-t border-border p-3.5 bg-muted/20">
        <div className="flex items-center gap-3">
          <Avatar className="size-9 shrink-0 border border-primary/20">
            {userInfo.avatarUrl ? (
              <AvatarImage
                src={userInfo.avatarUrl}
                alt={userInfo.name}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
              {getAvatarInitials(userInfo.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold leading-tight text-foreground">
              {userInfo.name}
            </p>
            <p className="truncate text-xs text-muted-foreground capitalize">
              {userInfo.role.toLowerCase()}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

