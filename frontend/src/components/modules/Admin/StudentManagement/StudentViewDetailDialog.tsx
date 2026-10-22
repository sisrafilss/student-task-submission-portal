'use client';

import InfoRow from '@/components/shared/InfoRow';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { formatDateTime, getInitials } from '@/lib/formatters';
import { IStudent } from '@/types/student.interface';
import {
  Award,
  BookOpen,
  Calendar,
  ExternalLink,
  Globe,
  GraduationCap,
  Link as LinkIcon,
  Mail,
  MapPin,
  Phone,
  User,
  UserCheck,
} from 'lucide-react';

interface StudentViewDetailDialogProps {
  open: boolean;
  onClose: () => void;
  student: IStudent | null;
}

export default function StudentViewDetailDialog({
  open,
  onClose,
  student,
}: StudentViewDetailDialogProps) {
  if (!student) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] w-full sm:max-w-2xl flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-bold">Student Profile Details</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
          {/* Student Profile Banner */}
          <div className="flex flex-col items-center gap-4 rounded-xl bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-5 sm:flex-row sm:items-start border border-border/60">
            <Avatar className="size-20 border-2 border-background shadow-md">
              {student.avatarUrl && <AvatarImage src={student.avatarUrl} alt={student.name} />}
              <AvatarFallback className="text-xl font-bold bg-primary/20 text-primary">
                {getInitials(student.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">{student.name}</h2>
              <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
                <Mail className="size-4" />
                {student.email}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 sm:justify-start">
                <Badge variant="outline" className="font-mono text-xs">
                  {student.studentId}
                </Badge>
                <Badge
                  variant={student.status === 'ACTIVE' ? 'default' : student.status === 'BLOCKED' ? 'destructive' : 'secondary'}
                  className="text-xs capitalize"
                >
                  {student.status.toLowerCase()}
                </Badge>
                {student.averageScore !== undefined && (
                  <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/30 gap-1">
                    <Award className="size-3 text-amber-500" />
                    Avg Score: {student.averageScore}%
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <GraduationCap className="size-4.5" />
              <span>Academic Details</span>
            </div>
            <div className="grid grid-cols-1 gap-4 rounded-lg bg-muted/30 p-4 border border-border/50 sm:grid-cols-2">
              <InfoRow label="Enrolled Batch" value={student.batchName} />
              <InfoRow label="Track / Program" value={student.enrolledTrack} />
              <InfoRow
                label="Total Submissions"
                value={
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="size-4 text-blue-500" />
                    <span>{student.totalSubmissions ?? 0} Tasks Submitted</span>
                  </div>
                }
              />
              <InfoRow
                label="Assigned Mentor"
                value={
                  student.assignedMentor ? (
                    <div className="flex items-center gap-1.5">
                      <UserCheck className="size-4 text-emerald-500" />
                      <span>{student.assignedMentor.name}</span>
                    </div>
                  ) : (
                    'Not Assigned Yet'
                  )
                }
              />
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-purple-600 dark:text-purple-400">
              <Phone className="size-4.5" />
              <span>Contact Information</span>
            </div>
            <div className="grid grid-cols-1 gap-4 rounded-lg bg-muted/30 p-4 border border-border/50 sm:grid-cols-2">
              <InfoRow label="Phone Number" value={student.contactNumber} />
              <InfoRow label="Email Address" value={student.email} />
              <div className="sm:col-span-2">
                <InfoRow
                  label="Present Address"
                  value={
                    <div className="flex items-start gap-1.5">
                      <MapPin className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span>{student.address || 'Address not specified'}</span>
                    </div>
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Social Profiles & System Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <User className="size-4.5" />
              <span>Personal & System Records</span>
            </div>
            <div className="grid grid-cols-1 gap-4 rounded-lg bg-muted/30 p-4 border border-border/50 sm:grid-cols-2">
              <InfoRow
                label="Gender"
                value={student.gender.charAt(0) + student.gender.slice(1).toLowerCase()}
              />
              <InfoRow
                label="GitHub Profile"
                value={
                  student.githubUsername ? (
                    <a
                      href={`https://github.com/${student.githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-primary hover:underline text-xs"
                    >
                      <Globe className="size-3.5" />
                      @{student.githubUsername}
                      <ExternalLink className="size-3" />
                    </a>
                  ) : (
                    'Not linked'
                  )
                }
              />
              <InfoRow
                label="LinkedIn Profile"
                value={
                  student.linkedinUrl ? (
                    <a
                      href={student.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-blue-600 hover:underline text-xs"
                    >
                      <LinkIcon className="size-3.5" />
                      Profile Link
                      <ExternalLink className="size-3" />
                    </a>
                  ) : (
                    'Not linked'
                  )
                }
              />
              <InfoRow
                label="Registered On"
                value={
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="size-3.5" />
                    <span>{formatDateTime(student.createdAt)}</span>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
