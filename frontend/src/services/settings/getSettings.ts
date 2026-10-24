'use server';

import { serverFetch } from '@/lib/server-fetch';
import { getUserInfo } from '@/services/auth/getUserInfo';
import { IUserSettings } from '@/types/settings.interface';
import { UserRole } from '@/lib/auth-utils';

/**
 * Universal Server Action to fetch current authenticated user profile from backend database.
 */
export const getSettings = async (): Promise<{ success: boolean; data: IUserSettings }> => {
  const sessionUser = await getUserInfo();
  const defaultRole: UserRole = sessionUser?.role || 'STUDENT';

  try {
    const response = await serverFetch.get('/auth/me');
    if (response.ok) {
      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        const u = resJson.data;
        return {
          success: true,
          data: {
            role: (u.role as UserRole) || defaultRole,
            profile: {
              id: u.id,
              name: u.name || '',
              email: u.email || '',
              contactNumber: u.contactNumber || '',
              bio: u.bio || '',
              avatarUrl: u.avatarUrl || '',
              githubUsername: u.githubUsername || '',
              linkedinUrl: u.linkedinUrl || '',
              portfolioUrl: u.portfolioUrl || '',
              studentId: u.studentId || undefined,
              mentorId: u.mentorId || undefined,
              enrolledTrack: u.enrolledTrack || undefined,
              expertise: u.expertise || undefined,
              assignedBatchId: u.assignedBatchId || undefined,
              assignedBatch: u.assignedBatch || null,
              status: u.status || undefined,
            },
          },
        };
      }
    }
  } catch (error) {
    console.error('Failed to load settings from backend /auth/me:', error);
  }

  return {
    success: true,
    data: {
      role: defaultRole,
      profile: {
        name: sessionUser?.name || 'Portal User',
        email: sessionUser?.email || '',
        contactNumber: '',
        avatarUrl: sessionUser?.avatarUrl || '',
      },
    },
  };
};
