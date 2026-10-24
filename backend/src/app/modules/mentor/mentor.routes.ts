import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { MentorController } from './mentor.controller';
import { MentorValidation } from './mentor.validation';

const router = Router();

router.post(
  '/',
  auth('ADMIN'),
  validateRequest(MentorValidation.createMentorZodSchema),
  MentorController.createMentor
);

router.get(
  '/specializations',
  auth('ADMIN', 'INSTRUCTOR', 'MENTOR'),
  MentorController.getMentorSpecializations
);

router.get(
  '/',
  auth('ADMIN', 'INSTRUCTOR', 'MENTOR'),
  MentorController.getAllMentors
);

router.get(
  '/:id',
  auth('ADMIN', 'INSTRUCTOR', 'MENTOR'),
  MentorController.getSingleMentor
);

router.patch(
  '/:id',
  auth('ADMIN'),
  validateRequest(MentorValidation.updateMentorZodSchema),
  MentorController.updateMentor
);

router.delete(
  '/:id',
  auth('ADMIN'),
  MentorController.deleteMentor
);

export const MentorRoutes = router;

