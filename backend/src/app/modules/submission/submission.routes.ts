import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { SubmissionController } from './submission.controller';
import {
  createSubmissionZodSchema,
  reviewSubmissionZodSchema,
  submissionQueryZodSchema,
} from './submission.validation';

const router = Router();

router.post(
  '/',
  auth('STUDENT'),
  validateRequest(createSubmissionZodSchema),
  SubmissionController.submitAssignment
);

router.get(
  '/my-submissions',
  auth('STUDENT'),
  SubmissionController.getMySubmissions
);

router.get(
  '/assigned',
  auth('MENTOR'),
  validateRequest(submissionQueryZodSchema),
  SubmissionController.getAssignedSubmissions
);

router.get(
  '/mentor-stats',
  auth('MENTOR'),
  SubmissionController.getMentorStats
);

router.patch(
  '/:id/review',
  auth('MENTOR'),
  validateRequest(reviewSubmissionZodSchema),
  SubmissionController.reviewSubmission
);

router.get(
  '/:id',
  auth('ADMIN', 'INSTRUCTOR', 'MENTOR', 'STUDENT'),
  SubmissionController.getSingleSubmission
);

router.get(
  '/',
  auth('ADMIN', 'INSTRUCTOR'),
  validateRequest(submissionQueryZodSchema),
  SubmissionController.getAllSubmissions
);

export const SubmissionRoutes = router;

