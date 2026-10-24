import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import {
  changePasswordValidationSchema,
  loginValidationSchema,
  refreshTokenValidationSchema,
  registerValidationSchema,
} from './auth.validation';

const router = Router();

router.post(
  '/register',
  validateRequest(registerValidationSchema),
  AuthController.registerStudent
);

router.post(
  '/login',
  validateRequest(loginValidationSchema),
  AuthController.loginUser
);

router.post(
  '/change-password',
  auth('ADMIN', 'MENTOR', 'STUDENT'),
  validateRequest(changePasswordValidationSchema),
  AuthController.changePassword
);

router.post(
  '/refresh-token',
  validateRequest(refreshTokenValidationSchema),
  AuthController.refreshToken
);

router.post('/logout', AuthController.logoutUser);

export const AuthRoutes = router;

