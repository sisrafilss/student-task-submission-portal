import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { HealthRoutes } from '../modules/health/health.routes';
import { AssignmentRoutes } from '../modules/assignment/assignment.routes';
import { SubmissionRoutes } from '../modules/submission/submission.routes';
import { BatchRoutes } from '../modules/batch/batch.routes';

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
  {
    path: '/batches',
    route: BatchRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
