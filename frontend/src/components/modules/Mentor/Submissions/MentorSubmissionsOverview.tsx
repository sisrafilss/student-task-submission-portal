import { getAvailableAssignments } from '@/services/submissions/submissionManagement';
import { getMentorSubmissionStats } from '@/services/submissions/mentorSubmissionManagement';
import React from 'react';
import MentorSubmissionsHeader from './MentorSubmissionsHeader';
import MentorSubmissionStatsCards from './MentorSubmissionStatsCards';
import MentorSubmissionsToolbar from './MentorSubmissionsToolbar';

export default async function MentorSubmissionsOverview() {
  const [stats, assignmentsRes] = await Promise.all([
    getMentorSubmissionStats(),
    getAvailableAssignments(),
  ]);

  return (
    <>
      <MentorSubmissionsHeader pendingCount={stats.totalPending} />
      <MentorSubmissionStatsCards stats={stats} />
      <MentorSubmissionsToolbar assignments={assignmentsRes.data} />
    </>
  );
}

