import { z } from 'zod';

const createMentorZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Mentor name is required').max(100),
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    temporaryPassword: z.string().min(6).optional(),
    mentorId: z.string().optional(),
    contactNumber: z.string().min(6, 'Contact number is required'),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    expertise: z.string().min(1, 'Specialization is required'),
    assignedBatchId: z.string().min(1, 'Assigned batch is required'),
    status: z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'BLOCKED']).optional(),
    bio: z.string().max(500).optional(),
    githubUsername: z.string().optional(),
    linkedinUrl: z.string().optional(),
  }),
});

const updateMentorZodSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    contactNumber: z.string().optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
    expertise: z.string().optional(),
    assignedBatchId: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'BLOCKED']).optional(),
    bio: z.string().max(500).optional(),
    githubUsername: z.string().optional(),
    linkedinUrl: z.string().optional(),
  }),
});

export const MentorValidation = {
  createMentorZodSchema,
  updateMentorZodSchema,
};

