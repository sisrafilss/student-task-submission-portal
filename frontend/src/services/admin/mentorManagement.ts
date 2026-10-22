'use server';

import { zodValidator } from '@/lib/zodValidator';
import { initialBatches } from '@/services/admin/mockStudents';
import { IActionResult } from '@/types/action.interface';
import {
  IMentor,
  IMentorBatch,
  IMentorListResponse,
  MentorGender,
  MentorStatus,
} from '@/types/mentor.interface';
import {
  createMentorValidationSchema,
  updateMentorValidationSchema,
} from '@/zod/mentor.validation';
import { initialMentors, mentorSpecializations } from './mockMentors';

// In-memory runtime mentor store for admin view design
const mentorsStore: IMentor[] = [...initialMentors];

export const getMentorSpecializationsList = async (): Promise<{
  success: boolean;
  data: { label: string; value: string }[];
}> => {
  return {
    success: true,
    data: mentorSpecializations,
  };
};

export const getMentors = async (queryString: string = ''): Promise<IMentorListResponse> => {
  const searchParams = new URLSearchParams(queryString);
  const searchTerm = searchParams.get('searchTerm')?.toLowerCase().trim() || '';
  const specialization = searchParams.get('specialization')?.trim() || '';
  const status = searchParams.get('status')?.trim() || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '8', 10);

  let filtered = mentorsStore.filter((m) => !m.isDeleted);

  if (searchTerm) {
    filtered = filtered.filter(
      (m) =>
        m.name.toLowerCase().includes(searchTerm) ||
        m.email.toLowerCase().includes(searchTerm) ||
        m.mentorId.toLowerCase().includes(searchTerm)
    );
  }

  if (specialization && specialization !== 'All') {
    filtered = filtered.filter((m) => m.expertise === specialization);
  }

  if (status && status !== 'All') {
    filtered = filtered.filter((m) => m.status === status);
  }

  const total = filtered.length;
  const totalPage = Math.max(1, Math.ceil(total / limit));
  const startIndex = (page - 1) * limit;
  const paginatedData = filtered.slice(startIndex, startIndex + limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: paginatedData,
  };
};

export const getMentorById = async (id: string): Promise<IMentor | null> => {
  return mentorsStore.find((m) => m.id === id && !m.isDeleted) || null;
};

export const createMentor = async (
  _prevState: IActionResult | null,
  formData: FormData
): Promise<IActionResult> => {
  const payload = {
    name: formData.get('name')?.toString() || '',
    email: formData.get('email')?.toString() || '',
    temporaryPassword: formData.get('temporaryPassword')?.toString() || '',
    contactNumber: formData.get('contactNumber')?.toString() || '',
    gender: (formData.get('gender')?.toString() as MentorGender) || 'MALE',
    expertise: formData.get('expertise')?.toString() || '',
    status: (formData.get('status')?.toString() as MentorStatus) || 'ACTIVE',
    assignedBatchId: formData.get('assignedBatchId')?.toString() || '',
    bio: formData.get('bio')?.toString() || undefined,
    githubUsername: formData.get('githubUsername')?.toString() || undefined,
    linkedinUrl: formData.get('linkedinUrl')?.toString() || undefined,
  };

  const validation = zodValidator(payload, createMentorValidationSchema);
  if (!validation.success) {
    return {
      success: false,
      message: 'Please resolve form validation errors',
      errors: validation.errors,
    };
  }

  const batchInfo = initialBatches.find((b) => b.id === payload.assignedBatchId);
  const assignedBatches: IMentorBatch[] = batchInfo
    ? [{ id: batchInfo.id, name: batchInfo.name }]
    : [{ id: 'batch-10', name: 'Batch 10 - Web Development' }];

  const nextIndex = mentorsStore.length + 1;
  const generatedMentorId = `MEN-${String(nextIndex).padStart(3, '0')}`;

  const newMentor: IMentor = {
    id: `men-${Date.now()}`,
    name: payload.name,
    email: payload.email,
    mentorId: generatedMentorId,
    avatarUrl: null,
    contactNumber: payload.contactNumber,
    gender: payload.gender,
    expertise: payload.expertise,
    assignedBatches,
    status: payload.status,
    totalAssignedStudents: 0,
    totalEvaluations: 0,
    rating: 5.0,
    githubUsername: payload.githubUsername,
    linkedinUrl: payload.linkedinUrl,
    bio: payload.bio,
    temporaryPassword: payload.temporaryPassword,
    mustChangePassword: true,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mentorsStore.unshift(newMentor);

  return {
    success: true,
    message: `Mentor added successfully! Mentor ID: ${generatedMentorId}`,
    data: newMentor,
  };
};

export const updateMentor = async (
  mentorId: string,
  _prevState: IActionResult | null,
  formData: FormData
): Promise<IActionResult> => {
  const payload = {
    name: formData.get('name')?.toString() || '',
    contactNumber: formData.get('contactNumber')?.toString() || '',
    gender: (formData.get('gender')?.toString() as MentorGender) || 'MALE',
    expertise: formData.get('expertise')?.toString() || '',
    status: (formData.get('status')?.toString() as MentorStatus) || 'ACTIVE',
    assignedBatchId: formData.get('assignedBatchId')?.toString() || '',
    bio: formData.get('bio')?.toString() || undefined,
    githubUsername: formData.get('githubUsername')?.toString() || undefined,
    linkedinUrl: formData.get('linkedinUrl')?.toString() || undefined,
    email: formData.get('email')?.toString() || undefined,
    mentorId: formData.get('mentorId')?.toString() || undefined,
  };

  const validation = zodValidator(payload, updateMentorValidationSchema);
  if (!validation.success) {
    return {
      success: false,
      message: 'Please resolve form validation errors',
      errors: validation.errors,
    };
  }

  const existingIndex = mentorsStore.findIndex((m) => m.id === mentorId);
  if (existingIndex === -1) {
    return {
      success: false,
      message: 'Mentor record not found',
    };
  }

  const batchInfo = initialBatches.find((b) => b.id === payload.assignedBatchId);
  const assignedBatches: IMentorBatch[] = batchInfo
    ? [{ id: batchInfo.id, name: batchInfo.name }]
    : mentorsStore[existingIndex].assignedBatches;

  mentorsStore[existingIndex] = {
    ...mentorsStore[existingIndex],
    name: payload.name,
    contactNumber: payload.contactNumber,
    gender: payload.gender,
    expertise: payload.expertise,
    status: payload.status,
    assignedBatches,
    bio: payload.bio,
    githubUsername: payload.githubUsername,
    linkedinUrl: payload.linkedinUrl,
    updatedAt: new Date().toISOString(),
  };

  return {
    success: true,
    message: 'Mentor details updated successfully!',
    data: mentorsStore[existingIndex],
  };
};

export const deleteMentor = async (mentorId: string): Promise<IActionResult> => {
  const mentor = mentorsStore.find((m) => m.id === mentorId);
  if (!mentor) {
    return {
      success: false,
      message: 'Mentor record not found',
    };
  }

  mentor.isDeleted = true;
  mentor.updatedAt = new Date().toISOString();

  return {
    success: true,
    message: 'Mentor removed successfully',
    data: mentor,
  };
};

