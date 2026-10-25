import { IAssignment, IRubricItem, ISubmission } from '@/types/submission.interface';
import { initialSubmissions } from './mockSubmissions';

export const submissionsStore: ISubmission[] = [...initialSubmissions];
export const rateLimitStore = new Map<string, number>();
export const COOLDOWN_WINDOW_MS = 60 * 1000;

export const resetSubmissionsStoreForTesting = async () => {
  submissionsStore.length = 0;
  submissionsStore.push(...initialSubmissions);
};

export interface IRawAssignment {
  id: string;
  title: string;
  totalMarks: number;
  batchId: string;
  status: string;
  deadline: string;
  description?: string;
}

export const mapAssignment = (item: IRawAssignment): IAssignment => ({
  id: item.id,
  title: item.title,
  courseTrack: 'Full Stack Web',
  batchId: item.batchId,
  batchName: item.batchId,
  deadline: item.deadline,
  maxScore: item.totalMarks,
  status: (item.status === 'PUBLISHED' ? 'OPEN' : item.status) as IAssignment['status'],
  description: item.description || '',
  requirements: [],
  rubrics: [],
});

export interface IRawSubmissionItem {
  id: string;
  studentId?: string;
  student?: { id: string; name: string; email: string };
  mentorId?: string;
  mentor?: { id: string; name: string; email: string };
  assignmentId?: string;
  assignment?: {
    id: string;
    title: string;
    totalMarks: number;
    rubrics?: Array<{ id?: string; criterion?: string; criteria?: string; maxMarks?: number; marks?: number }>;
  };
  repoUrl: string;
  liveUrl?: string;
  notes?: string;
  status: string;
  marks?: number;
  feedback?: string;
  submittedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const mapSubmission = (item: IRawSubmissionItem): ISubmission => {
  const rawRubrics = item.assignment?.rubrics;
  const rubrics: IRubricItem[] = Array.isArray(rawRubrics)
    ? rawRubrics.map((r) => ({
        criteria: r.criterion || r.criteria || 'Criterion',
        marks: Number(r.maxMarks ?? r.marks ?? 0),
      }))
    : [];

  return {
    id: item.id,
    studentId: item.studentId || item.student?.id || '',
    studentName: item.student?.name || 'Student',
    studentEmail: item.student?.email || '',
    assignmentId: item.assignmentId || item.assignment?.id || '',
    assignmentTitle: item.assignment?.title || 'Course Assignment',
    projectName: item.assignment?.title || 'Project Deliverable',
    repoUrl: item.repoUrl,
    liveUrl: item.liveUrl || '',
    description: item.notes || '',
    remarks: item.notes || '',
    status: (item.status === 'APPROVED' ? 'APPROVED' : item.status) as ISubmission['status'],
    score: item.marks ?? null,
    feedback: item.feedback ?? null,
    mentorId: item.mentorId || item.mentor?.id || null,
    mentorName: item.mentor?.name || null,
    mentorEmail: item.mentor?.email || null,
    maxScore: item.assignment?.totalMarks || 100,
    rubrics,
    createdAt: item.submittedAt || item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
  };
};

