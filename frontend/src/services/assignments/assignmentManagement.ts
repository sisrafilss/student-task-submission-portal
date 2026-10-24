'use server';

import { serverFetch } from '@/lib/server-fetch';
import { zodValidator } from '@/lib/zodValidator';
import { IActionResult } from '@/types/action.interface';
import {
  IBackendAssignment,
  IMentorQuotaInput,
  IRubricItem,
  IStudentBatchAssignment,
} from '@/types/assignment.interface';
import { IAssignment, SubmissionStatus } from '@/types/submission.interface';
import { createAssignmentValidationSchema } from '@/zod/assignment.validation';
import { initialSubmissions, mockAssignments } from '../submissions/mockSubmissions';

export interface IAssignmentStats {
  totalCount: number;
  actionRequiredCount: number;
  underReviewCount: number;
  evaluatedCount: number;
}

export interface IStudentAssignmentsResponse {
  assignments: IAssignment[];
  stats: IAssignmentStats;
}

export const createAssignmentAction = async (
  _prevState: IActionResult | null,
  formData: FormData
): Promise<IActionResult> => {
  try {
    const rawRubrics = formData.get('rubricsJson')?.toString();
    const rawMentorQuotas = formData.get('mentorQuotasJson')?.toString();

    let rubrics: IRubricItem[] = [];
    if (rawRubrics) {
      try {
        rubrics = JSON.parse(rawRubrics);
      } catch {
        rubrics = [];
      }
    }

    let mentorQuotas: IMentorQuotaInput[] = [];
    if (rawMentorQuotas) {
      try {
        mentorQuotas = JSON.parse(rawMentorQuotas);
      } catch {
        mentorQuotas = [];
      }
    }

    const payload = {
      title: formData.get('title')?.toString() || '',
      description: formData.get('description')?.toString() || '',
      batchId: formData.get('batchId')?.toString() || '',
      deadline: formData.get('deadline')?.toString() || '',
      totalMarks: Number(formData.get('totalMarks')) || 100,
      maxPerMentor: Number(formData.get('maxPerMentor')) || 10,
      rubrics,
      mentorQuotas,
    };

    const validation = zodValidator(payload, createAssignmentValidationSchema);
    if (!validation.success) {
      return {
        success: false,
        message: 'Please resolve the highlighted validation errors',
        errors: validation.errors,
        data: payload,
      };
    }

    const res = await serverFetch.post('/assignments', {
      body: JSON.stringify(payload),
    });

    const resData = await res.json();

    if (!res.ok || !resData.success) {
      return {
        success: false,
        message: resData.message || 'Failed to create assignment',
        errors: resData.errorMessages,
      };
    }

    return {
      success: true,
      message: resData.message || 'Assignment created successfully',
      data: resData.data,
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'An unexpected error occurred',
    };
  }
};

export const getAdminAssignments = async (
  queryString = ''
): Promise<{
  success: boolean;
  message?: string;
  data: IBackendAssignment[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}> => {
  try {
    const res = await serverFetch.get(`/assignments?${queryString}`, {
      cache: 'no-store',
    });
    const result = await res.json();
    if (!res.ok || !result.success) {
      return {
        success: false,
        message: result.message,
        data: [],
        meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
      };
    }
    return {
      success: true,
      data: result.data || [],
      meta: result.meta || { page: 1, limit: 10, total: 0, totalPages: 1 },
    };
  } catch {
    return {
      success: false,
      data: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
    };
  }
};

export const getStudentBatchAssignments = async (): Promise<{
  success: boolean;
  message?: string;
  data: IStudentBatchAssignment[];
}> => {
  try {
    const res = await serverFetch.get('/assignments/my-batch', {
      cache: 'no-store',
    });
    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, message: result.message, data: [] };
    }
    return { success: true, data: result.data || [] };
  } catch {
    return { success: false, data: [] };
  }
};

export const getAvailableMentorsList = async (): Promise<{
  success: boolean;
  data: { id: string; name: string; email: string; expertise?: string }[];
}> => {
  try {
    const res = await serverFetch.get('/assignments/active-mentors', {
      cache: 'no-store',
    });
    const result = await res.json();
    if (!res.ok || !result.success) {
      return { success: false, data: [] };
    }
    return { success: true, data: result.data || [] };
  } catch {
    return { success: false, data: [] };
  }
};

export async function getStudentAssignmentsWithStatus(
  searchQuery = '',
  studentId = 'std-1'
): Promise<IStudentAssignmentsResponse> {
  const params = new URLSearchParams(searchQuery);
  const searchTerm = (params.get('searchTerm') || '').toLowerCase().trim();
  const statusFilter = params.get('status') || '';
  const trackFilter = params.get('courseTrack') || '';

  const studentSubmissions = initialSubmissions.filter((sub) => sub.studentId === studentId);

  const allEnrichedAssignments: IAssignment[] = mockAssignments.map((assignment) => {
    const existingSubmission = studentSubmissions.find((sub) => sub.assignmentId === assignment.id);
    const submissionStatus: SubmissionStatus | 'NOT_SUBMITTED' = existingSubmission
      ? existingSubmission.status
      : 'NOT_SUBMITTED';

    return {
      ...assignment,
      studentSubmissionStatus: submissionStatus,
      mySubmission: existingSubmission || null,
    };
  });

  const stats: IAssignmentStats = {
    totalCount: allEnrichedAssignments.length,
    actionRequiredCount: allEnrichedAssignments.filter((a) => a.studentSubmissionStatus === 'NOT_SUBMITTED').length,
    underReviewCount: allEnrichedAssignments.filter(
      (a) => a.studentSubmissionStatus === 'PENDING' || a.studentSubmissionStatus === 'UNDER_REVIEW'
    ).length,
    evaluatedCount: allEnrichedAssignments.filter((a) => a.studentSubmissionStatus === 'EVALUATED').length,
  };

  let filtered = allEnrichedAssignments;
  if (searchTerm) {
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(searchTerm) ||
        (a.description && a.description.toLowerCase().includes(searchTerm)) ||
        a.courseTrack.toLowerCase().includes(searchTerm) ||
        a.batchName.toLowerCase().includes(searchTerm)
    );
  }

  if (statusFilter && statusFilter !== 'ALL') {
    filtered = filtered.filter((a) => a.studentSubmissionStatus === statusFilter);
  }

  if (trackFilter && trackFilter !== 'ALL') {
    filtered = filtered.filter((a) => a.courseTrack === trackFilter);
  }

  return { assignments: filtered, stats };
}

export async function getAssignmentById(id: string): Promise<IAssignment | null> {
  const found = mockAssignments.find((a) => a.id === id);
  if (!found) return null;
  return found;
}
