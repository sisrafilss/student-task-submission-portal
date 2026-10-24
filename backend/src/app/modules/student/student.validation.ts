import { z } from 'zod';

const createStudentZodSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Student name is required').max(100),
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    studentId: z.string().optional(),
    batchId: z.string().min(1, 'Batch is required'),
    enrolledTrack: z.string().min(1, 'Enrolled track is required'),
    contactNumber: z.string().min(6, 'Contact number is required'),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    address: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED', 'GRADUATED']).optional(),
    githubUsername: z.string().optional(),
    linkedinUrl: z.string().optional(),
  }),
});

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
  createStudentZodSchema,
  updateStudentZodSchema,
};

