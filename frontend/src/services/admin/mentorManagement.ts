'use server';

import { serverFetch } from '@/lib/server-fetch';
import { zodValidator } from '@/lib/zodValidator';
import { IActionResult } from '@/types/action.interface';
import {
  IMentor,
  IMentorListResponse,
  MentorGender,
  MentorStatus,
} from '@/types/mentor.interface';
import {
  createMentorValidationSchema,
  updateMentorValidationSchema,
} from '@/zod/mentor.validation';
import { revalidatePath } from 'next/cache';

export const getMentorSpecializationsList = async (): Promise<{
  success: boolean;
  data: { label: string; value: string }[];
}> => {
  try {
    const res = await serverFetch.get('/mentors/specializations', {
      cache: 'no-store',
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, data: [] };
    }

    return {
      success: true,
      data: result.data || [],
    };
  } catch {
    return { success: false, data: [] };
  }
};

export const getMentors = async (queryString: string = ''): Promise<IMentorListResponse> => {
  try {
    const path = queryString ? `/mentors?${queryString}` : '/mentors';
    const res = await serverFetch.get(path, {
      cache: 'no-store',
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return {
        meta: { page: 1, limit: 8, total: 0, totalPage: 1 },
        data: [],
      };
    }

    return {
      meta: result.meta || { page: 1, limit: 8, total: 0, totalPage: 1 },
      data: result.data || [],
    };
  } catch {
    return {
      meta: { page: 1, limit: 8, total: 0, totalPage: 1 },
      data: [],
    };
  }
};

export const createMentor = async (
  _prevState: IActionResult | null,
  formData: FormData
): Promise<IActionResult> => {
  const payload = {
    name: formData.get('name')?.toString() || '',
    email: formData.get('email')?.toString() || '',
    temporaryPassword: formData.get('temporaryPassword')?.toString() || '',
    contactNumber: formData.get('contactNumber')?.toString() || '',
    gender: (formData.get('gender')?.toString() as MentorGender) || 'MALE',
    expertise: formData.get('expertise')?.toString() || '',
    assignedBatchId: formData.get('assignedBatchId')?.toString() || '',
    status: (formData.get('status')?.toString() as MentorStatus) || 'ACTIVE',
    bio: formData.get('bio')?.toString() || undefined,
    githubUsername: formData.get('githubUsername')?.toString() || undefined,
    linkedinUrl: formData.get('linkedinUrl')?.toString() || undefined,
  };

  const validation = zodValidator(payload, createMentorValidationSchema);
  if (!validation.success) {
    return {
      success: false,
      message: 'Please resolve form validation errors',
      errors: validation.errors,
      data: payload,
    };
  }

  try {
    const res = await serverFetch.post('/mentors', {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validation.data),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || 'Failed to onboard mentor',
        data: payload,
      };
    }

    revalidatePath('/admin/mentors');

    return {
      success: true,
      message: result.message || 'Mentor registered successfully!',
      data: result.data,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Network error';
    return {
      success: false,
      message,
      data: payload,
    };
  }
};

export const updateMentor = async (
  mentorId: string,
  _prevState: IActionResult | null,
  formData: FormData
): Promise<IActionResult> => {
  const payload = {
    name: formData.get('name')?.toString() || '',
    contactNumber: formData.get('contactNumber')?.toString() || '',
    gender: (formData.get('gender')?.toString() as MentorGender) || 'MALE',
    expertise: formData.get('expertise')?.toString() || '',
    assignedBatchId: formData.get('assignedBatchId')?.toString() || '',
    status: (formData.get('status')?.toString() as MentorStatus) || 'ACTIVE',
    bio: formData.get('bio')?.toString() || undefined,
    githubUsername: formData.get('githubUsername')?.toString() || undefined,
    linkedinUrl: formData.get('linkedinUrl')?.toString() || undefined,
    email: formData.get('email')?.toString() || undefined,
    mentorId: formData.get('mentorId')?.toString() || undefined,
  };

  const validation = zodValidator(payload, updateMentorValidationSchema);
  if (!validation.success) {
    return {
      success: false,
      message: 'Please resolve form validation errors',
      errors: validation.errors,
      data: payload,
    };
  }

  try {
    const res = await serverFetch.patch(`/mentors/${mentorId}`, {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validation.data),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || 'Failed to update mentor details',
        data: payload,
      };
    }

    revalidatePath('/admin/mentors');

    return {
      success: true,
      message: result.message || 'Mentor details updated successfully!',
      data: result.data,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Network error';
    return {
      success: false,
      message,
      data: payload,
    };
  }
};

export const deleteMentor = async (mentorId: string): Promise<IActionResult> => {
  try {
    const res = await serverFetch.delete(`/mentors/${mentorId}`);
    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || 'Failed to delete mentor',
      };
    }

    revalidatePath('/admin/mentors');

    return {
      success: true,
      message: result.message || 'Mentor removed successfully',
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Network error';
    return {
      success: false,
      message,
    };
  }
};
