import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { HealthRoutes } from '../modules/health/health.routes';

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

