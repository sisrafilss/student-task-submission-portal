import { getAvailableMentorsList } from '@/services/assignments/assignmentManagement';
import { getActiveBatches } from '@/services/batch/batchManagement';
import React from 'react';
import AssignmentManagementHeader from './AssignmentManagementHeader';

export default async function AssignmentManagementHeaderContainer() {
  const [mentorsData, batchesData] = await Promise.all([
    getAvailableMentorsList(),
    getActiveBatches(),
  ]);

  return (
    <AssignmentManagementHeader
      totalCount={0}
      availableMentors={mentorsData.data}
      availableBatches={batchesData.data}
    />
  );
}

