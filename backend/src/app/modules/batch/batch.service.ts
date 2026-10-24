import { Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';
import { calculatePagination, IPaginationOptions } from '../../../helpers/paginationHelper';
import prisma from '../../../shared/prisma';
import { batchSearchableFields } from './batch.constant';
import {
  IBatchFilterRequest,
  ICreateBatchPayload,
  IUpdateBatchPayload,
} from './batch.interface';

const createBatchIntoDB = async (payload: ICreateBatchPayload) => {
  const existingBatch = await prisma.batch.findUnique({
    where: { batchCode: payload.batchCode },
  });

  if (existingBatch) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Batch with code '${payload.batchCode}' already exists.`
    );
  }

  const result = await prisma.batch.create({
    data: {
      name: payload.name,
      batchCode: payload.batchCode.toUpperCase().trim(),
      track: payload.track,
      status: payload.status || 'ACTIVE',
    },
  });

  return result;
};

const getAllBatchesFromDB = async (
  filters: IBatchFilterRequest,
  paginationOptions: IPaginationOptions
) => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);

  const andConditions: Prisma.BatchWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: batchSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  const filterKeys = Object.keys(filterData) as (keyof typeof filterData)[];
  if (filterKeys.length > 0) {
    andConditions.push({
      AND: filterKeys.map((key) => ({
        [key]: {
          equals: filterData[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.BatchWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.batch.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? { [sortBy]: sortOrder }
        : { createdAt: 'desc' },
  });

  const total = await prisma.batch.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
    data: result,
  };
};

const getActiveBatchesFromDB = async () => {
  const activeBatches = await prisma.batch.findMany({
    where: { status: 'ACTIVE' },
    select: {
      id: true,
      name: true,
      batchCode: true,
      track: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return activeBatches.map((b) => ({
    label: `${b.name} (${b.batchCode})`,
    value: b.batchCode,
    track: b.track,
    id: b.id,
  }));
};

const getSingleBatchFromDB = async (id: string) => {
  const result = await prisma.batch.findUnique({
    where: { id },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Batch not found');
  }

  return result;
};

const updateBatchIntoDB = async (
  id: string,
  payload: IUpdateBatchPayload
) => {
  const isExist = await prisma.batch.findUnique({ where: { id } });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Batch not found');
  }

  if (payload.batchCode && payload.batchCode !== isExist.batchCode) {
    const duplicate = await prisma.batch.findUnique({
      where: { batchCode: payload.batchCode },
    });
    if (duplicate) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Batch code '${payload.batchCode}' is already taken.`
      );
    }
  }

  const updateData: Prisma.BatchUpdateInput = { ...payload };
  if (updateData.batchCode && typeof updateData.batchCode === 'string') {
    updateData.batchCode = updateData.batchCode.toUpperCase().trim();
  }

  const result = await prisma.batch.update({
    where: { id },
    data: updateData,
  });

  return result;
};

const deleteBatchFromDB = async (id: string) => {
  const isExist = await prisma.batch.findUnique({ where: { id } });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Batch not found');
  }

  // Defensive Check: Cannot delete if assignments are linked to this batch
  const linkedAssignmentsCount = await prisma.assignment.count({
    where: {
      OR: [{ batchId: isExist.batchCode }, { batchId: isExist.id }],
    },
  });

  if (linkedAssignmentsCount > 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Cannot delete batch: ${linkedAssignmentsCount} assignment(s) are actively linked to this batch.`
    );
  }

  const result = await prisma.batch.delete({
    where: { id },
  });

  return result;
};

export const BatchService = {
  createBatchIntoDB,
  getAllBatchesFromDB,
  getActiveBatchesFromDB,
  getSingleBatchFromDB,
  updateBatchIntoDB,
  deleteBatchFromDB,
};

