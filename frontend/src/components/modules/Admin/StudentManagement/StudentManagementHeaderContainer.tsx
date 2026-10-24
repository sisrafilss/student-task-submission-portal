import { getBatches } from '@/services/admin/studentManagement';
import StudentManagementHeader from './StudentManagementHeader';

export default async function StudentManagementHeaderContainer() {
  const batchesRes = await getBatches();
  return <StudentManagementHeader batches={batchesRes.data} />;
}

