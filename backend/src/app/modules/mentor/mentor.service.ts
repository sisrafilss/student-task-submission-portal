import { Prisma, UserStatus } from '@prisma/client';
import httpStatus from 'http-status';
import { hashPassword } from '../../../helpers/passwordHelpers';
import { calculatePagination, IPaginationOptions } from '../../../helpers/paginationHelper';
import prisma from '../../../shared/prisma';
import ApiError from '../../errors/ApiError';
import {
  defaultMentorSpecializations,
  mentorSearchableFields,
} from './mentor.constant';
import { formatMentorsWithBatches, IRawMentor } from './mentor.helper';
import {
  ICreateMentorPayload,
  IMentorFilterRequest,
  IUpdateMentorPayload,
} from './mentor.interface';

const createMentorIntoDB = async (payload: ICreateMentorPayload) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email.toLowerCase().trim() },
  });

  if (existingUser) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'A user account with this email address already exists.'
    );
  }

  const mentorId =
    payload.mentorId?.trim() ||
    `MEN-${Date.now().toString().slice(-4)}`;

  const rawPassword =
    payload.temporaryPassword?.trim() ||
    `Pass@${Math.floor(100000 + Math.random() * 900000)}`;

  const hashedPassword = await hashPassword(rawPassword);

  const mentor = await prisma.user.create({
    data: {
      name: payload.name.trim(),
      email: payload.email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'MENTOR',
      status: payload.status || 'ACTIVE',
      needsPasswordChange: true,
      mentorId,
      contactNumber: payload.contactNumber,
      gender: payload.gender,
      expertise: payload.expertise,
      assignedBatchId: payload.assignedBatchId,
      bio: payload.bio,
      githubUsername: payload.githubUsername,
      linkedinUrl: payload.linkedinUrl,
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      needsPasswordChange: true,
      mentorId: true,
      contactNumber: true,
      gender: true,
      expertise: true,
      assignedBatchId: true,
      bio: true,
      githubUsername: true,
      linkedinUrl: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return {
    ...mentor,
    temporaryPassword: rawPassword,
  };
};

const getAllMentorsFromDB = async (
  filters: IMentorFilterRequest,
  paginationOptions: IPaginationOptions
) => {
  const { searchTerm, specialization, status } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);

  const andConditions: Prisma.UserWhereInput[] = [
    { role: 'MENTOR' },
    { isDeleted: false },
  ];

  if (searchTerm) {
    andConditions.push({
      OR: mentorSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (specialization && specialization !== 'All') {
    andConditions.push({
      expertise: { equals: specialization, mode: 'insensitive' },
    });
  }

  if (status && status !== 'All') {
    andConditions.push({
      status: status as UserStatus,
    });
  }

  const whereConditions: Prisma.UserWhereInput = { AND: andConditions };

  const [mentors, total] = await Promise.all([
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
        status: true,
        mentorId: true,
        contactNumber: true,
        gender: true,
        expertise: true,
        assignedBatchId: true,
        bio: true,
        avatarUrl: true,
        githubUsername: true,
        linkedinUrl: true,
        needsPasswordChange: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        submissionsAsMentor: {
          select: {
            id: true,
            status: true,
            marks: true,
          },
        },
        assignedMentorships: {
          select: {
            currentAssignedCount: true,
          },
        },
      },
    }),
    prisma.user.count({ where: whereConditions }),
  ]);

  const formattedMentors = await formatMentorsWithBatches(mentors as unknown as IRawMentor[]);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit) || 1,
    },
    data: formattedMentors,
  };
};

const getMentorSpecializationsFromDB = async () => {
  return defaultMentorSpecializations;
};

const getSingleMentorFromDB = async (id: string) => {
  const mentor = await prisma.user.findFirst({
    where: { id, role: 'MENTOR', isDeleted: false },
    select: {
      id: true,
      name: true,
      email: true,
      mentorId: true,
      contactNumber: true,
      gender: true,
      expertise: true,
      assignedBatchId: true,
      bio: true,
      status: true,
      avatarUrl: true,
      githubUsername: true,
      linkedinUrl: true,
      isDeleted: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!mentor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mentor record not found');
  }

  return mentor;
};

const updateMentorIntoDB = async (
  id: string,
  payload: IUpdateMentorPayload
) => {
  const isExist = await prisma.user.findFirst({
    where: { id, role: 'MENTOR', isDeleted: false },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mentor record not found');
  }

  const updateData: Prisma.UserUpdateInput = {};
  if (payload.name) updateData.name = payload.name.trim();
  if (payload.contactNumber) updateData.contactNumber = payload.contactNumber;
  if (payload.gender) updateData.gender = payload.gender;
  if (payload.expertise) updateData.expertise = payload.expertise;
  if (payload.assignedBatchId) updateData.assignedBatchId = payload.assignedBatchId;
  if (payload.status) updateData.status = payload.status;
  if (payload.bio !== undefined) updateData.bio = payload.bio;
  if (payload.githubUsername !== undefined) updateData.githubUsername = payload.githubUsername;
  if (payload.linkedinUrl !== undefined) updateData.linkedinUrl = payload.linkedinUrl;

  const result = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      mentorId: true,
      contactNumber: true,
      gender: true,
      expertise: true,
      assignedBatchId: true,
      status: true,
      bio: true,
      githubUsername: true,
      linkedinUrl: true,
      isDeleted: true,
      updatedAt: true,
    },
  });

  return result;
};

const deleteMentorFromDB = async (id: string) => {
  const isExist = await prisma.user.findFirst({
    where: { id, role: 'MENTOR', isDeleted: false },
  });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Mentor record not found');
  }

  const result = await prisma.user.update({
    where: { id },
    data: { isDeleted: true },
    select: {
      id: true,
      name: true,
      email: true,
      mentorId: true,
      isDeleted: true,
    },
  });

  return result;
};

export const MentorService = {
  createMentorIntoDB,
  getAllMentorsFromDB,
  getMentorSpecializationsFromDB,
  getSingleMentorFromDB,
  updateMentorIntoDB,
  deleteMentorFromDB,
};

