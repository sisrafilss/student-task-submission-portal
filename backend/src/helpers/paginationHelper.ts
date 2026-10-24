export interface IPaginationOptions {
  page?: number | string;
  limit?: number | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IPaginationResult {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export const calculatePagination = (options: IPaginationOptions): IPaginationResult => {
  const parsedPage = Number(options.page);
  const parsedLimit = Number(options.limit);

  const page = !isNaN(parsedPage) && parsedPage > 0 ? Math.floor(parsedPage) : 1;
  const limit = !isNaN(parsedLimit) && parsedLimit > 0 ? Math.floor(parsedLimit) : 10;
  const skip = (page - 1) * limit;

  const sortBy = options.sortBy || 'createdAt';
  const sortOrder = options.sortOrder === 'asc' ? 'asc' : 'desc';

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

