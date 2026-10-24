'use client';

import FormAlert from '@/components/shared/FormAlert';
import InputFieldError from '@/components/shared/InputFieldError';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { changePassword } from '@/services/auth/changePassword';
import { Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(changePassword, null);
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div className="w-full space-y-5">
      {/* Reusable Form Alert */}
      <FormAlert message={state && !state.success ? state.message : null} />

      <form action={formAction} noValidate className="space-y-4">
        <FieldGroup className="gap-4">
          {/* Current Temporary Password */}
          <Field>
            <FieldLabel htmlFor="oldPassword" className="text-xs font-semibold text-foreground">
              Current Temporary Password
            </FieldLabel>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="oldPassword"
                name="oldPassword"
                type={showOldPass ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter the password provided by admin"
                disabled={isPending}
                className="h-10.5 pl-9 pr-10 text-sm rounded-lg border-border bg-card/60 focus-visible:ring-primary/40"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowOldPass(!showOldPass)}
                disabled={isPending}
                aria-label={showOldPass ? 'Hide password' : 'Show password'}
                className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showOldPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </Button>
            </div>
            <InputFieldError field="oldPassword" state={state} />
          </Field>

          {/* New Permanent Password */}
          <Field>
            <FieldLabel htmlFor="newPassword" className="text-xs font-semibold text-foreground">
              New Permanent Password
            </FieldLabel>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="newPassword"
                name="newPassword"
                type={showNewPass ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="At least 6 characters"
                disabled={isPending}
                className="h-10.5 pl-9 pr-10 text-sm rounded-lg border-border bg-card/60 focus-visible:ring-primary/40"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowNewPass(!showNewPass)}
                disabled={isPending}
                aria-label={showNewPass ? 'Hide password' : 'Show password'}
                className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showNewPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </Button>
            </div>
            <InputFieldError field="newPassword" state={state} />
            <FieldDescription className="text-[11px] text-muted-foreground">
              Choose a strong password distinct from your temporary credentials.
            </FieldDescription>
          </Field>

          {/* Confirm New Password */}
          <Field>
            <FieldLabel htmlFor="confirmPassword" className="text-xs font-semibold text-foreground">
              Confirm New Password
            </FieldLabel>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPass ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Re-enter your new password"
                disabled={isPending}
                className="h-10.5 pl-9 pr-10 text-sm rounded-lg border-border bg-card/60 focus-visible:ring-primary/40"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                disabled={isPending}
                aria-label={showConfirmPass ? 'Hide password' : 'Show password'}
                className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showConfirmPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </Button>
            </div>
            <InputFieldError field="confirmPassword" state={state} />
          </Field>

          {/* Submit Action */}
          <Field className="pt-2">
            <Button
              type="submit"
              disabled={isPending}
              className="h-11 w-full rounded-lg bg-primary text-primary-foreground font-semibold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
            >
              {isPending ? (
                <span className="inline-flex items-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  <span>Updating Credentials...</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="size-4" />
                  <span>Update Password & Enter Dashboard</span>
                </span>
              )}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}

