import TablePagination from '@/components/shared/TablePagination';
import { queryStringFormatter } from '@/lib/formatters';
import {
  getAdminAssignments,
  getAvailableMentorsList,
} from '@/services/assignments/assignmentManagement';
import { getActiveBatches } from '@/services/batch/batchManagement';
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

  const [res, mentorsData, batchesData] = await Promise.all([
    getAdminAssignments(queryString),
    getAvailableMentorsList(),
    getActiveBatches(),
  ]);

  return (
    <div className="space-y-4">
      <AssignmentTable
        assignments={res.data}
        availableMentors={mentorsData.data}
        availableBatches={batchesData.data}
      />
      <TablePagination
        currentPage={res.meta.page}
        totalPages={res.meta.totalPages}
      />
    </div>
  );
}
