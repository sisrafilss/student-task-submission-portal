import { z } from 'zod';

const updateStudentZodSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    batchId: z.string().optional(),
    enrolledTrack: z.string().optional(),
    contactNumber: z.string().optional(),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
    address: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED', 'GRADUATED']).optional(),
    githubUsername: z.string().optional(),
    linkedinUrl: z.string().optional(),
  }),
});

export const StudentValidation = {
  updateStudentZodSchema,
};

