import { z } from 'zod';

export const profileSettingsValidationSchema = z.object({
  name: z
    .string()
    .min(1, 'Full name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(50, 'Name must be less than 50 characters'),
  contactNumber: z
    .string()
    .min(1, 'Contact phone number is required')
    .min(10, 'Contact number must be at least 10 digits'),
  bio: z.string().max(300, 'Bio must be under 300 characters').optional().or(z.literal('')),
  avatarUrl: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
  githubUsername: z.string().max(40, 'Invalid GitHub username').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  portfolioUrl: z.string().url('Invalid portfolio URL').optional().or(z.literal('')),
});
