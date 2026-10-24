export type BatchStatus = 'ACTIVE' | 'UPCOMING' | 'COMPLETED';

export interface IBatchFilterRequest {
  searchTerm?: string;
  status?: string;
  track?: string;
}

export interface ICreateBatchPayload {
  name: string;
  batchCode: string;
  track: string;
  status?: BatchStatus;
}

export interface IUpdateBatchPayload {
  name?: string;
  batchCode?: string;
  track?: string;
  status?: BatchStatus;
}

