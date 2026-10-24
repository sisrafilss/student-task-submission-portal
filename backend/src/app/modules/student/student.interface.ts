export interface IUpdateStudentPayload {
  name?: string;
  batchId?: string;
  enrolledTrack?: string;
  contactNumber?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  address?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'GRADUATED';
  githubUsername?: string;
  linkedinUrl?: string;
}

export interface IStudentFilterRequest {
  searchTerm?: string;
  batch?: string;
  status?: string;
}

