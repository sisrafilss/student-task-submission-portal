import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.validation';

const router = Router();

router.get(
  '/',
  auth('ADMIN', 'INSTRUCTOR', 'MENTOR'),
  StudentController.getAllStudents
);

router.get(
  '/:id',
  auth('ADMIN', 'INSTRUCTOR', 'MENTOR'),
  StudentController.getSingleStudent
);

router.patch(
  '/:id',
  auth('ADMIN'),
  validateRequest(StudentValidation.updateStudentZodSchema),
  StudentController.updateStudent
);

router.delete(
  '/:id',
  auth('ADMIN'),
  StudentController.deleteStudent
);

export const StudentRoutes = router;

