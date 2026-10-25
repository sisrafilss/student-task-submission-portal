import { NavSection } from '@/types/dashboard.interface';
import { getDefaultDashboardRoute, UserRole } from './auth-utils';

export const getCommonNavItems = (role: UserRole): NavSection[] => {
  const defaultDashboard = getDefaultDashboardRoute(role);

  return [
    {
      items: [
        {
          title: 'Dashboard',
          href: defaultDashboard,
          icon: 'LayoutDashboard',
          roles: ['STUDENT', 'MENTOR', 'ADMIN'],
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          title: 'Settings',
          href: '/settings',
          icon: 'Settings',
          roles: ['STUDENT', 'MENTOR', 'ADMIN'],
        },
      ],
    },
  ];
};

export const studentNavItems: NavSection[] = [
  {
    title: 'Academic Activities',
    items: [
      {
        title: 'Assignments',
        href: '/student/assignments',
        icon: 'BookOpen',
        roles: ['STUDENT'],
      },
      {
        title: 'Submit Project',
        href: '/student/submit',
        icon: 'FolderUp',
        roles: ['STUDENT'],
      },
      {
        title: 'My Submissions',
        href: '/student/submissions',
        icon: 'FileCheck',
        roles: ['STUDENT'],
      },
      {
        title: 'Grades & Feedback',
        href: '/student/grades',
        icon: 'GraduationCap',
        roles: ['STUDENT'],
      },
    ],
  },
];

export const mentorNavItems: NavSection[] = [
  {
    title: 'Evaluations & Batches',
    items: [
      {
        title: 'Submissions Queue',
        href: '/mentor/submissions',
        icon: 'ClipboardCheck',
        roles: ['MENTOR'],
      },
      {
        title: 'My Batches',
        href: '/mentor/batches',
        icon: 'Layers',
        roles: ['MENTOR'],
      },
      {
        title: 'Evaluation History',
        href: '/mentor/history',
        icon: 'Clock',
        roles: ['MENTOR'],
      },
      {
        title: 'Students List',
        href: '/mentor/students',
        icon: 'Users',
        roles: ['MENTOR'],
      },
    ],
  },
];

export const adminNavItems: NavSection[] = [
  {
    title: 'User Management',
    items: [
      {
        title: 'Students',
        href: '/admin/students',
        icon: 'GraduationCap',
        roles: ['ADMIN'],
      },
      {
        title: 'Mentors',
        href: '/admin/mentors',
        icon: 'Users',
        roles: ['ADMIN'],
      },
    ],
  },
  {
    title: 'Academic & System',
    items: [
      {
        title: 'Assignments',
        href: '/admin/assignments',
        icon: 'BookOpen',
        roles: ['ADMIN'],
      },
      {
        title: 'Batches',
        href: '/admin/batches',
        icon: 'Layers',
        roles: ['ADMIN'],
      },
      {
        title: 'Reports & Analytics',
        href: '/admin/reports',
        icon: 'BarChart3',
        roles: ['ADMIN'],
      },
    ],
  },
];

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
  const commonNav = getCommonNavItems(role);
  const dashboardItem = commonNav[0];
  const settingsItem = commonNav[1];

  switch (role) {
    case 'ADMIN':
      return [dashboardItem, ...adminNavItems, settingsItem];
    case 'MENTOR':
      return [dashboardItem, ...mentorNavItems, settingsItem];
    case 'STUDENT':
    default:
      return [dashboardItem, ...studentNavItems, settingsItem];
  }
};

