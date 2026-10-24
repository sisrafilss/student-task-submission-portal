'use client';

import { IMentorSubmissionStats } from '@/types/submission.interface';
import { Award, CheckCircle2, Clock, FileText, XCircle } from 'lucide-react';
import MentorSubmissionStatCard from './MentorSubmissionStatCard';

interface MentorSubmissionStatsCardsProps {
  stats: IMentorSubmissionStats;
}

export default function MentorSubmissionStatsCards({
  stats,
}: MentorSubmissionStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
      <MentorSubmissionStatCard
        title="Total Submissions"
        value={stats.totalSubmissions}
        subtitle="All projects submitted"
        icon={FileText}
        colorVariant="blue"
      />

      <MentorSubmissionStatCard
        title="Pending Review"
        value={stats.totalPending}
        subtitle="Needs evaluation"
        icon={Clock}
        colorVariant="amber"
      />

      <MentorSubmissionStatCard
        title="Approved"
        value={stats.totalApproved}
        subtitle="Passed requirements"
        icon={CheckCircle2}
        colorVariant="emerald"
      />

      <MentorSubmissionStatCard
        title="Rejected"
        value={stats.totalRejected}
        subtitle="Needs resubmission"
        icon={XCircle}
        colorVariant="rose"
      />

      <MentorSubmissionStatCard
        title="Average Score"
        value={`${stats.averageScore}%`}
        subtitle="Across evaluated projects"
        icon={Award}
        colorVariant="purple"
      />
    </div>
  );
}
