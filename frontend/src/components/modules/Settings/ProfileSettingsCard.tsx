'use client';

import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, Save, User } from 'lucide-react';
import InputFieldError from '@/components/shared/InputFieldError';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { updateProfileSettings } from '@/services/settings/updateProfileSettings';
import { IUserProfileSettings } from '@/types/settings.interface';
import ProfileAvatarUploader from './ProfileAvatarUploader';

interface ProfileSettingsCardProps {
  initialProfile: IUserProfileSettings;
  onAvatarUpdated?: (url: string) => void;
}

export default function ProfileSettingsCard({
  initialProfile,
  onAvatarUpdated,
}: ProfileSettingsCardProps) {
  const [state, formAction, isPending] = useActionState(updateProfileSettings, null);
  const [currentAvatar, setCurrentAvatar] = useState(initialProfile.avatarUrl || '');

  useEffect(() => {
    if (state?.success && state.message) {
      toast.success(state.message);
    } else if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  const handleAvatarChange = (newUrl: string) => {
    setCurrentAvatar(newUrl);
    onAvatarUpdated?.(newUrl);
  };

  return (
    <Card className="border-border shadow-xs">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <User className="size-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold">Personal Profile & Contact</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Manage your display identity, avatar, contact number, and public links.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <form action={formAction} noValidate>
        <CardContent className="space-y-6">
          {/* Cloudinary Profile Photo Uploader */}
          <ProfileAvatarUploader
            currentAvatarUrl={currentAvatar}
            fallbackName={initialProfile.name}
            onAvatarChange={handleAvatarChange}
          />

          <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="name" className="text-xs font-semibold">
                Full Legal Name *
              </FieldLabel>
              <Input
                id="name"
                name="name"
                defaultValue={initialProfile.name}
                placeholder="e.g. John Doe"
                disabled={isPending}
              />
              <InputFieldError field="name" state={state} />
            </Field>

            <Field>
              <FieldLabel htmlFor="email" className="text-xs font-semibold">
                Institutional Email (Read-Only)
              </FieldLabel>
              <Input
                id="email"
                name="email"
                defaultValue={initialProfile.email}
                disabled
                className="bg-muted cursor-not-allowed opacity-80"
              />
              <FieldDescription className="text-[11px]">
                Account identifier managed by portal administration.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="contactNumber" className="text-xs font-semibold">
                Contact Phone Number
              </FieldLabel>
              <Input
                id="contactNumber"
                name="contactNumber"
                defaultValue={initialProfile.contactNumber}
                placeholder="+8801700000000"
                disabled={isPending}
              />
              <InputFieldError field="contactNumber" state={state} />
            </Field>

            <Field>
              <FieldLabel htmlFor="portfolioUrl" className="text-xs font-semibold">
                Portfolio / Website URL
              </FieldLabel>
              <Input
                id="portfolioUrl"
                name="portfolioUrl"
                defaultValue={initialProfile.portfolioUrl || ''}
                placeholder="https://myportfolio.dev"
                disabled={isPending}
              />
              <InputFieldError field="portfolioUrl" state={state} />
            </Field>
          </FieldGroup>

          <Field>
            <FieldLabel htmlFor="bio" className="text-xs font-semibold">
              Professional Bio / Summary
            </FieldLabel>
            <Textarea
              id="bio"
              name="bio"
              rows={3}
              defaultValue={initialProfile.bio || ''}
              placeholder="Brief summary of your learning journey or technical background..."
              disabled={isPending}
            />
            <InputFieldError field="bio" state={state} />
          </Field>

          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Social Links
            </h4>
            <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="githubUsername" className="text-xs font-semibold">
                  GitHub Username
                </FieldLabel>
                <Input
                  id="githubUsername"
                  name="githubUsername"
                  defaultValue={initialProfile.githubUsername || ''}
                  placeholder="e.g. octocat"
                  disabled={isPending}
                />
                <InputFieldError field="githubUsername" state={state} />
              </Field>

              <Field>
                <FieldLabel htmlFor="linkedinUrl" className="text-xs font-semibold">
                  LinkedIn URL
                </FieldLabel>
                <Input
                  id="linkedinUrl"
                  name="linkedinUrl"
                  defaultValue={initialProfile.linkedinUrl || ''}
                  placeholder="https://linkedin.com/in/username"
                  disabled={isPending}
                />
                <InputFieldError field="linkedinUrl" state={state} />
              </Field>
            </FieldGroup>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end border-t border-border bg-muted/20 px-6 py-4">
          <Button type="submit" disabled={isPending} className="gap-2 cursor-pointer">
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save className="size-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
