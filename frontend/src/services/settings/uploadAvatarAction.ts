'use server';

import { serverFetch } from '@/lib/server-fetch';
import { IActionResult } from '@/types/action.interface';

export const uploadAvatarAction = async (formData: FormData): Promise<IActionResult> => {
  try {
    const file = formData.get('avatar');
    if (!file || !(file instanceof File) || file.size === 0) {
      return {
        success: false,
        message: 'Please select an image file to upload.',
      };
    }

    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        message: 'Image size must not exceed 5MB.',
      };
    }

    const response = await serverFetch.post('/users/avatar', {
      body: formData,
    });

    const resJson = await response.json();

    if (!response.ok || !resJson.success) {
      return {
        success: false,
        message: resJson.message || 'Failed to upload image to Cloudinary.',
      };
    }

    return {
      success: true,
      message: 'Profile photo updated successfully in Cloudinary!',
      data: resJson.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred during photo upload.',
    };
  }
};

