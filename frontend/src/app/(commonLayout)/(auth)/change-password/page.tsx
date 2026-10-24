import ChangePasswordForm from '@/components/modules/Auth/ChangePasswordForm';
import ChangePasswordHeader from '@/components/modules/Auth/ChangePasswordHeader';
import ChangePasswordSkeleton from '@/components/modules/Auth/ChangePasswordSkeleton';
import ThemeToggle from '@/components/shared/ThemeToggle';
import { Card, CardContent } from '@/components/ui/card';
import { Suspense } from 'react';

export default function ChangePasswordPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-background px-4 py-8 sm:px-6 lg:px-8 overflow-x-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 -z-10 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      {/* Floating Theme Toggle in Top Right */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6">
        <Card className="border-border/80 bg-card/85 shadow-2xl shadow-amber-500/5 backdrop-blur-xl rounded-2xl border">
          <div className="p-6 pb-2 sm:p-8 sm:pb-3">
            <ChangePasswordHeader />
          </div>

          <CardContent className="p-6 pt-2 sm:p-8 sm:pt-2">
            <Suspense fallback={<ChangePasswordSkeleton />}>
              <ChangePasswordForm />
            </Suspense>
          </CardContent>
        </Card>

        {/* Minimal Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Nextra Student Portal &bull; Mandatory Security Compliance
        </p>
      </div>
    </div>
  );
}

