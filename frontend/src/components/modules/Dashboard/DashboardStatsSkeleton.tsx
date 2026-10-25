import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

interface DashboardStatsSkeletonProps {
  cardsCount?: number;
}

export default function DashboardStatsSkeleton({ cardsCount = 3 }: DashboardStatsSkeletonProps) {
  const cards = Array.from({ length: cardsCount }, (_, i) => i);

  return (
    <div
      className={`grid gap-4 sm:grid-cols-2 ${
        cardsCount === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
      }`}
    >
      {cards.map((idx) => (
        <Card key={idx} className="animate-pulse">
          <CardHeader className="space-y-2">
            <div className="h-5 w-28 rounded bg-muted/60" />
            <div className="h-4 w-40 rounded bg-muted/40" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="h-8 w-16 rounded bg-muted/70" />
            <div className="h-3 w-32 rounded bg-muted/40" />
          </CardContent>
          <CardFooter>
            <div className="h-8 w-full rounded bg-muted/50" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

