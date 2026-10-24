import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { HealthRoutes } from '../modules/health/health.routes';
import { AssignmentRoutes } from '../modules/assignment/assignment.routes';
import { SubmissionRoutes } from '../modules/submission/submission.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/health',
    route: HealthRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/assignments',
    route: AssignmentRoutes,
  },
  {
    path: '/submissions',
    route: SubmissionRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
