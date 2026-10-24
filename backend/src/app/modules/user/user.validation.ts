import { z } from 'zod';

export const updateUserProfileValidationSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').optional(),
    contactNumber: z.string().trim().max(25, 'Contact number is too long').optional(),
    bio: z.string().trim().max(500, 'Bio cannot exceed 500 characters').optional(),
    avatarUrl: z.string().trim().url('Invalid avatar URL format').optional().or(z.literal('')),
    githubUsername: z.string().trim().max(40, 'GitHub username too long').optional(),
    linkedinUrl: z.string().trim().url('Invalid LinkedIn URL').optional().or(z.literal('')),
    portfolioUrl: z.string().trim().url('Invalid portfolio URL').optional().or(z.literal('')),
  }),
});

