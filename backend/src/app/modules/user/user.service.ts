import httpStatus from 'http-status';
import prisma from '../../../shared/prisma';
import ApiError from '../../errors/ApiError';
import {
  deleteFromCloudinary,
  extractCloudinaryPublicId,
  uploadToCloudinary,
} from '../../../helpers/cloudinaryHelper';
import { IUpdateUserProfilePayload, IUserProfileResponse } from './user.interface';

const getMe = async (userId: string): Promise<IUserProfileResponse> => {
  const user = await prisma.user.findUnique({
    where: { id: userId, isDeleted: false },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User account not found');
  }

  let assignedBatch = null;
  if (user.assignedBatchId) {
    const batch = await prisma.batch.findUnique({
      where: { id: user.assignedBatchId },
      select: { id: true, name: true, batchCode: true },
    });
    if (batch) {
      assignedBatch = {
        id: batch.id,
        batchName: batch.name,
        batchNumber: batch.batchCode,
      };
    }
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
    avatarUrl: user.avatarUrl,
    contactNumber: user.contactNumber,
    bio: user.bio,
    gender: user.gender,
    address: user.address,
    githubUsername: user.githubUsername,
    linkedinUrl: user.linkedinUrl,
    portfolioUrl: user.portfolioUrl,
    studentId: user.studentId,
    mentorId: user.mentorId,
    enrolledTrack: user.enrolledTrack,
    expertise: user.expertise,
    assignedBatchId: user.assignedBatchId,
    assignedBatch,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const updateProfile = async (
  userId: string,
  payload: IUpdateUserProfilePayload
): Promise<IUserProfileResponse> => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId, isDeleted: false },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // If avatarUrl changed and old one was in Cloudinary, delete old asset
  if (payload.avatarUrl && payload.avatarUrl !== existingUser.avatarUrl) {
    const oldPublicId = extractCloudinaryPublicId(existingUser.avatarUrl);
    if (oldPublicId) {
      await deleteFromCloudinary(oldPublicId, 'image');
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: payload.name !== undefined ? payload.name.trim() : undefined,
      contactNumber:
        payload.contactNumber !== undefined ? payload.contactNumber.trim() : undefined,
      bio: payload.bio !== undefined ? payload.bio.trim() : undefined,
      avatarUrl: payload.avatarUrl !== undefined ? payload.avatarUrl.trim() : undefined,
      githubUsername:
        payload.githubUsername !== undefined ? payload.githubUsername.trim() : undefined,
      linkedinUrl:
        payload.linkedinUrl !== undefined ? payload.linkedinUrl.trim() : undefined,
      portfolioUrl:
        payload.portfolioUrl !== undefined ? payload.portfolioUrl.trim() : undefined,
    },
  });

  return getMe(updatedUser.id);
};

const updateAvatar = async (
  userId: string,
  fileBuffer: Buffer,
  originalName: string
): Promise<{ avatarUrl: string }> => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId, isDeleted: false },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Hard-delete existing Cloudinary avatar if one exists
  if (existingUser.avatarUrl) {
    const oldPublicId = extractCloudinaryPublicId(existingUser.avatarUrl);
    if (oldPublicId) {
      await deleteFromCloudinary(oldPublicId, 'image');
    }
  }

  // Upload new image buffer to Cloudinary
  const uploaded = await uploadToCloudinary(fileBuffer, originalName);

  // Update User.avatarUrl in database
  await prisma.user.update({
    where: { id: userId },
    data: { avatarUrl: uploaded.url },
  });

  return { avatarUrl: uploaded.url };
};

export const UserService = {
  getMe,
  updateProfile,
  updateAvatar,
};
