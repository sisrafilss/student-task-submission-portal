import TablePagination from '@/components/shared/TablePagination';
import { queryStringFormatter } from '@/lib/formatters';
import { getMentors } from '@/services/admin/mentorManagement';
import MentorTable from './MentorTable';

interface MentorTableContainerProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function MentorTableContainer({
  searchParams,
}: MentorTableContainerProps) {
  const searchParamsObj = await searchParams;
  const queryString = queryStringFormatter(searchParamsObj);

  const mentorsResult = await getMentors(queryString);

  return (
    <div className="space-y-4">
      <MentorTable mentors={mentorsResult.data} />
      <TablePagination
        currentPage={mentorsResult.meta.page}
        totalPages={mentorsResult.meta.totalPage}
      />
    </div>
  );
}

