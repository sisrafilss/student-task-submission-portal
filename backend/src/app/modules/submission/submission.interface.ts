export interface IAssignMentorPayload {
  assignmentId: string;
  studentId: string;
  repoUrl: string;
  liveUrl?: string;
  notes?: string;
}

export interface IReviewSubmissionPayload {
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  marks?: number;
  feedback?: string;
}

export interface ISubmissionFilterRequest {
  searchTerm?: string;
  status?: string;
  assignmentId?: string;
  mentorId?: string;
  studentId?: string;
  batchId?: string;
}

export interface IStudentSubmissionFilterRequest {
  searchTerm?: string;
  status?: string;
  assignmentId?: string;
}

export interface IStudentSubmissionStats {
  totalSubmissions: number;
  totalPending: number;
  totalEvaluated: number;
}

