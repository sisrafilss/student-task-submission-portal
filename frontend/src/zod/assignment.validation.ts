import { z } from 'zod';

export const rubricItemSchema = z.object({
  id: z.string().optional(),
  criterion: z.string().min(1, 'Criterion title is required'),
  maxMarks: z.coerce.number().positive('Marks must be greater than 0'),
});

export const mentorQuotaSchema = z.object({
  mentorId: z.string().min(1, 'Invalid mentor selected'),
  mentorName: z.string().optional(),
  maxQuota: z.coerce.number().int().positive('Quota must be greater than 0'),
});

export const createAssignmentValidationSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  batchId: z.string().min(1, 'Please select a batch'),
  deadline: z.string().refine(
    (val) => {
      const parsed = Date.parse(val);
      return !isNaN(parsed) && new Date(val).getTime() > Date.now();
    },
    {
      message: 'Deadline must be a valid future date',
    }
  ),
  totalMarks: z.coerce.number().int().positive('Total marks must be positive').default(100),
  maxPerMentor: z.coerce.number().int().positive('Default quota must be positive').default(10),
  rubrics: z.array(rubricItemSchema).optional().default([]),
  mentorQuotas: z.array(mentorQuotaSchema).optional().default([]),
});

export const updateAssignmentValidationSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  batchId: z.string().min(1, 'Please select a batch'),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Deadline must be a valid date format',
  }),
  totalMarks: z.coerce.number().int().positive('Total marks must be positive').default(100),
  maxPerMentor: z.coerce.number().int().positive('Default quota must be positive').default(10),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
  rubrics: z.array(rubricItemSchema).optional().default([]),
  mentorQuotas: z.array(mentorQuotaSchema).optional().default([]),
});

export const studentSubmissionValidationSchema = z.object({
  assignmentId: z.string().min(1, 'Invalid assignment selected'),
  repoUrl: z
    .string()
    .url('GitHub Repository URL must be a valid URL')
    .refine((url) => url.startsWith('http://') || url.startsWith('https://'), {
      message: 'Repository URL must start with http:// or https://',
    }),
  liveUrl: z
    .string()
    .url('Live URL must be a valid URL')
    .optional()
    .or(z.literal('')),
  notes: z.string().max(2000, 'Notes cannot exceed 2000 characters').optional(),
});

