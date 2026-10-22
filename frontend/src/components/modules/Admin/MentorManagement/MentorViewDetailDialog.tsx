'use client';

import InfoRow from '@/components/shared/InfoRow';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { formatDateTime, getInitials } from '@/lib/formatters';
import { IMentor } from '@/types/mentor.interface';
import {
  Calendar,
  CheckCircle2,
  ExternalLink,
  Globe,
  Layers,
  Link as LinkIcon,
  Mail,
  Phone,
  Star,
  User,
  Users,
} from 'lucide-react';

interface MentorViewDetailDialogProps {
  open: boolean;
  onClose: () => void;
  mentor: IMentor | null;
}

export default function MentorViewDetailDialog({
  open,
  onClose,
  mentor,
}: MentorViewDetailDialogProps) {
  if (!mentor) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] w-full sm:max-w-2xl flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-bold">Mentor Profile Details</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
          {/* Mentor Profile Banner */}
          <div className="flex flex-col items-center gap-4 rounded-xl bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-5 sm:flex-row sm:items-start border border-border/60">
            <Avatar className="size-20 border-2 border-background shadow-md">
              {mentor.avatarUrl && <AvatarImage src={mentor.avatarUrl} alt={mentor.name} />}
              <AvatarFallback className="text-xl font-bold bg-primary/20 text-primary">
                {getInitials(mentor.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">{mentor.name}</h2>
              <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
                <Mail className="size-4" />
                {mentor.email}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 sm:justify-start">
                <Badge variant="outline" className="font-mono text-xs">
                  {mentor.mentorId}
                </Badge>
                <Badge variant="secondary" className="text-xs bg-primary/15 text-primary">
                  {mentor.expertise}
                </Badge>
                <Badge
                  variant={mentor.status === 'ACTIVE' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {mentor.status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Performance & Workload Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-border/60 bg-card p-3 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Users className="size-3.5 text-blue-500" />
                <span>Active Students</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {mentor.totalAssignedStudents}
              </p>
            </div>

            <div className="rounded-lg border border-border/60 bg-card p-3 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                <span>Evaluations</span>
              </div>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {mentor.totalEvaluations}
              </p>
            </div>

            <div className="rounded-lg border border-border/60 bg-card p-3 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                <span>Rating</span>
              </div>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {mentor.rating ? `${mentor.rating.toFixed(1)} / 5.0` : 'N/A'}
              </p>
            </div>
          </div>

          {/* Bio Section */}
          {mentor.bio && (
            <div className="space-y-1 rounded-lg bg-muted/30 p-3.5 border border-border/40">
              <span className="text-xs font-semibold text-foreground">Bio & Background:</span>
              <p className="text-xs text-muted-foreground leading-relaxed">{mentor.bio}</p>
            </div>
          )}

          <Separator />

          {/* Detailed Mentor Profile Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Assignment & Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoRow
                label="Assigned Batches"
                value={
                  <div className="flex flex-wrap items-center gap-1">
                    <Layers className="size-3.5 text-primary" />
                    {mentor.assignedBatches.map((b) => (
                      <Badge key={b.id} variant="outline" className="text-[11px] py-0 px-1.5">
                        {b.name}
                      </Badge>
                    ))}
                  </div>
                }
              />

              <InfoRow
                label="Phone Number"
                value={
                  <div className="flex items-center gap-1.5">
                    <Phone className="size-3.5 text-emerald-500" />
                    <span>{mentor.contactNumber}</span>
                  </div>
                }
              />

              <InfoRow
                label="Gender"
                value={
                  <div className="flex items-center gap-1.5">
                    <User className="size-3.5 text-muted-foreground" />
                    <span>{mentor.gender}</span>
                  </div>
                }
              />

              <InfoRow
                label="Onboarded Date"
                value={
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-amber-500" />
                    <span>{formatDateTime(mentor.createdAt)}</span>
                  </div>
                }
              />
            </div>
          </div>

          {/* Social Profiles */}
          {(mentor.githubUsername || mentor.linkedinUrl) && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Online Profiles & Socials
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mentor.githubUsername && (
                    <InfoRow
                      label="GitHub"
                      value={
                        <a
                          href={`https://github.com/${mentor.githubUsername}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-primary hover:underline"
                        >
                          <Globe className="size-3.5 text-foreground" />
                          <span>@{mentor.githubUsername}</span>
                          <ExternalLink className="size-3" />
                        </a>
                      }
                    />
                  )}

                  {mentor.linkedinUrl && (
                    <InfoRow
                      label="LinkedIn"
                      value={
                        <a
                          href={mentor.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-primary hover:underline"
                        >
                          <LinkIcon className="size-3.5 text-blue-600" />
                          <span>View Profile</span>
                          <ExternalLink className="size-3" />
                        </a>
                      }
                    />
                  )}
                </div>
              </div>
            </>
          )}

          {/* Temporary Password Notice for Admin */}
          {mentor.mustChangePassword && mentor.temporaryPassword && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs space-y-1">
              <span className="font-semibold text-amber-700 dark:text-amber-300">
                Temporary Credentials Note:
              </span>
              <p className="text-muted-foreground">
                Initial password:{' '}
                <code className="font-mono bg-background/80 px-1.5 py-0.5 rounded border border-border">
                  {mentor.temporaryPassword}
                </code>{' '}
                (Needs reset on first login).
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end px-6 py-3 border-t border-border/60 bg-muted/20">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
