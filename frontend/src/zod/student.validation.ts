import { z } from 'zod';

export const createStudentValidationSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Student full name is required')
      .min(3, 'Name must be at least 3 characters')
      .max(50, 'Name must be less than 50 characters'),
    email: z
      .string()
      .min(1, 'Email address is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Temporary password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(1, 'Password confirmation is required')
      .min(6, 'Password must be at least 6 characters'),
    studentId: z
      .string()
      .min(1, 'Student ID / Roll is required')
      .min(4, 'Student ID must be at least 4 characters'),
    batchId: z.string().min(1, 'Please select a batch'),
    enrolledTrack: z
      .string()
      .min(1, 'Track/Program is required')
      .min(2, 'Please specify enrolled track'),
    contactNumber: z
      .string()
      .min(1, 'Contact number is required')
      .min(10, 'Contact number must be at least 10 characters'),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    address: z.string().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED', 'GRADUATED']).default('ACTIVE'),
    githubUsername: z.string().optional(),
    linkedinUrl: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const updateStudentValidationSchema = z.object({
  name: z
    .string()
    .min(1, 'Student full name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  studentId: z
    .string()
    .min(1, 'Student ID / Roll is required')
    .min(4, 'Student ID must be at least 4 characters'),
  batchId: z.string().min(1, 'Please select a batch'),
  enrolledTrack: z
    .string()
    .min(1, 'Track/Program is required')
    .min(2, 'Please specify enrolled track'),
  contactNumber: z
    .string()
    .min(1, 'Contact number is required')
    .min(10, 'Contact number must be at least 10 characters'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  address: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'BLOCKED', 'GRADUATED']),
  githubUsername: z.string().optional(),
  linkedinUrl: z.string().optional(),
});

export type ICreateStudentInput = z.infer<typeof createStudentValidationSchema>;
export type IUpdateStudentInput = z.infer<typeof updateStudentValidationSchema>;

