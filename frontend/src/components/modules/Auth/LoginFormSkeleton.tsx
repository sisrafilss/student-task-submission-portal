import { FieldGroup } from '@/components/ui/field';

export default function LoginFormSkeleton() {
  return (
    <div className="w-full space-y-5 animate-pulse" aria-busy="true" aria-label="Loading login form">
      {/* 1-Click Demo Section Skeleton */}
      <div className="h-20 rounded-xl bg-muted/60" />

      {/* Form Fields Skeleton structured with FieldGroup */}
      <FieldGroup className="gap-4">
        <div className="space-y-1.5">
          <div className="h-3.5 w-28 rounded bg-muted/70" />
          <div className="h-10.5 rounded-lg bg-muted/50" />
        </div>
        <div className="space-y-1.5">
          <div className="h-3.5 w-20 rounded bg-muted/70" />
          <div className="h-10.5 rounded-lg bg-muted/50" />
        </div>
        <div className="h-11 rounded-lg bg-muted/80 mt-2" />
      </FieldGroup>
    </div>
  );
}

