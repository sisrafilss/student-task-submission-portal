import { Router } from 'express';
import auth from '../../middlewares/auth';
import { DashboardController } from './dashboard.controller';

const router = Router();

router.get('/admin', auth('ADMIN'), DashboardController.getAdminDashboard);
router.get('/mentor', auth('MENTOR'), DashboardController.getMentorDashboard);
router.get('/student', auth('STUDENT'), DashboardController.getStudentDashboard);

export const DashboardRoutes = router;

