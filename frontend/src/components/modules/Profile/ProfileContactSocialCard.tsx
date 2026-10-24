'use client';

import { ExternalLink, Globe, Mail, Phone, Share2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { IUserProfileSettings } from '@/types/settings.interface';

interface ProfileContactSocialCardProps {
  profile: IUserProfileSettings;
}

export default function ProfileContactSocialCard({
  profile,
}: ProfileContactSocialCardProps) {
  const githubUrl = profile.githubUsername
    ? `https://github.com/${profile.githubUsername.replace('@', '')}`
    : undefined;

  return (
    <Card className="border-border shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Share2 className="size-4.5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">Contact & Online Presence</CardTitle>
            <CardDescription className="text-xs">
              Verified communication channels and public profiles.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
        {/* Email */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border/60 bg-muted/20">
          <div className="rounded-lg bg-background p-2 text-primary shadow-2xs">
            <Mail className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Email Address
            </p>
            <p className="truncate text-sm font-medium text-foreground">{profile.email}</p>
          </div>
        </div>

        {/* Contact Number */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border/60 bg-muted/20">
          <div className="rounded-lg bg-background p-2 text-primary shadow-2xs">
            <Phone className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Phone Number
            </p>
            <p className="truncate text-sm font-medium text-foreground">
              {profile.contactNumber || 'Not provided'}
            </p>
          </div>
        </div>

        {/* Portfolio / Website */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border/60 bg-muted/20">
          <div className="rounded-lg bg-background p-2 text-emerald-500 shadow-2xs">
            <Globe className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Portfolio Website
            </p>
            {profile.portfolioUrl ? (
              <a
                href={profile.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 truncate text-sm font-medium text-primary hover:underline"
              >
                <span>{profile.portfolioUrl.replace(/^https?:\/\//, '')}</span>
                <ExternalLink className="size-3 shrink-0" />
              </a>
            ) : (
              <span className="text-sm text-muted-foreground">Not provided</span>
            )}
          </div>
        </div>

        {/* GitHub */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border/60 bg-muted/20">
          <div className="rounded-lg bg-background p-2 text-foreground shadow-2xs">
            <span className="font-bold text-xs">GH</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              GitHub Profile
            </p>
            {githubUrl ? (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 truncate text-sm font-medium text-primary hover:underline"
              >
                <span>@{profile.githubUsername?.replace('@', '')}</span>
                <ExternalLink className="size-3 shrink-0" />
              </a>
            ) : (
              <span className="text-sm text-muted-foreground">Not linked</span>
            )}
          </div>
        </div>

        {/* LinkedIn */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl border border-border/60 bg-muted/20">
          <div className="rounded-lg bg-background p-2 text-blue-500 shadow-2xs">
            <span className="font-bold text-xs">IN</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              LinkedIn
            </p>
            {profile.linkedinUrl ? (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 truncate text-sm font-medium text-primary hover:underline"
              >
                <span>View Profile</span>
                <ExternalLink className="size-3 shrink-0" />
              </a>
            ) : (
              <span className="text-sm text-muted-foreground">Not linked</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
