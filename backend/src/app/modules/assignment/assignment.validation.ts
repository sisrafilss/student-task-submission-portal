import { z } from 'zod';
import { assignmentStatusEnum } from './assignment.constant';

const rubricItemSchema = z.object({
  criterion: z
    .string({
      required_error: 'Criterion title is required',
    })
    .min(1, 'Criterion cannot be empty'),
  maxMarks: z
    .number({
      required_error: 'maxMarks must be a positive number',
    })
    .positive('maxMarks must be greater than 0'),
});

const mentorQuotaSchema = z.object({
  mentorId: z
    .string({
      required_error: 'mentorId is required',
    })
    .uuid('mentorId must be a valid UUID'),
  maxQuota: z.number().int().positive('maxQuota must be greater than 0').optional(),
});

export const createAssignmentZodSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'Title is required',
      })
      .min(3, 'Title must be at least 3 characters'),
    description: z
      .string({
        required_error: 'Description is required',
      })
      .min(5, 'Description must be at least 5 characters'),
    batchId: z
      .string({
        required_error: 'batchId is required',
      })
      .min(1, 'batchId cannot be empty'),
    deadline: z
      .string({
        required_error: 'Deadline is required',
      })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid deadline date format',
      }),
    totalMarks: z.number().int().positive().optional().default(100),
    maxPerMentor: z.number().int().positive().optional().default(10),
    rubrics: z.array(rubricItemSchema).optional().default([]),
    mentorQuotas: z.array(mentorQuotaSchema).optional().default([]),
  }),
});

export const updateAssignmentZodSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').optional(),
    description: z.string().min(5, 'Description must be at least 5 characters').optional(),
    batchId: z.string().min(1, 'batchId cannot be empty').optional(),
    deadline: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid deadline date format',
      })
      .optional(),
    totalMarks: z.number().int().positive().optional(),
    maxPerMentor: z.number().int().positive().optional(),
    status: z.enum(assignmentStatusEnum).optional(),
    rubrics: z.array(rubricItemSchema).optional(),
    mentorQuotas: z.array(mentorQuotaSchema).optional(),
  }),
});

export const updateAssignmentMentorsZodSchema = z.object({
  body: z.object({
    mentors: z
      .array(
        z.object({
          mentorId: z.string().uuid('mentorId must be a valid UUID'),
          maxQuota: z.number().int().positive('maxQuota must be greater than 0'),
        })
      )
      .nonempty('At least one mentor quota is required'),
  }),
});

export const assignmentQueryZodSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    batchId: z.string().optional(),
    status: z.enum(assignmentStatusEnum).optional(),
    searchTerm: z.string().optional(),
  }),
});

