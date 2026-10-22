import { FieldGroup } from '@/components/ui/field';

export default function RegisterFormSkeleton() {
  return (
    <div className="w-full space-y-4 animate-pulse" aria-busy="true" aria-label="Loading registration form">
      {/* Form Fields Skeleton structured with FieldGroup */}
      <FieldGroup className="gap-3.5">
        {/* Name Skeleton */}
        <div className="space-y-1.5">
          <div className="h-3.5 w-24 rounded bg-muted/70" />
          <div className="h-10.5 rounded-lg bg-muted/50" />
        </div>

        {/* Email Skeleton */}
        <div className="space-y-1.5">
          <div className="h-3.5 w-36 rounded bg-muted/70" />
          <div className="h-10.5 rounded-lg bg-muted/50" />
        </div>

        {/* Password Skeleton */}
        <div className="space-y-1.5">
          <div className="h-3.5 w-20 rounded bg-muted/70" />
          <div className="h-10.5 rounded-lg bg-muted/50" />
        </div>

        {/* Confirm Password Skeleton */}
        <div className="space-y-1.5">
          <div className="h-3.5 w-32 rounded bg-muted/70" />
          <div className="h-10.5 rounded-lg bg-muted/50" />
        </div>

        {/* Submit Button Skeleton */}
        <div className="h-11 rounded-lg bg-muted/80 mt-2" />

        {/* Footer Link Skeleton */}
        <div className="mx-auto h-3.5 w-48 rounded bg-muted/50 mt-1" />
      </FieldGroup>
    </div>
  );
}
