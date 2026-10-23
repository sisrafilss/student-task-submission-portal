'use server';

import { getUserInfo } from '@/services/auth/getUserInfo';
import { IUserSettings } from '@/types/settings.interface';
import { getStoredSettings } from './mockSettings';

/**
 * Universal Server Action to fetch the current authenticated user's settings.
 */
export const getSettings = async (): Promise<{ success: boolean; data: IUserSettings }> => {
  const user = await getUserInfo();
  const role = user?.role || 'STUDENT';
  const settings = getStoredSettings(role);

  // Sync profile data from active session if present
  if (user) {
    settings.profile.name = user.name || settings.profile.name;
    settings.profile.email = user.email || settings.profile.email;
    if (user.avatarUrl) {
      settings.profile.avatarUrl = user.avatarUrl;
    }
  }

  return {
    success: true,
    data: settings,
  };
};

