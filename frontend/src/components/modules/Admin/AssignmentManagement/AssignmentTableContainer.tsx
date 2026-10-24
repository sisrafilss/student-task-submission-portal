import TablePagination from '@/components/shared/TablePagination';
import { queryStringFormatter } from '@/lib/formatters';
import { getAdminAssignments } from '@/services/assignments/assignmentManagement';
import React from 'react';
import AssignmentTable from './AssignmentTable';

interface AssignmentTableContainerProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AssignmentTableContainer({
  searchParams,
}: AssignmentTableContainerProps) {
  const searchParamsObj = await searchParams;
  const queryString = queryStringFormatter(searchParamsObj);

  const res = await getAdminAssignments(queryString);

  return (
    <div className="space-y-4">
      <AssignmentTable assignments={res.data} />
      <TablePagination
        currentPage={res.meta.page}
        totalPages={res.meta.totalPages}
      />
    </div>
  );
}

