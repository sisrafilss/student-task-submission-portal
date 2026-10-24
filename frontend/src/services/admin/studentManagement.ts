'use server';

import { serverFetch } from '@/lib/server-fetch';
import { zodValidator } from '@/lib/zodValidator';
import { IActionResult } from '@/types/action.interface';
import {
  IBatch,
  IStudent,
  IStudentListResponse,
  StudentGender,
  StudentStatus,
} from '@/types/student.interface';
import {
  updateStudentValidationSchema,
} from '@/zod/student.validation';
import { revalidatePath } from 'next/cache';

export const getBatches = async (): Promise<{ success: boolean; data: IBatch[] }> => {
  try {
    const res = await serverFetch.get('/batches/active', {
      cache: 'no-store',
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, data: [] };
    }

    const batches: IBatch[] = (result.data || []).map((b: { id: string; name?: string; label?: string; track?: string }) => ({
      id: b.id,
      name: b.name || b.label || b.id,
      track: b.track || 'Web Development',
      status: 'ACTIVE',
    }));

    return {
      success: true,
      data: batches,
    };
  } catch {
    return { success: false, data: [] };
  }
};

export const getStudents = async (queryString: string = ''): Promise<IStudentListResponse> => {
  try {
    const path = queryString ? `/students?${queryString}` : '/students';
    const res = await serverFetch.get(path, {
      cache: 'no-store',
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return {
        meta: { page: 1, limit: 10, total: 0, totalPage: 1 },
        data: [],
      };
    }

    return {
      meta: result.meta || { page: 1, limit: 10, total: 0, totalPage: 1 },
      data: result.data || [],
    };
  } catch {
    return {
      meta: { page: 1, limit: 10, total: 0, totalPage: 1 },
      data: [],
    };
  }
};

export const updateStudent = async (
  studentId: string,
  _prevState: IActionResult | null,
  formData: FormData
): Promise<IActionResult> => {
  const payload = {
    name: formData.get('name')?.toString() || '',
    email: formData.get('email')?.toString() || '',
    studentId: formData.get('studentId')?.toString() || '',
    batchId: formData.get('batchId')?.toString() || '',
    enrolledTrack: formData.get('enrolledTrack')?.toString() || '',
    contactNumber: formData.get('contactNumber')?.toString() || '',
    gender: (formData.get('gender')?.toString() as StudentGender) || 'MALE',
    address: formData.get('address')?.toString() || undefined,
    status: (formData.get('status')?.toString() as StudentStatus) || 'ACTIVE',
    githubUsername: formData.get('githubUsername')?.toString() || undefined,
    linkedinUrl: formData.get('linkedinUrl')?.toString() || undefined,
  };

  const validation = zodValidator(payload, updateStudentValidationSchema);
  if (!validation.success) {
    return {
      success: false,
      message: 'Please resolve form validation errors',
      errors: validation.errors,
      data: payload,
    };
  }

  try {
    const res = await serverFetch.patch(`/students/${studentId}`, {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validation.data),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || 'Failed to update student details',
        data: payload,
      };
    }

    revalidatePath('/admin/students');

    return {
      success: true,
      message: result.message || 'Student details updated successfully!',
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

export const deleteStudent = async (studentId: string): Promise<IActionResult> => {
  try {
    const res = await serverFetch.delete(`/students/${studentId}`);
    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || 'Failed to delete student',
      };
    }

    revalidatePath('/admin/students');

    return {
      success: true,
      message: result.message || 'Student deleted successfully',
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Network error';
    return {
      success: false,
      message,
    };
  }
};
