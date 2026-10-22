export type SubmissionStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'EVALUATED'
  | 'RESUBMISSION_REQUIRED';

export interface IRubricItem {
  criteria: string;
  marks: number;
  description?: string;
}

export interface IResourceLink {
  title: string;
  url: string;
  type?: 'FIGMA' | 'GITHUB' | 'DOCS' | 'API';
}

export interface IAssignment {
  id: string;
  title: string;
  courseTrack: string;
  batchId: string;
  batchName: string;
  deadline: string;
  maxScore: number;
  status: 'OPEN' | 'CLOSED';
  description?: string;
  requirements?: string[];
  rubrics?: IRubricItem[];
  resources?: IResourceLink[];
  studentSubmissionStatus?: SubmissionStatus | 'NOT_SUBMITTED';
  mySubmission?: ISubmission | null;
}

export interface ISubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  assignmentId: string;
  assignmentTitle: string;
  projectName: string;
  repoUrl: string;
  liveUrl: string;
  description: string;
  remarks?: string;
  status: SubmissionStatus;
  score?: number | null;
  feedback?: string | null;
  evaluatedBy?: string | null;
  evaluatedAt?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ISubmissionFilterOptions {
  searchTerm?: string;
  status?: string;
  assignmentId?: string;
  page?: number;
  limit?: number;
}

export interface ISubmissionPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface ISubmissionListResponse {
  meta: ISubmissionPaginationMeta;
  data: ISubmission[];
}

