import { Prisma, UserStatus } from '@prisma/client';
import httpStatus from 'http-status';
import { hashPassword } from '../../../helpers/passwordHelpers';
import { calculatePagination, IPaginationOptions } from '../../../helpers/paginationHelper';
import prisma from '../../../shared/prisma';
import ApiError from '../../errors/ApiError';
import { studentSearchableFields } from './student.constant';
import { formatStudentsWithBatches, IRawStudent } from './student.helper';
import {
  ICreateStudentPayload,
  IStudentFilterRequest,
  IUpdateStudentPayload,
} from './student.interface';

const createStudentIntoDB = async (payload: ICreateStudentPayload) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email.toLowerCase().trim() },
  });

  if (existingUser) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'A user account with this email address already exists.'
    );
  }

  const studentId =
    payload.studentId?.trim() ||
    `STD-${Date.now().toString().slice(-6)}`;

  const existingStudentId = await prisma.user.findFirst({
    where: { studentId },
  });

  if (existingStudentId) {
    throw new ApiError(
      httpStatus.CONFLICT,
      `Student ID '${studentId}' is already assigned to another student.`
    );
  }

  const hashedPassword = await hashPassword(payload.password);

  const student = await prisma.user.create({
    data: {
      name: payload.name.trim(),
      email: payload.email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'STUDENT',
      studentId,
      assignedBatchId: payload.batchId,
      enrolledTrack: payload.enrolledTrack,
      contactNumber: payload.contactNumber,
      gender: payload.gender,
      address: payload.address,
      status: payload.status || 'ACTIVE',
      githubUsername: payload.githubUsername,
      linkedinUrl: payload.linkedinUrl,
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      studentId: true,
      assignedBatchId: true,
      enrolledTrack: true,
      contactNumber: true,
      gender: true,
      address: true,
      status: true,
      githubUsername: true,
      linkedinUrl: true,
      isDeleted: true,
      password: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return student;
};

const getAllStudentsFromDB = async (
  filters: IStudentFilterRequest,
  paginationOptions: IPaginationOptions
) => {
  const { searchTerm, batch, status } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);

  const andConditions: Prisma.UserWhereInput[] = [
    { role: 'STUDENT' },
    { isDeleted: false },
  ];

  if (searchTerm) {
    andConditions.push({
      OR: studentSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (batch && batch !== 'All') {
    andConditions.push({
      assignedBatchId: { equals: batch },
    });
  }

  if (status && status !== 'All') {
    andConditions.push({
      status: status as UserStatus,
    });
  }

  const whereConditions: Prisma.UserWhereInput = { AND: andConditions };

  const [students, total] = await Promise.all([
    prisma.user.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy:
        sortBy && sortOrder
          ? { [sortBy]: sortOrder }
          : { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        studentId: true,
        assignedBatchId: true,
        enrolledTrack: true,
        contactNumber: true,
        gender: true,
        address: true,
        status: true,
        avatarUrl: true,
        githubUsername: true,
        linkedinUrl: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        submissionsAsStudent: {
          select: {
            marks: true,
            status: true,
          },
        },
      },
    }),
    prisma.user.count({ where: whereConditions }),
  ]);

  const formattedStudents = await formatStudentsWithBatches(students as unknown as IRawStudent[]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit) || 1,
    },
    data: formattedStudents,
  };
};

const getSingleStudentFromDB = async (id: string) => {
  const student = await prisma.user.findFirst({
    where: { id, role: 'STUDENT', isDeleted: false },
    select: {
      id: true,
      name: true,
      email: true,
      studentId: true,
      assignedBatchId: true,
      enrolledTrack: true,
      contactNumber: true,
      gender: true,
      address: true,
      status: true,
      avatarUrl: true,
      githubUsername: true,
      linkedinUrl: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
      submissionsAsStudent: {
        select: {
          id: true,
          assignmentId: true,
          marks: true,
          status: true,
          submittedAt: true,
        },
      },
    },
  });

  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student record not found');
  }

  return student;
};

const updateStudentIntoDB = async (
  id: string,
  payload: IUpdateStudentPayload
) => {
  const isExist = await prisma.user.findFirst({
    where: { id, role: 'STUDENT', isDeleted: false },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student record not found');
  }

  const updateData: Prisma.UserUpdateInput = {};
  if (payload.name) updateData.name = payload.name.trim();
  if (payload.batchId) updateData.assignedBatchId = payload.batchId;
  if (payload.enrolledTrack) updateData.enrolledTrack = payload.enrolledTrack;
  if (payload.contactNumber) updateData.contactNumber = payload.contactNumber;
  if (payload.gender) updateData.gender = payload.gender;
  if (payload.address !== undefined) updateData.address = payload.address;
  if (payload.status) updateData.status = payload.status;
  if (payload.githubUsername !== undefined) updateData.githubUsername = payload.githubUsername;
  if (payload.linkedinUrl !== undefined) updateData.linkedinUrl = payload.linkedinUrl;

  const result = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      studentId: true,
      assignedBatchId: true,
      enrolledTrack: true,
      contactNumber: true,
      gender: true,
      address: true,
      status: true,
      isDeleted: true,
      updatedAt: true,
    },
  });

  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const isExist = await prisma.user.findFirst({
    where: { id, role: 'STUDENT', isDeleted: false },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student record not found');
  }

  const result = await prisma.user.update({
    where: { id },
    data: { isDeleted: true },
    select: {
      id: true,
      name: true,
      email: true,
      studentId: true,
      isDeleted: true,
    },
  });

  return result;
};

export const StudentService = {
  createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  updateStudentIntoDB,
  deleteStudentFromDB,
};

