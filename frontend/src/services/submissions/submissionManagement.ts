'use server';

import { zodValidator } from '@/lib/zodValidator';
import { IActionResult } from '@/types/action.interface';
import {
  IAssignment,
  ISubmission,
  ISubmissionListResponse,
} from '@/types/submission.interface';
import { submissionValidationSchema } from '@/zod/submission.validation';
import { initialSubmissions, mockAssignments } from './mockSubmissions';

// In-memory runtime submission store
const submissionsStore: ISubmission[] = [...initialSubmissions];

// Rate limit map: studentId/session -> last submission timestamp (ms)
const rateLimitStore = new Map<string, number>();
const COOLDOWN_WINDOW_MS = 60 * 1000; // 60 seconds

export const getAvailableAssignments = async (): Promise<{
  success: boolean;
  data: IAssignment[];
}> => {
  return {
    success: true,
    data: mockAssignments,
  };
};

export const checkAssignmentSubmissionStatus = async (
  assignmentId: string,
  studentId: string = 'std-1'
): Promise<{ alreadySubmitted: boolean; existingSubmission?: ISubmission }> => {
  const existing = submissionsStore.find(
    (s) => s.studentId === studentId && s.assignmentId === assignmentId
  );
  return {
    alreadySubmitted: Boolean(existing),
    existingSubmission: existing,
  };
};

export const getStudentSubmissions = async (
  queryString: string = '',
  studentId: string = 'std-1'
): Promise<ISubmissionListResponse> => {
  const searchParams = new URLSearchParams(queryString);
  const searchTerm = searchParams.get('searchTerm')?.toLowerCase().trim() || '';
  const status = searchParams.get('status')?.trim() || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '8', 10);

  let filtered = submissionsStore.filter((s) => s.studentId === studentId);

  if (searchTerm) {
    filtered = filtered.filter(
      (s) =>
        s.projectName.toLowerCase().includes(searchTerm) ||
        s.assignmentTitle.toLowerCase().includes(searchTerm) ||
        s.repoUrl.toLowerCase().includes(searchTerm)
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

export const submitProject = async (
  _prevState: IActionResult | null,
  formData: FormData
): Promise<IActionResult> => {
  const studentId = formData.get('studentId')?.toString() || 'std-1';
  const studentName = formData.get('studentName')?.toString() || 'Tanvir Hossain';
  const studentEmail = formData.get('studentEmail')?.toString() || 'tanvir.hossain@example.com';
  const now = Date.now();

  // 1. Anti-Spam / Rate Limit Verification (60 seconds cooldown)
  const lastSubmission = rateLimitStore.get(studentId) || 0;
  const elapsed = now - lastSubmission;
  if (elapsed < COOLDOWN_WINDOW_MS) {
    const remainingSec = Math.ceil((COOLDOWN_WINDOW_MS - elapsed) / 1000);
    return {
      success: false,
      message: `Rate limit active: Please wait ${remainingSec} seconds before submitting another project.`,
    };
  }

  // 2. Extract and sanitize payload
  const payload = {
    assignmentId: formData.get('assignmentId')?.toString() || '',
    projectName: formData.get('projectName')?.toString() || '',
    repoUrl: formData.get('repoUrl')?.toString() || '',
    liveUrl: formData.get('liveUrl')?.toString() || '',
    description: formData.get('description')?.toString() || '',
    remarks: formData.get('remarks')?.toString() || undefined,
  };

  // 3. Robust Zod Validation
  const validation = zodValidator(payload, submissionValidationSchema);
  if (!validation.success) {
    return {
      success: false,
      message: 'Please resolve the highlighted validation errors',
      errors: validation.errors,
    };
  }

  // 4. Duplicate Submission Guard (Prevent duplicate submission for same assignment)
  const isDuplicate = submissionsStore.some(
    (s) => s.studentId === studentId && s.assignmentId === payload.assignmentId
  );
  if (isDuplicate) {
    return {
      success: false,
      message: 'Duplicate submission detected: You have already submitted a project for this assignment. Please check your submission history.',
    };
  }

  // 5. Create new Submission
  const assignmentInfo = mockAssignments.find((a) => a.id === payload.assignmentId);
  const newSubmission: ISubmission = {
    id: `sub-${Date.now()}`,
    studentId,
    studentName,
    studentEmail,
    assignmentId: payload.assignmentId,
    assignmentTitle: assignmentInfo?.title || 'Course Assignment Project',
    projectName: payload.projectName,
    repoUrl: payload.repoUrl,
    liveUrl: payload.liveUrl,
    description: payload.description,
    remarks: payload.remarks,
    status: 'PENDING',
    score: null,
    feedback: null,
    evaluatedBy: null,
    evaluatedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  submissionsStore.unshift(newSubmission);

  // 6. Record rate limit timestamp
  rateLimitStore.set(studentId, now);

  return {
    success: true,
    message: 'Project submitted successfully! It is now queued for mentor evaluation.',
    data: newSubmission,
  };
};

export const resetRateLimitForTesting = async (studentId = 'std-1') => {
  rateLimitStore.delete(studentId);
};
