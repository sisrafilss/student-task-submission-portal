import { z } from 'zod';

const createBatchZodSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Batch name is required' })
      .min(3, 'Batch name must be at least 3 characters')
      .max(100, 'Batch name cannot exceed 100 characters'),
    batchCode: z
      .string({ required_error: 'Batch code is required' })
      .min(2, 'Batch code must be at least 2 characters')
      .max(30, 'Batch code cannot exceed 30 characters')
      .regex(/^[A-Za-z0-9-]+$/, 'Batch code must be alphanumeric with hyphens (e.g. BATCH-01)'),
    track: z
      .string({ required_error: 'Course track is required' })
      .min(2, 'Course track must be at least 2 characters'),
    status: z.enum(['ACTIVE', 'UPCOMING', 'COMPLETED']).optional(),
  }),
});

const updateBatchZodSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(100).optional(),
    batchCode: z.string().min(2).max(30).regex(/^[A-Za-z0-9-]+$/).optional(),
    track: z.string().min(2).optional(),
    status: z.enum(['ACTIVE', 'UPCOMING', 'COMPLETED']).optional(),
  }),
});

export const BatchValidation = {
  createBatchZodSchema,
  updateBatchZodSchema,
};

