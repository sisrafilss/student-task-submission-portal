export interface IRubricItem {
  criterion: string;
  maxMarks: number;
}

export interface IMentorQuotaInput {
  mentorId: string;
  maxQuota?: number;
}

export interface ICreateAssignmentPayload {
  title: string;
  description: string;
  batchId: string;
  deadline: string | Date;
  totalMarks?: number;
  maxPerMentor?: number;
  rubrics?: IRubricItem[];
  mentorQuotas?: IMentorQuotaInput[];
}

export interface IUpdateAssignmentPayload {
  title?: string;
  description?: string;
  batchId?: string;
  deadline?: string | Date;
  totalMarks?: number;
  maxPerMentor?: number;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  rubrics?: IRubricItem[];
  mentorQuotas?: IMentorQuotaInput[];
}

export interface IUpdateAssignmentMentorsPayload {
  mentors: {
    mentorId: string;
    maxQuota: number;
  }[];
}

export interface IAssignmentFilterRequest {
  searchTerm?: string;
  batchId?: string;
  status?: string;
}

export interface IStudentAssignmentItem {
  id: string;
  title: string;
  description: string;
  batchId: string;
  batchName?: string;
  courseTrack?: string;
  deadline: Date;
  totalMarks: number;
  rubrics: unknown;
  status: string;
  hasSubmitted: boolean;
  submissionId: string | null;
  submissionStatus: string;
  submittedAt: Date | null;
  marks: number | null;
  feedback: string | null;
}

