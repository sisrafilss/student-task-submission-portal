import { z } from 'zod';

export const registerValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Full name is required' })
      .min(2, 'Name must be at least 2 characters long')
      .max(50, 'Name cannot exceed 50 characters'),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Please enter a valid email address'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters long')
      .max(100, 'Password cannot exceed 100 characters'),
  }),
});

export const loginValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email('Please enter a valid email address'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password is required'),
  }),
});

export const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z
      .string({ required_error: 'Current password is required' })
      .min(1, 'Current password is required'),
    newPassword: z
      .string({ required_error: 'New password is required' })
      .min(6, 'New password must be at least 6 characters long')
      .max(100, 'New password cannot exceed 100 characters'),
  }),
});

export const refreshTokenValidationSchema = z.object({
  body: z
    .object({
      refreshToken: z.string().optional(),
    })
    .optional(),
});

