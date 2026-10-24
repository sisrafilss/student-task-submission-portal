import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AssignmentController } from './assignment.controller';
import {
  createAssignmentZodSchema,
  updateAssignmentZodSchema,
  updateAssignmentMentorsZodSchema,
  assignmentQueryZodSchema,
} from './assignment.validation';

const router = Router();

router.post(
  '/',
  auth('ADMIN'),
  validateRequest(createAssignmentZodSchema),
  AssignmentController.createAssignment
);

router.get(
  '/my-batch',
  auth('STUDENT'),
  AssignmentController.getMyBatchAssignments
);

router.get(
  '/active-mentors',
  auth('ADMIN'),
  AssignmentController.getActiveMentors
);

router.get(
  '/:id',
  auth('ADMIN', 'INSTRUCTOR', 'MENTOR', 'STUDENT'),
  AssignmentController.getSingleAssignment
);

router.get(
  '/',
  auth('ADMIN', 'INSTRUCTOR'),
  validateRequest(assignmentQueryZodSchema),
  AssignmentController.getAllAssignments
);

router.patch(
  '/:id',
  auth('ADMIN'),
  validateRequest(updateAssignmentZodSchema),
  AssignmentController.updateAssignment
);

router.delete(
  '/:id',
  auth('ADMIN'),
  AssignmentController.deleteAssignment
);

router.patch(
  '/:id/mentors',
  auth('ADMIN'),
  validateRequest(updateAssignmentMentorsZodSchema),
  AssignmentController.updateAssignmentMentors
);

export const AssignmentRoutes = router;

