import RefreshButton from '@/components/shared/RefreshButton';
import SearchFilter from '@/components/shared/SearchFilter';
import SelectFilter from '@/components/shared/SelectFilter';
import { getBatches } from '@/services/admin/studentManagement';

export default async function StudentFilterToolbar() {
  const batchesRes = await getBatches();
  const batchOptions = batchesRes.data.map((batch) => ({
    label: batch.name,
    value: batch.id,
  }));

  const statusOptions = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
    { label: 'Blocked', value: 'BLOCKED' },
    { label: 'Graduated', value: 'GRADUATED' },
  ];

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <SearchFilter
        paramName="searchTerm"
        placeholder="Search by student name, ID, or email..."
        className="flex-1"
      />
      <div className="flex flex-wrap items-center gap-2">
        <SelectFilter
          paramName="batch"
          placeholder="Search batch..."
          allLabel="All Batches"
          icon="Layers"
          options={batchOptions}
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

