import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { batchFilterableFields } from './batch.constant';
import { BatchService } from './batch.service';

const paginationFields = ['page', 'limit', 'sortBy', 'sortOrder'];

const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Partial<T> => {
  const finalObj: Partial<T> = {};
  for (const key of keys) {
    if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key];
    }
  }
  return finalObj;
};

const createBatch = catchAsync(async (req: Request, res: Response) => {
  const result = await BatchService.createBatchIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Batch created successfully',
    data: result,
  });
});

const getAllBatches = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query as Record<string, unknown>, batchFilterableFields);
  const paginationOptions = pick(req.query as Record<string, unknown>, paginationFields);

  const result = await BatchService.getAllBatchesFromDB(filters, paginationOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Batches retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getActiveBatches = catchAsync(async (_req: Request, res: Response) => {
  const result = await BatchService.getActiveBatchesFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Active batches retrieved successfully',
    data: result,
  });
});

const getSingleBatch = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await BatchService.getSingleBatchFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Batch retrieved successfully',
    data: result,
  });
});

const updateBatch = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await BatchService.updateBatchIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Batch updated successfully',
    data: result,
  });
});

const deleteBatch = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await BatchService.deleteBatchFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Batch deleted successfully',
    data: result,
  });
});

export const BatchController = {
  createBatch,
  getAllBatches,
  getActiveBatches,
  getSingleBatch,
  updateBatch,
  deleteBatch,
};
