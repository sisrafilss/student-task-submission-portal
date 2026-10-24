'use server';

import { serverFetch } from '@/lib/server-fetch';
import { zodValidator } from '@/lib/zodValidator';
import { IActionResult } from '@/types/action.interface';
import {
  IBatchesResponse,
  IBatchOption,
} from '@/types/batch.interface';
import {
  createBatchValidationSchema,
  updateBatchValidationSchema,
} from '@/zod/batch.validation';
import { revalidatePath } from 'next/cache';

export const createBatchAction = async (
  _prevState: IActionResult | null,
  formData: FormData
): Promise<IActionResult> => {
  const payload = {
    name: formData.get('name')?.toString() || '',
    batchCode: (formData.get('batchCode')?.toString() || '').toUpperCase().trim(),
    track: formData.get('track')?.toString() || '',
    status: (formData.get('status')?.toString() || 'ACTIVE') as
      | 'ACTIVE'
      | 'UPCOMING'
      | 'COMPLETED',
  };

  const validation = zodValidator(payload, createBatchValidationSchema);
  if (!validation.success) {
    return {
      success: false,
      message: 'Please resolve the highlighted validation errors',
      errors: validation.errors,
      data: payload,
    };
  }

  try {
    const res = await serverFetch.post('/batches', {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validation.data),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || 'Failed to create batch',
        data: payload,
      };
    }

    revalidatePath('/admin/batches');
    revalidatePath('/admin/assignments');

    return {
      success: true,
      message: result.message || 'Batch created successfully',
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

export const updateBatchAction = async (
  batchId: string,
  _prevState: IActionResult | null,
  formData: FormData
): Promise<IActionResult> => {
  const payload: Record<string, string> = {};
  const name = formData.get('name')?.toString();
  const batchCode = formData.get('batchCode')?.toString();
  const track = formData.get('track')?.toString();
  const status = formData.get('status')?.toString();

  if (name) payload.name = name;
  if (batchCode) payload.batchCode = batchCode.toUpperCase().trim();
  if (track) payload.track = track;
  if (status) payload.status = status;

  const validation = zodValidator(payload, updateBatchValidationSchema);
  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: validation.errors,
      data: payload,
    };
  }

  try {
    const res = await serverFetch.patch(`/batches/${batchId}`, {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validation.data),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || 'Failed to update batch',
        data: payload,
      };
    }

    revalidatePath('/admin/batches');
    revalidatePath('/admin/assignments');

    return {
      success: true,
      message: result.message || 'Batch updated successfully',
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

export const deleteBatchAction = async (batchId: string): Promise<IActionResult> => {
  try {
    const res = await serverFetch.delete(`/batches/${batchId}`);
    const result = await res.json();

    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message || 'Failed to delete batch',
      };
    }

    revalidatePath('/admin/batches');
    revalidatePath('/admin/assignments');

    return {
      success: true,
      message: result.message || 'Batch deleted successfully',
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Network error';
    return {
      success: false,
      message,
    };
  }
};

export const getAllBatches = async (
  searchQuery = ''
): Promise<IBatchesResponse> => {
  try {
    const path = searchQuery ? `/batches?${searchQuery}` : '/batches';
    const res = await serverFetch.get(path, {
      cache: 'no-store',
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      return {
        success: false,
        data: [],
        meta: { page: 1, limit: 10, total: 0, totalPage: 1 },
      };
    }

    return {
      success: true,
      data: result.data || [],
      meta: result.meta || { page: 1, limit: 10, total: 0, totalPage: 1 },
    };
  } catch {
    return {
      success: false,
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPage: 1 },
    };
  }
};

export const getActiveBatches = async (): Promise<{
  success: boolean;
  data: IBatchOption[];
}> => {
  try {
    const res = await serverFetch.get('/batches/active', {
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
