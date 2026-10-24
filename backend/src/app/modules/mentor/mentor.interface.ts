export interface ICreateMentorPayload {
  name: string;
  email: string;
  temporaryPassword?: string;
  mentorId?: string;
  contactNumber: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  expertise: string;
  assignedBatchId: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'BLOCKED';
  bio?: string;
  githubUsername?: string;
  linkedinUrl?: string;
}

export interface IUpdateMentorPayload {
  name?: string;
  contactNumber?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  expertise?: string;
  assignedBatchId?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'BLOCKED';
  bio?: string;
  githubUsername?: string;
  linkedinUrl?: string;
}

export interface IMentorFilterRequest {
  searchTerm?: string;
  specialization?: string;
  status?: string;
}

