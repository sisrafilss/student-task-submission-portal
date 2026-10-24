import { z } from 'zod';
import { submissionStatusEnum } from './submission.constant';

export const createSubmissionZodSchema = z.object({
  body: z.object({
    assignmentId: z
      .string({
        required_error: 'assignmentId is required',
      })
      .uuid('Invalid assignmentId format'),
    repoUrl: z
      .string({
        required_error: 'repoUrl is required',
      })
      .url('repoUrl must be a valid URL'),
    liveUrl: z.string().url('liveUrl must be a valid URL').optional().or(z.literal('')),
    notes: z.string().max(2000, 'Notes cannot exceed 2000 characters').optional(),
  }),
});

export const reviewSubmissionZodSchema = z.object({
  body: z.object({
    status: z.enum(submissionStatusEnum as unknown as [string, ...string[]], {
      required_error: 'Valid status is required',
    }),
    marks: z
      .number({
        required_error: 'marks must be a number',
      })
      .min(0, 'Marks cannot be negative')
      .optional(),
    feedback: z.string().max(3000, 'Feedback cannot exceed 3000 characters').optional(),
  }),
});

export const submissionQueryZodSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    status: z.enum(submissionStatusEnum as unknown as [string, ...string[]]).optional(),
    assignmentId: z.string().uuid().optional(),
    searchTerm: z.string().optional(),
  }),
});

