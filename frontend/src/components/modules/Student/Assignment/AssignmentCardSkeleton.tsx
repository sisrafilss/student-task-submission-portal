import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface AssignmentCardSkeletonProps {
  count?: number;
}

export default function AssignmentCardSkeleton({ count = 4 }: AssignmentCardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="flex flex-col h-full border border-border/60 bg-card/50 shadow-xs">
          <CardHeader className="p-5 pb-3 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-6 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
          </CardHeader>
          <CardContent className="p-5 pt-0 flex-1 space-y-3">
            <Skeleton className="h-px w-full" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
            </div>
          </CardContent>
          <CardFooter className="p-4 px-5 bg-muted/10 flex items-center gap-2">
            <Skeleton className="h-9 flex-1 rounded-md" />
            <Skeleton className="h-9 flex-1 rounded-md" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

