import TablePagination from '@/components/shared/TablePagination';
import { queryStringFormatter } from '@/lib/formatters';
import {
  getMentors,
  getMentorSpecializationsList,
} from '@/services/admin/mentorManagement';
import { getBatches } from '@/services/admin/studentManagement';
import MentorTable from './MentorTable';

interface MentorTableContainerProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function MentorTableContainer({
  searchParams,
}: MentorTableContainerProps) {
  const searchParamsObj = await searchParams;
  const queryString = queryStringFormatter(searchParamsObj);

  const [mentorsResult, batchesResult, specsResult] = await Promise.all([
    getMentors(queryString),
    getBatches(),
    getMentorSpecializationsList(),
  ]);

  return (
    <div className="space-y-4">
      <MentorTable
        mentors={mentorsResult.data}
        batches={batchesResult.data}
        specializations={specsResult.data}
      />
      <TablePagination
        currentPage={mentorsResult.meta.page}
        totalPages={mentorsResult.meta.totalPage}
      />
    </div>
  );
}
