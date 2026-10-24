export interface IUpdateUserProfilePayload {
  name?: string;
  contactNumber?: string;
  bio?: string;
  githubUsername?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  avatarUrl?: string;
}

export interface IUserProfileResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  avatarUrl?: string | null;
  contactNumber?: string | null;
  bio?: string | null;
  gender?: string | null;
  address?: string | null;
  githubUsername?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  studentId?: string | null;
  mentorId?: string | null;
  enrolledTrack?: string | null;
  expertise?: string | null;
  assignedBatchId?: string | null;
  assignedBatch?: {
    id: string;
    batchNumber: string;
    batchName: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

