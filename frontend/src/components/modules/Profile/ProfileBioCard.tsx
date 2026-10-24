'use client';

import Link from 'next/link';
import { AlignLeft, ArrowUpRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';

interface ProfileBioCardProps {
  bio?: string;
}

export default function ProfileBioCard({ bio }: ProfileBioCardProps) {
  return (
    <Card className="border-border shadow-xs">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <AlignLeft className="size-4.5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">About & Professional Bio</CardTitle>
            <CardDescription className="text-xs">
              Personal statement, background, and academic/career focus.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {bio ? (
          <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-line bg-muted/20 p-4 rounded-xl border border-border/50">
            {bio}
          </p>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-dashed border-border/80 bg-muted/10 text-center sm:text-left">
            <p className="text-xs sm:text-sm text-muted-foreground">
              No professional bio added yet. Add a short summary to personalize your portal account.
            </p>
            <Link
              href="/settings"
              className={buttonVariants({
                variant: 'outline',
                size: 'sm',
                className: 'text-xs gap-1 cursor-pointer shrink-0',
              })}
            >
              <span>Add Bio</span>
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
