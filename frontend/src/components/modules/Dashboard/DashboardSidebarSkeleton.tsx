export default function DashboardSidebarSkeleton() {
  return (
    <aside
      aria-label="Loading sidebar navigation"
      className="hidden md:flex h-full w-64 shrink-0 flex-col border-r border-border bg-card animate-pulse"
    >
      {/* Brand Header Skeleton */}
      <div className="flex h-16 shrink-0 items-center border-b border-border px-5 gap-3">
        <div className="size-8 rounded-xl bg-muted" />
        <div className="h-5 w-32 rounded bg-muted" />
      </div>

      {/* Nav Items Skeleton */}
      <div className="flex-1 px-3 py-6 space-y-6">
        <div>
          <div className="h-3 w-20 rounded bg-muted mb-3 mx-3" />
          <div className="space-y-2">
            <div className="h-9 rounded-lg bg-muted/60" />
            <div className="h-9 rounded-lg bg-muted/40" />
            <div className="h-9 rounded-lg bg-muted/40" />
          </div>
        </div>

        <div>
          <div className="h-3 w-24 rounded bg-muted mb-3 mx-3" />
          <div className="space-y-2">
            <div className="h-9 rounded-lg bg-muted/40" />
            <div className="h-9 rounded-lg bg-muted/40" />
          </div>
        </div>
      </div>

      {/* User Footer Skeleton */}
      <div className="shrink-0 border-t border-border p-3.5 bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-muted" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3.5 w-24 rounded bg-muted" />
            <div className="h-3 w-16 rounded bg-muted/70" />
          </div>
        </div>
      </div>
    </aside>
  );
}

