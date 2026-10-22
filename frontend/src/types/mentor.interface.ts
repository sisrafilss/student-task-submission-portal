export type MentorStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'BLOCKED';
export type MentorGender = 'MALE' | 'FEMALE' | 'OTHER';

export interface IMentorBatch {
  id: string;
  name: string;
}

export interface IMentor {
  id: string;
  name: string;
  email: string;
  mentorId: string;
  avatarUrl?: string | null;
  contactNumber: string;
  gender: MentorGender;
  expertise: string;
  assignedBatches: IMentorBatch[];
  status: MentorStatus;
  totalAssignedStudents: number;
  totalEvaluations: number;
  rating?: number;
  githubUsername?: string;
  linkedinUrl?: string;
  bio?: string;
  temporaryPassword?: string;
  mustChangePassword?: boolean;
  isDeleted: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IMentorFilterOptions {
  searchTerm?: string;
  specialization?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface IMentorPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface IMentorListResponse {
  meta: IMentorPaginationMeta;
  data: IMentor[];
}

