import LoginForm from '@/components/modules/Auth/LoginForm';
import LoginFormSkeleton from '@/components/modules/Auth/LoginFormSkeleton';
import ThemeToggle from '@/components/shared/ThemeToggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-background px-4 py-8 sm:px-6 lg:px-8 overflow-x-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

      {/* Floating Theme Toggle in Top Right */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md sm:max-w-lg space-y-6">
        {/* Clean Modern Login Card using official shadcn Card components */}
        <Card className="border-border/80 bg-card/85 shadow-2xl shadow-primary/5 backdrop-blur-xl rounded-2xl border">
          <CardHeader className="text-center space-y-1.5 pb-4">
            <CardTitle className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-muted-foreground">
              Enter your credentials or choose a 1-click demo account to access your portal.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 pt-0 sm:p-8 sm:pt-0">
            <Suspense fallback={<LoginFormSkeleton />}>
              <LoginForm />
            </Suspense>
          </CardContent>
        </Card>

        {/* Minimal Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Nextra Student Portal &bull; Programming Hero
        </p>
      </div>
    </div>
  );
}
