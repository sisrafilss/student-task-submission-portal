import { getDefaultDashboardRoute } from '@/lib/auth-utils';
import { getNavItemsByRole } from '@/lib/navItems.config';
import { getUserInfo } from '@/services/auth/getUserInfo';
import { NavSection } from '@/types/dashboard.interface';
import { UserInfo } from '@/types/user.interface';
import DashboardSidebarContent from './DashboardSidebarContent';

export default async function DashboardSidebar() {
  const fetchedUserInfo = await getUserInfo();

  const userInfo: UserInfo = fetchedUserInfo || {
    name: 'Guest User',
    email: 'guest@portal.test',
    role: 'STUDENT',
  };

  const navItems: NavSection[] = getNavItemsByRole(userInfo.role);
  const dashboardHome = getDefaultDashboardRoute(userInfo.role);

  return (
    <DashboardSidebarContent
      userInfo={userInfo}
      navItems={navItems}
      dashboardHome={dashboardHome}
    />
  );
}

