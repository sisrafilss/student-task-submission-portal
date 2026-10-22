'use client';

import FormAlert from '@/components/shared/FormAlert';
import InputFieldError from '@/components/shared/InputFieldError';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { registerStudent } from '@/services/auth/registerStudent';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerStudent, null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Trigger toast notification on form error
  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div className="w-full space-y-5">
      {/* Reusable Global Form Error Alert */}
      <FormAlert message={state && !state.success ? state.message : null} />

      {/* Form bound natively to React 19 useActionState formAction */}
      <form action={formAction} noValidate className="space-y-4">
        <FieldGroup className="gap-3.5">
          {/* Full Name Field */}
          <Field>
            <FieldLabel htmlFor="name" className="text-xs font-semibold text-foreground">
              Full Name
            </FieldLabel>
            <div className="relative">
              <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Jane Doe"
                disabled={isPending}
                className="h-10.5 pl-9 pr-3 text-sm rounded-lg border-border bg-card/60 focus-visible:ring-primary/40"
              />
            </div>
            <InputFieldError field="name" state={state} />
          </Field>

          {/* Student Email Field */}
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
            <FieldLabel htmlFor="password" className="text-xs font-semibold text-foreground">
              Password
            </FieldLabel>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
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

          {/* Confirm Password Field */}
          <Field>
            <FieldLabel htmlFor="confirmPassword" className="text-xs font-semibold text-foreground">
              Confirm Password
            </FieldLabel>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••"
                disabled={isPending}
                className="h-10.5 pl-9 pr-10 text-sm rounded-lg border-border bg-card/60 focus-visible:ring-primary/40"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isPending}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </Button>
            </div>
            <InputFieldError field="confirmPassword" state={state} />
          </Field>

          {/* Submit Action using Field */}
          <Field className="pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="h-11 w-full rounded-lg bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
            >
              {isPending ? (
                <span className="inline-flex items-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  <span>Creating Account...</span>
                </span>
              ) : (
                <span>Create Student Account</span>
              )}
            </Button>

            <FieldDescription className="text-center pt-2 text-xs">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline hover:text-primary/90 transition-colors"
              >
                Sign in
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
