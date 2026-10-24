'use server';

import { zodValidator } from '@/lib/zodValidator';
import { IActionResult } from '@/types/action.interface';
import {
  IAssignment,
  IMentorSubmissionStats,
  IRubricScoreItem,
  ISubmission,
  ISubmissionListResponse,
} from '@/types/submission.interface';
import {
  reviewSubmissionValidationSchema,
  submissionValidationSchema,
} from '@/zod/submission.validation';
import { initialSubmissions, mockAssignments } from './mockSubmissions';

// In-memory runtime submission store
const submissionsStore: ISubmission[] = [...initialSubmissions];

// Rate limit map: studentId/session -> last submission timestamp (ms)
const rateLimitStore = new Map<string, number>();
const COOLDOWN_WINDOW_MS = 60 * 1000; // 60 seconds

export const getAvailableAssignments = async (): Promise<{
  success: boolean;
  data: IAssignment[];
}> => ({ success: true, data: mockAssignments });

export const checkAssignmentSubmissionStatus = async (
  assignmentId: string,
  studentId: string = 'std-1'
): Promise<{ alreadySubmitted: boolean; existingSubmission?: ISubmission }> => {
  const existing = submissionsStore.find((s) => s.studentId === studentId && s.assignmentId === assignmentId);
  return { alreadySubmitted: Boolean(existing), existingSubmission: existing };
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

  return { meta: { page, limit, total, totalPage }, data: paginatedData };
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
    studentId, studentName, studentEmail,
    assignmentId: payload.assignmentId,
    assignmentTitle: assignmentInfo?.title || 'Course Assignment Project',
    projectName: payload.projectName, repoUrl: payload.repoUrl, liveUrl: payload.liveUrl,
    description: payload.description, remarks: payload.remarks,
    status: 'PENDING', score: null, feedback: null, evaluatedBy: null, evaluatedAt: null,
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
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

export const getMentorSubmissionStats = async (): Promise<IMentorSubmissionStats> => {
  const totalSubmissions = submissionsStore.length;
  const totalPending = submissionsStore.filter(
    (s) => s.status === 'PENDING' || s.status === 'UNDER_REVIEW'
  ).length;
  const totalApproved = submissionsStore.filter(
    (s) => s.status === 'APPROVED' || s.status === 'EVALUATED'
  ).length;
  const totalRejected = submissionsStore.filter((s) => s.status === 'REJECTED').length;

  const scoredSubmissions = submissionsStore.filter(
    (s) => typeof s.score === 'number' && s.score !== null && (s.status === 'APPROVED' || s.status === 'EVALUATED')
  );

  const averageScore =
    scoredSubmissions.length > 0
      ? Math.round(
          (scoredSubmissions.reduce((acc, curr) => {
            const max = curr.maxScore || 100;
            return acc + ((curr.score || 0) / max) * 100;
          }, 0) /
            scoredSubmissions.length) *
            10
        ) / 10
      : 0;

  return {
    totalSubmissions,
    totalPending,
    totalApproved,
    totalRejected,
    averageScore,
  };
};

export const getMentorSubmissions = async (
  queryString: string = ''
): Promise<ISubmissionListResponse> => {
  const searchParams = new URLSearchParams(queryString);
  const searchTerm = searchParams.get('searchTerm')?.toLowerCase().trim() || '';
  const status = searchParams.get('status')?.trim() || '';
  const assignmentId = searchParams.get('assignmentId')?.trim() || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.max(1, parseInt(searchParams.get('limit') || '8', 10));

  let filtered = [...submissionsStore];

  if (searchTerm) {
    filtered = filtered.filter(
      (s) =>
        s.id.toLowerCase().includes(searchTerm) ||
        s.studentName.toLowerCase().includes(searchTerm) ||
        s.studentEmail.toLowerCase().includes(searchTerm) ||
        s.projectName.toLowerCase().includes(searchTerm) ||
        s.assignmentTitle.toLowerCase().includes(searchTerm) ||
        s.repoUrl.toLowerCase().includes(searchTerm)
    );
  }

  if (status && status !== 'ALL' && status !== 'All') {
    const upper = status.toUpperCase();
    if (upper === 'APPROVED') {
      filtered = filtered.filter((s) => s.status === 'APPROVED' || s.status === 'EVALUATED');
    } else {
      filtered = filtered.filter((s) => s.status.toUpperCase() === upper);
    }
  }

  if (assignmentId && assignmentId !== 'ALL' && assignmentId !== 'All') {
    filtered = filtered.filter((s) => s.assignmentId === assignmentId);
  }

  const total = filtered.length;
  const totalPage = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPage);
  const startIndex = (safePage - 1) * limit;
  const paginatedData = filtered.slice(startIndex, startIndex + limit);

  return { meta: { page: safePage, limit, total, totalPage }, data: paginatedData };
};

export const reviewSubmission = async (
  _prevState: IActionResult | null,
  formData: FormData
): Promise<IActionResult> => {
  const payload = {
    submissionId: formData.get('submissionId')?.toString() || '',
    actionType: formData.get('actionType')?.toString() as 'APPROVE' | 'REJECT',
    score: formData.get('score')?.toString() || undefined,
    feedback: formData.get('feedback')?.toString() || '',
    rejectionReason: formData.get('rejectionReason')?.toString() || undefined,
    rubricScoresJson: formData.get('rubricScoresJson')?.toString() || undefined,
  };

  const validation = zodValidator(payload, reviewSubmissionValidationSchema);
  if (!validation.success) {
    return {
      success: false,
      message: 'Please resolve the highlighted validation errors',
      errors: validation.errors,
    };
  }

  const targetIndex = submissionsStore.findIndex((s) => s.id === payload.submissionId);
  if (targetIndex === -1) {
    return {
      success: false,
      message: 'Submission record not found',
    };
  }

  let rubricScores: IRubricScoreItem[] | undefined;
  if (payload.rubricScoresJson) {
    try {
      rubricScores = JSON.parse(payload.rubricScoresJson);
    } catch {
      rubricScores = undefined;
    }
  }

  const isApproved = payload.actionType === 'APPROVE';
  const updatedSubmission: ISubmission = {
    ...submissionsStore[targetIndex],
    status: isApproved ? 'APPROVED' : 'REJECTED',
    score: isApproved ? Number(payload.score) : 0,
    feedback: payload.feedback,
    rejectionReason: isApproved ? null : payload.rejectionReason || null,
    rubricScores: rubricScores || submissionsStore[targetIndex].rubricScores,
    evaluatedBy: 'Senior Mentor',
    evaluatedAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  };

  submissionsStore[targetIndex] = updatedSubmission;

  return {
    success: true,
    message: isApproved
      ? 'Submission approved successfully!'
      : 'Submission rejected with feedback.',
    data: updatedSubmission,
  };
};

export const resetSubmissionsStoreForTesting = async () => {
  submissionsStore.length = 0;
  submissionsStore.push(...initialSubmissions);
};
