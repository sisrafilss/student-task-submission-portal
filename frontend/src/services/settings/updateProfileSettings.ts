'use server';

import { revalidatePath } from 'next/cache';
import { serverFetch } from '@/lib/server-fetch';
import { zodValidator } from '@/lib/zodValidator';
import { IActionResult } from '@/types/action.interface';
import { profileSettingsValidationSchema } from '@/zod/settings.validation';

export const updateProfileSettings = async (
  _prevState: IActionResult | null,
  formData: FormData
): Promise<IActionResult> => {
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

  try {
    const response = await serverFetch.patch('/users/profile', {
      body: JSON.stringify(validation.data),
    });

    const resJson = await response.json();

    if (!response.ok || !resJson.success) {
      return {
        success: false,
        message: resJson.message || 'Failed to update profile information.',
      };
    }

    revalidatePath('/settings');

    return {
      success: true,
      message: 'Profile information updated successfully!',
      data: resJson.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while saving profile changes.',
    };
  }
};
