import { z } from 'zod';

const gitRepoRegex = /^https:\/\/(www\.)?(github\.com|gitlab\.com|bitbucket\.org)\/[\w.-]+\/[\w.-]+(\/)?$/i;

export const submissionValidationSchema = z.object({
  assignmentId: z
    .string()
    .min(1, 'Please select an assignment to submit for'),
  projectName: z
    .string()
    .min(1, 'Project name is required')
    .min(3, 'Project name must be at least 3 characters long')
    .max(100, 'Project name cannot exceed 100 characters'),
  repoUrl: z
    .string()
    .min(1, 'Repository URL is required')
    .url('Please enter a valid URL')
    .refine((url) => gitRepoRegex.test(url.trim()), {
      message: 'Repository URL must be a valid GitHub, GitLab, or Bitbucket link (e.g. https://github.com/user/repo)',
    }),
  liveUrl: z
    .string()
    .min(1, 'Live deployment URL is required')
    .url('Please enter a valid live URL (e.g. https://my-project.vercel.app)'),
  description: z
    .string()
    .min(1, 'Project description is required')
    .min(20, 'Please write at least 20 characters describing key features and technologies')
    .max(1000, 'Description cannot exceed 1000 characters'),
  remarks: z
    .string()
    .max(300, 'Remarks cannot exceed 300 characters')
    .optional(),
});

export type SubmissionInput = z.infer<typeof submissionValidationSchema>;

