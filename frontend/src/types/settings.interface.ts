import { UserRole } from '@/lib/auth-utils';

export interface IUserProfileSettings {
  name: string;
  email: string;
  contactNumber: string;
  bio?: string;
  avatarUrl?: string;
  githubUsername?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

export interface IUserSettings {
  role: UserRole;
  profile: IUserProfileSettings;
}
