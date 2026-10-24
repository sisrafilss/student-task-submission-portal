export type BatchStatus = 'ACTIVE' | 'UPCOMING' | 'COMPLETED';

export interface IBatch {
  id: string;
  name: string;
  batchCode: string;
  track: string;
  status: BatchStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBatchOption {
  label: string;
  value: string;
  track?: string;
  id?: string;
}

export interface IBatchFilterRequest {
  searchTerm?: string;
  status?: string;
  track?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IBatchesResponse {
  success: boolean;
  message?: string;
  data: IBatch[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

