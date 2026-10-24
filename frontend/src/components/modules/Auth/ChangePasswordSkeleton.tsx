import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ChangePasswordSkeleton() {
  return (
    <Card className="w-full border-border/80 shadow-xl backdrop-blur-md bg-card/95">
      <CardHeader className="space-y-3 items-center text-center pb-2">
        <Skeleton className="size-12 rounded-2xl" />
        <Skeleton className="h-7 w-48 rounded-md" />
        <Skeleton className="h-4 w-72 rounded-md" />
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <Skeleton className="h-11 w-full rounded-lg mt-4" />
      </CardContent>
    </Card>
  );
}

