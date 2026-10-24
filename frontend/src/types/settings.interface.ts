import { UserRole } from '@/lib/auth-utils';

export interface IUserProfileSettings {
  id?: string;
  name: string;
  email: string;
  contactNumber: string;
  bio?: string;
  avatarUrl?: string;
  githubUsername?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  studentId?: string;
  mentorId?: string;
  enrolledTrack?: string;
  expertise?: string;
  assignedBatchId?: string;
  assignedBatch?: {
    id: string;
    batchNumber: string;
    batchName: string;
  } | null;
  status?: string;
}

export interface IUserSettings {
  role: UserRole;
  profile: IUserProfileSettings;
}
