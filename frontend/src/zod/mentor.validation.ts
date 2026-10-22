import { z } from 'zod';

export const createMentorValidationSchema = z.object({
  name: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  temporaryPassword: z
    .string()
    .min(1, 'Temporary password is required')
    .min(6, 'Temporary password must be at least 6 characters long'),
  contactNumber: z
    .string()
    .min(1, 'Contact number is required')
    .min(6, 'Please enter a valid contact number'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  expertise: z
    .string()
    .min(1, 'Specialization / expertise is required')
    .min(2, 'Please specify mentor expertise'),
  status: z
    .enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'BLOCKED'])
    .default('ACTIVE'),
  assignedBatchId: z.string().min(1, 'Please select a batch'),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  githubUsername: z.string().optional(),
  linkedinUrl: z.string().optional(),
});

export const updateMentorValidationSchema = z.object({
  name: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name cannot exceed 100 characters'),
  contactNumber: z
    .string()
    .min(1, 'Contact number is required')
    .min(6, 'Please enter a valid contact number'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  expertise: z
    .string()
    .min(1, 'Specialization / expertise is required')
    .min(2, 'Please specify mentor expertise'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'BLOCKED']),
  assignedBatchId: z.string().min(1, 'Please select a batch'),
  bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional(),
  githubUsername: z.string().optional(),
  linkedinUrl: z.string().optional(),
  email: z.string().optional(),
  mentorId: z.string().optional(),
});

export type CreateMentorInput = z.infer<typeof createMentorValidationSchema>;
export type UpdateMentorInput = z.infer<typeof updateMentorValidationSchema>;

