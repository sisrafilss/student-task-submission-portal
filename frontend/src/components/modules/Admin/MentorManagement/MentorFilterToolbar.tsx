import RefreshButton from '@/components/shared/RefreshButton';
import SearchFilter from '@/components/shared/SearchFilter';
import SelectFilter from '@/components/shared/SelectFilter';
import { getMentorSpecializationsList } from '@/services/admin/mentorManagement';

export default async function MentorFilterToolbar() {
  const specsRes = await getMentorSpecializationsList();
  const statusOptions = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
    { label: 'On Leave', value: 'ON_LEAVE' },
    { label: 'Blocked', value: 'BLOCKED' },
  ];

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <SearchFilter
        paramName="searchTerm"
        placeholder="Search by mentor name, ID, or email..."
        className="flex-1"
      />
      <div className="flex flex-wrap items-center gap-2">
        <SelectFilter
          paramName="specialization"
          placeholder="Search specialization..."
          allLabel="All Specializations"
          icon="Code"
          options={specsRes.data}
        />
        <SelectFilter
          paramName="status"
          placeholder="Search status..."
          allLabel="All Statuses"
          icon="SlidersHorizontal"
          options={statusOptions}
        />
        <RefreshButton />
      </div>
    </div>
  );
}

