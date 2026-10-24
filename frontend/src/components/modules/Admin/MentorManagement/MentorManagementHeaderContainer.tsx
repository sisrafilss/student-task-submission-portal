import { getMentorSpecializationsList } from '@/services/admin/mentorManagement';
import { getBatches } from '@/services/admin/studentManagement';
import MentorManagementHeader from './MentorManagementHeader';

export default async function MentorManagementHeaderContainer() {
  const [batchesRes, specsRes] = await Promise.all([
    getBatches(),
    getMentorSpecializationsList(),
  ]);

  return (
    <MentorManagementHeader
      batches={batchesRes.data}
      specializations={specsRes.data}
    />
  );
}

