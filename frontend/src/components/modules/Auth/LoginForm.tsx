'use client';

import FormAlert from '@/components/shared/FormAlert';
import InputFieldError from '@/components/shared/InputFieldError';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { loginUser } from '@/services/auth/loginUser';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { startTransition, useActionState, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import QuickDemoLogin from './QuickDemoLogin';

interface LoginFormProps {
  redirect?: string;
}

export default function LoginForm({ redirect: redirectProp }: LoginFormProps) {
  const searchParams = useSearchParams();
  const redirectFromUrl = searchParams.get('redirect') || undefined;
  const redirectTarget = redirectProp || redirectFromUrl;

  const [state, formAction, isPending] = useActionState(loginUser, null);
  const [showPassword, setShowPassword] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Trigger error toast on submission error
  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  // One-click demo login: fills inputs AND immediately submits the form to log in
  const handleQuickDemoLogin = (email: string, pass: string) => {
    if (formRef.current) {
      const emailInput = formRef.current.elements.namedItem('email') as HTMLInputElement | null;
      const passInput = formRef.current.elements.namedItem('password') as HTMLInputElement | null;
      if (emailInput) emailInput.value = email;
      if (passInput) passInput.value = pass;
    }

    startTransition(() => {
      const formData = new FormData();
      formData.set('email', email);
      formData.set('password', pass);
      if (redirectTarget) {
        formData.set('redirect', redirectTarget);
      }
      formAction(formData);
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Reusable Quick 1-Click Demo Login Section */}
      <QuickDemoLogin onSelectDemo={handleQuickDemoLogin} disabled={isPending} />

      {/* Reusable Global Form Error Alert */}
      <FormAlert message={state && !state.success ? state.message : null} />

      
      <form ref={formRef} action={formAction} noValidate className="space-y-4.5">
        {redirectTarget && <input type="hidden" name="redirect" value={redirectTarget} />}

        <FieldGroup className="gap-4">
          {/* Email Field */}
          <Field>
            <FieldLabel htmlFor="email" className="text-xs font-semibold text-foreground">
              Student / Institutional Email
            </FieldLabel>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="e.g. student@portal.test"
                disabled={isPending}
                className="h-10.5 pl-9 pr-3 text-sm rounded-lg border-border bg-card/60 focus-visible:ring-primary/40"
              />
            </div>
            <InputFieldError field="email" state={state} />
          </Field>

          {/* Password Field */}
          <Field>
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password" className="text-xs font-semibold text-foreground">
                Password
              </FieldLabel>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-primary hover:text-primary/80 hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                disabled={isPending}
                className="h-10.5 pl-9 pr-10 text-sm rounded-lg border-border bg-card/60 focus-visible:ring-primary/40"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isPending}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </Button>
            </div>
            <InputFieldError field="password" state={state} />
          </Field>

          {/* Remember Me Checkbox using Field */}
          <Field orientation="horizontal" className="items-center gap-2 pt-0.5">
            <Checkbox id="remember" name="remember" />
            <FieldLabel
              htmlFor="remember"
              className="text-xs font-medium text-muted-foreground cursor-pointer select-none"
            >
              Remember me on this workstation
            </FieldLabel>
          </Field>

          {/* Submit Action using Field */}
          <Field className="pt-1">
            <Button
              type="submit"
              disabled={isPending}
              className="h-11 w-full rounded-lg bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
            >
              {isPending ? (
                <span className="inline-flex items-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  <span>Authenticating...</span>
                </span>
              ) : (
                <span>Sign in to Portal</span>
              )}
            </Button>

            <FieldDescription className="text-center pt-2 text-xs">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="font-semibold text-primary hover:underline hover:text-primary/90 transition-colors"
              >
                Register here
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
