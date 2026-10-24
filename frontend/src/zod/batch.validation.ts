import { z } from 'zod';

export const createBatchValidationSchema = z.object({
  name: z
    .string()
    .min(3, 'Batch name must be at least 3 characters')
    .max(100, 'Batch name cannot exceed 100 characters'),
  batchCode: z
    .string()
    .min(2, 'Batch code must be at least 2 characters')
    .max(30, 'Batch code cannot exceed 30 characters')
    .regex(/^[A-Za-z0-9-]+$/, 'Batch code must be alphanumeric with hyphens (e.g. BATCH-01)'),
  track: z
    .string()
    .min(2, 'Course track must be at least 2 characters'),
  status: z.enum(['ACTIVE', 'UPCOMING', 'COMPLETED']).default('ACTIVE'),
});

export const updateBatchValidationSchema = z.object({
  name: z.string().min(3, 'Batch name must be at least 3 characters').max(100).optional(),
  batchCode: z.string().min(2).max(30).regex(/^[A-Za-z0-9-]+$/).optional(),
  track: z.string().min(2, 'Course track must be at least 2 characters').optional(),
  status: z.enum(['ACTIVE', 'UPCOMING', 'COMPLETED']).optional(),
});

