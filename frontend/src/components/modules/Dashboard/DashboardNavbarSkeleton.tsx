export default function DashboardNavbarSkeleton() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md animate-pulse">
      <div className="flex h-16 items-center justify-between gap-3 px-4 md:px-6">
        {/* Mobile Hamburger Skeleton */}
        <div className="size-9 rounded-lg bg-muted md:hidden" />

        {/* Search Bar Skeleton */}
        <div className="h-9 w-64 md:w-80 rounded-lg bg-muted/60" />

        {/* Right Controls Skeleton */}
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-lg bg-muted/60" />
          <div className="size-9 rounded-lg bg-muted/60" />
          <div className="size-9 rounded-full bg-muted" />
        </div>
      </div>
    </header>
  );
}

