'use server';

import { zodValidator } from '@/lib/zodValidator';
import { getUserInfo } from '@/services/auth/getUserInfo';
import { IActionResult } from '@/types/action.interface';
import { profileSettingsValidationSchema } from '@/zod/settings.validation';
import { getStoredSettings, updateStoredSettings } from './mockSettings';

export const updateProfileSettings = async (
  _prevState: IActionResult | null,
  formData: FormData
): Promise<IActionResult> => {
  const user = await getUserInfo();
  const role = user?.role || 'STUDENT';

  const payload = {
    name: formData.get('name')?.toString().trim() || '',
    contactNumber: formData.get('contactNumber')?.toString().trim() || '',
    bio: formData.get('bio')?.toString().trim() || '',
    avatarUrl: formData.get('avatarUrl')?.toString().trim() || '',
    githubUsername: formData.get('githubUsername')?.toString().trim() || '',
    linkedinUrl: formData.get('linkedinUrl')?.toString().trim() || '',
    portfolioUrl: formData.get('portfolioUrl')?.toString().trim() || '',
  };

  const validation = zodValidator(payload, profileSettingsValidationSchema);
  if (!validation.success) {
    return {
      success: false,
      message: 'Please resolve the highlighted profile validation errors.',
      errors: validation.errors,
    };
  }

  const current = getStoredSettings(role);
  const updated = updateStoredSettings(role, {
    profile: {
      ...current.profile,
      ...validation.data,
    },
  });

  return {
    success: true,
    message: 'Profile information updated successfully!',
    data: updated.profile,
  };
};

