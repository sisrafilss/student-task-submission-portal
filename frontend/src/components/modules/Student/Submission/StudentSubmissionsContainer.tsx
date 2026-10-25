import TablePagination from '@/components/shared/TablePagination';
import { queryStringFormatter } from '@/lib/formatters';
import { getStudentSubmissions } from '@/services/submissions/submissionManagement';
import StudentSubmissionsTable from './StudentSubmissionsTable';

interface StudentSubmissionsContainerProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function StudentSubmissionsContainer({
  searchParams,
}: StudentSubmissionsContainerProps) {
  const searchParamsObj = await searchParams;
  const queryString = queryStringFormatter(searchParamsObj);

  const submissionsResult = await getStudentSubmissions(queryString);

  return (
    <div className="space-y-4">
      <StudentSubmissionsTable submissions={submissionsResult.data} />
      <TablePagination
        currentPage={submissionsResult.meta.page}
        totalPages={submissionsResult.meta.totalPage}
      />
    </div>
  );
}

