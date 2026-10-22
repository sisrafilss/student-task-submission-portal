export type StudentStatus = 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'GRADUATED';
export type StudentGender = 'MALE' | 'FEMALE' | 'OTHER';

export interface IAssignedMentor {
  id: string;
  name: string;
  email: string;
}

export interface IStudent {
  id: string;
  name: string;
  email: string;
  studentId: string;
  avatarUrl?: string | null;
  batchId: string;
  batchName: string;
  enrolledTrack: string;
  contactNumber: string;
  gender: StudentGender;
  address?: string;
  status: StudentStatus;
  githubUsername?: string;
  linkedinUrl?: string;
  totalSubmissions?: number;
  averageScore?: number;
  assignedMentor?: IAssignedMentor;
  isDeleted: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IBatch {
  id: string;
  name: string;
  track: string;
  status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED';
}

export interface IStudentFilterOptions {
  searchTerm?: string;
  batch?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface IStudentPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface IStudentListResponse {
  meta: IStudentPaginationMeta;
  data: IStudent[];
}

