'use server';

import { zodValidator } from '@/lib/zodValidator';
import { IActionResult } from '@/types/action.interface';
import { IBatch, IStudent, IStudentListResponse, StudentGender, StudentStatus } from '@/types/student.interface';
import {
  createStudentValidationSchema,
  updateStudentValidationSchema,
} from '@/zod/student.validation';
import { initialBatches, initialStudents } from './mockStudents';

// In-memory runtime student store for development view design
const studentsStore: IStudent[] = [...initialStudents];

export const getBatches = async (): Promise<{ success: boolean; data: IBatch[] }> => {
  return {
    success: true,
    data: initialBatches,
  };
};

export const getStudents = async (queryString: string = ''): Promise<IStudentListResponse> => {
  const searchParams = new URLSearchParams(queryString);
  const searchTerm = searchParams.get('searchTerm')?.toLowerCase().trim() || '';
  const batch = searchParams.get('batch')?.trim() || '';
  const status = searchParams.get('status')?.trim() || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '8', 10);

  let filtered = studentsStore.filter((s) => !s.isDeleted);

  if (searchTerm) {
    filtered = filtered.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm) ||
        s.email.toLowerCase().includes(searchTerm) ||
        s.studentId.toLowerCase().includes(searchTerm)
    );
  }

  if (batch && batch !== 'All') {
    filtered = filtered.filter(
      (s) => s.batchId === batch || s.batchName.toLowerCase().includes(batch.toLowerCase())
    );
  }

  if (status && status !== 'All') {
    filtered = filtered.filter((s) => s.status === status);
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

export const createStudent = async (
  _prevState: IActionResult | null,
  formData: FormData
): Promise<IActionResult> => {
  const payload = {
    name: formData.get('name')?.toString() || '',
    email: formData.get('email')?.toString() || '',
    password: formData.get('password')?.toString() || '',
    confirmPassword: formData.get('confirmPassword')?.toString() || '',
    studentId: formData.get('studentId')?.toString() || '',
    batchId: formData.get('batchId')?.toString() || '',
    enrolledTrack: formData.get('enrolledTrack')?.toString() || '',
    contactNumber: formData.get('contactNumber')?.toString() || '',
    gender: (formData.get('gender')?.toString() as StudentGender) || 'MALE',
    address: formData.get('address')?.toString() || undefined,
    status: (formData.get('status')?.toString() as StudentStatus) || 'ACTIVE',
    githubUsername: formData.get('githubUsername')?.toString() || undefined,
    linkedinUrl: formData.get('linkedinUrl')?.toString() || undefined,
  };

  const validation = zodValidator(payload, createStudentValidationSchema);
  if (!validation.success) {
    return {
      success: false,
      message: 'Please resolve form validation errors',
      errors: validation.errors,
    };
  }

  const batchInfo = initialBatches.find((b) => b.id === payload.batchId);
  const newStudent: IStudent = {
    id: `std-${Date.now()}`,
    name: payload.name,
    email: payload.email,
    studentId: payload.studentId,
    avatarUrl: null,
    batchId: payload.batchId,
    batchName: batchInfo?.name || payload.batchId,
    enrolledTrack: payload.enrolledTrack,
    contactNumber: payload.contactNumber,
    gender: payload.gender,
    address: payload.address,
    status: payload.status,
    githubUsername: payload.githubUsername,
    linkedinUrl: payload.linkedinUrl,
    totalSubmissions: 0,
    averageScore: 0,
    isDeleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  studentsStore.unshift(newStudent);

  return {
    success: true,
    message: 'Student created successfully!',
    data: newStudent,
  };
};

export const updateStudent = async (
  studentId: string,
  _prevState: IActionResult | null,
  formData: FormData
): Promise<IActionResult> => {
  const payload = {
    name: formData.get('name')?.toString() || '',
    email: formData.get('email')?.toString() || '',
    studentId: formData.get('studentId')?.toString() || '',
    batchId: formData.get('batchId')?.toString() || '',
    enrolledTrack: formData.get('enrolledTrack')?.toString() || '',
    contactNumber: formData.get('contactNumber')?.toString() || '',
    gender: (formData.get('gender')?.toString() as StudentGender) || 'MALE',
    address: formData.get('address')?.toString() || undefined,
    status: (formData.get('status')?.toString() as StudentStatus) || 'ACTIVE',
    githubUsername: formData.get('githubUsername')?.toString() || undefined,
    linkedinUrl: formData.get('linkedinUrl')?.toString() || undefined,
  };

  const validation = zodValidator(payload, updateStudentValidationSchema);
  if (!validation.success) {
    return {
      success: false,
      message: 'Please resolve form validation errors',
      errors: validation.errors,
    };
  }

  const existingIndex = studentsStore.findIndex((s) => s.id === studentId);
  if (existingIndex === -1) {
    return {
      success: false,
      message: 'Student record not found',
    };
  }

  const batchInfo = initialBatches.find((b) => b.id === payload.batchId);
  studentsStore[existingIndex] = {
    ...studentsStore[existingIndex],
    ...payload,
    batchName: batchInfo?.name || studentsStore[existingIndex].batchName,
    updatedAt: new Date().toISOString(),
  };

  return {
    success: true,
    message: 'Student details updated successfully!',
    data: studentsStore[existingIndex],
  };
};

export const deleteStudent = async (studentId: string): Promise<IActionResult> => {
  const student = studentsStore.find((s) => s.id === studentId);
  if (!student) {
    return {
      success: false,
      message: 'Student record not found',
    };
  }

  student.isDeleted = true;
  student.updatedAt = new Date().toISOString();

  return {
    success: true,
    message: 'Student deleted successfully',
    data: student,
  };
};

