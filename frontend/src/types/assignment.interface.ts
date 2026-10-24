export interface IRubricItem {
  id?: string;
  criterion: string;
  maxMarks: number;
}

export interface IMentorQuotaInput {
  mentorId: string;
  mentorName?: string;
  maxQuota: number;
}

export interface ICreateAssignmentPayload {
  title: string;
  description: string;
  batchId: string;
  deadline: string;
  totalMarks: number;
  maxPerMentor: number;
  rubrics: IRubricItem[];
  mentorQuotas: IMentorQuotaInput[];
}

export interface IBackendAssignment {
  id: string;
  title: string;
  description: string;
  batchId: string;
  deadline: string;
  totalMarks: number;
  maxPerMentor: number;
  rubrics: IRubricItem[];
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdById: string;
  mentors?: {
    id: string;
    mentorId: string;
    maxQuota: number;
    currentAssignedCount: number;
    mentor: {
      id: string;
      name: string;
      email: string;
    };
  }[];
  _count?: {
    submissions: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IStudentBatchAssignment {
  id: string;
  title: string;
  description: string;
  batchId: string;
  deadline: string;
  totalMarks: number;
  rubrics: IRubricItem[];
  status: string;
  hasSubmitted: boolean;
  submissionId: string | null;
  submissionStatus: 'NOT_SUBMITTED' | 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  submittedAt: string | null;
  marks: number | null;
  feedback: string | null;
}

