import { Router } from 'express';
import { HealthRoutes } from '../modules/health/health.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/health',
    route: HealthRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

