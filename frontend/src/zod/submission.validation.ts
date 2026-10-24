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

export const reviewSubmissionValidationSchema = z
  .object({
    submissionId: z.string().min(1, 'Submission ID is required'),
    actionType: z.enum(['APPROVE', 'REJECT'], {
      message: 'Please select an evaluation action (Approve or Reject)',
    }),
    score: z.coerce
      .number()
      .min(0, 'Score cannot be negative')
      .max(100, 'Score cannot exceed 100')
      .optional(),
    feedback: z
      .string()
      .min(1, 'Constructive feedback is required')
      .min(10, 'Feedback must be at least 10 characters long')
      .max(2000, 'Feedback cannot exceed 2000 characters'),
    rejectionReason: z.string().optional(),
    rubricScoresJson: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.actionType === 'REJECT') {
      if (!data.rejectionReason || data.rejectionReason.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Rejection reason is required when rejecting a submission',
          path: ['rejectionReason'],
        });
      }
    }

    if (data.actionType === 'APPROVE') {
      if (data.score === undefined || data.score === null || Number.isNaN(data.score)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Score is required when approving a submission',
          path: ['score'],
        });
      }
    }
  });

export type ReviewSubmissionInput = z.infer<typeof reviewSubmissionValidationSchema>;

