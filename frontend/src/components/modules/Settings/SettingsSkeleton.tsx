import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-card p-6 shadow-xs">
        <div className="flex items-center gap-4">
          <Skeleton className="size-16 rounded-full" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="h-7 w-28 rounded-md" />
      </div>

      {/* Card Content Skeleton */}
      <Card className="border-border shadow-xs">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="size-9 rounded-lg" />
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-72" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <Skeleton className="h-24 w-full rounded-md" />
        </CardContent>
        <CardFooter className="flex justify-end border-t border-border bg-muted/20 px-6 py-4">
          <Skeleton className="h-10 w-36 rounded-md" />
        </CardFooter>
      </Card>
    </div>
  );
}
