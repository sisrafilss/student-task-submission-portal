import TablePagination from '@/components/shared/TablePagination';
import { getAllBatches } from '@/services/batch/batchManagement';
import React from 'react';
import BatchTable from './BatchTable';

interface BatchTableContainerProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function BatchTableContainer({
  searchParams,
}: BatchTableContainerProps) {
  const resolvedParams = await searchParams;

  const queryParts: string[] = [];
  if (typeof resolvedParams.searchTerm === 'string' && resolvedParams.searchTerm) {
    queryParts.push(`searchTerm=${encodeURIComponent(resolvedParams.searchTerm)}`);
  }
  if (typeof resolvedParams.status === 'string' && resolvedParams.status) {
    queryParts.push(`status=${encodeURIComponent(resolvedParams.status)}`);
  }
  if (typeof resolvedParams.page === 'string' && resolvedParams.page) {
    queryParts.push(`page=${encodeURIComponent(resolvedParams.page)}`);
  }
  if (typeof resolvedParams.limit === 'string' && resolvedParams.limit) {
    queryParts.push(`limit=${encodeURIComponent(resolvedParams.limit)}`);
  }

  const queryString = queryParts.join('&');
  const response = await getAllBatches(queryString);

  return (
    <div className="space-y-4">
      <BatchTable batches={response.data} />
      <TablePagination
        currentPage={response.meta.page}
        totalPages={response.meta.totalPage}
      />
    </div>
  );
}
