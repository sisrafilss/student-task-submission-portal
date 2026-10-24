import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BatchController } from './batch.controller';
import { BatchValidation } from './batch.validation';

const router = Router();

router.post(
  '/',
  auth('ADMIN'),
  validateRequest(BatchValidation.createBatchZodSchema),
  BatchController.createBatch
);

router.get(
  '/',
  auth('ADMIN', 'INSTRUCTOR', 'MENTOR'),
  BatchController.getAllBatches
);

router.get(
  '/active',
  auth('ADMIN', 'INSTRUCTOR', 'MENTOR', 'STUDENT'),
  BatchController.getActiveBatches
);

router.get(
  '/:id',
  auth('ADMIN', 'INSTRUCTOR', 'MENTOR'),
  BatchController.getSingleBatch
);

router.patch(
  '/:id',
  auth('ADMIN'),
  validateRequest(BatchValidation.updateBatchZodSchema),
  BatchController.updateBatch
);

router.delete(
  '/:id',
  auth('ADMIN'),
  BatchController.deleteBatch
);

export const BatchRoutes = router;

