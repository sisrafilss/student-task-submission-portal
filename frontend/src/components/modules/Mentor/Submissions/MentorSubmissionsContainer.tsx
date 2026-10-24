import TablePagination from '@/components/shared/TablePagination';
import { queryStringFormatter } from '@/lib/formatters';
import { getMentorSubmissions } from '@/services/submissions/submissionManagement';
import MentorSubmissionsTable from './MentorSubmissionsTable';

interface MentorSubmissionsContainerProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function MentorSubmissionsContainer({
  searchParams,
}: MentorSubmissionsContainerProps) {
  const searchParamsObj = await searchParams;
  const queryString = queryStringFormatter(searchParamsObj);

  const submissionsResult = await getMentorSubmissions(queryString);

  return (
    <div className="space-y-4">
      <MentorSubmissionsTable submissions={submissionsResult.data} />
      <TablePagination
        currentPage={submissionsResult.meta.page}
        totalPages={submissionsResult.meta.totalPage}
      />
    </div>
  );
}
