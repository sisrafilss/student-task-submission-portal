import { queryStringFormatter } from '@/lib/formatters';
import { getBatches, getStudents } from '@/services/admin/studentManagement';
import StudentTable from './StudentTable';
import TablePagination from '@/components/shared/TablePagination';

interface StudentTableContainerProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function StudentTableContainer({
  searchParams,
}: StudentTableContainerProps) {
  const searchParamsObj = await searchParams;
  const queryString = queryStringFormatter(searchParamsObj);

  const [batchesResult, studentsResult] = await Promise.all([
    getBatches(),
    getStudents(queryString),
  ]);

  return (
    <div className="space-y-4">
      <StudentTable
        students={studentsResult.data}
        batches={batchesResult.data}
      />
      <TablePagination
        currentPage={studentsResult.meta.page}
        totalPages={studentsResult.meta.totalPage}
      />
    </div>
  );
}

