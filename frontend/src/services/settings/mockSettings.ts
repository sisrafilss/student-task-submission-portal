import { IUserSettings } from '@/types/settings.interface';
import { UserRole } from '@/lib/auth-utils';

export const initialStudentSettings: IUserSettings = {
  role: 'STUDENT',
  profile: {
    name: 'Demo Student',
    email: 'student@portal.test',
    contactNumber: '+8801700000001',
    bio: 'Web development student learning Next.js, React, and TypeScript.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    githubUsername: 'student-demo',
    linkedinUrl: 'https://linkedin.com/in/student-demo',
    portfolioUrl: 'https://student-portfolio.dev',
  },
};

export const initialMentorSettings: IUserSettings = {
  role: 'MENTOR',
  profile: {
    name: 'Demo Mentor',
    email: 'mentor@portal.test',
    contactNumber: '+8801700000002',
    bio: 'Software engineer and mentor guiding students through full-stack web development.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    githubUsername: 'mentor-demo',
    linkedinUrl: 'https://linkedin.com/in/mentor-demo',
    portfolioUrl: 'https://mentor-dev.tech',
  },
};

export const initialAdminSettings: IUserSettings = {
  role: 'ADMIN',
  profile: {
    name: 'System Admin',
    email: 'admin@portal.test',
    contactNumber: '+8801700000003',
    bio: 'Platform and academy administrator.',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    githubUsername: 'admin-demo',
    linkedinUrl: 'https://linkedin.com/in/admin-demo',
    portfolioUrl: 'https://academy-portal.io',
  },
};

// In-memory runtime cache for settings
const settingsStore: Record<UserRole, IUserSettings> = {
  STUDENT: JSON.parse(JSON.stringify(initialStudentSettings)),
  MENTOR: JSON.parse(JSON.stringify(initialMentorSettings)),
  ADMIN: JSON.parse(JSON.stringify(initialAdminSettings)),
};

export const getStoredSettings = (role: UserRole): IUserSettings => {
  return JSON.parse(JSON.stringify(settingsStore[role] || settingsStore.STUDENT));
};

export const updateStoredSettings = (role: UserRole, updates: Partial<IUserSettings>): IUserSettings => {
  settingsStore[role] = {
    ...settingsStore[role],
    ...updates,
  };
  return JSON.parse(JSON.stringify(settingsStore[role]));
};
