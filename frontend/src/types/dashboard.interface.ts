import { UserRole } from '@/lib/auth-utils';

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string | number;
  description?: string;
  roles: UserRole[];
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export interface IAdminDashboardStats {
  totalStudents: number;
  studentGrowthText: string;
  activeMentors: number;
  activeTracksText: string;
  totalAssignments: number;
  pendingReleasesText: string;
  totalSubmissions: number;
  onTimeRateText: string;
}

export interface IMentorDashboardStats {
  pendingSubmissions: number;
  urgentSubmissionsText: string;
  evaluatedThisWeek: number;
  avgResponseTimeText: string;
  activeBatches: number;
  assignedBatchesText: string;
}

export interface IStudentDashboardStats {
  activeAssignments: number;
  dueWithinText: string;
  mySubmissions: number;
  submissionStatusText: string;
  averageScoreText: string;
  performanceRatingText: string;
}
