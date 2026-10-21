import { Suspense, type ReactNode } from 'react';
import DashboardNavbar from '@/components/modules/Dashboard/DashboardNavbar';
import DashboardNavbarSkeleton from '@/components/modules/Dashboard/DashboardNavbarSkeleton';
import DashboardSidebar from '@/components/modules/Dashboard/DashboardSidebar';
import DashboardSidebarSkeleton from '@/components/modules/Dashboard/DashboardSidebarSkeleton';

export default function CommonDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Suspense fallback={<DashboardSidebarSkeleton />}>
        <DashboardSidebar />
      </Suspense>
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <Suspense fallback={<DashboardNavbarSkeleton />}>
          <DashboardNavbar />
        </Suspense>
        <main className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
