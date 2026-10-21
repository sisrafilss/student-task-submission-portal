import { getDefaultDashboardRoute } from '@/lib/auth-utils';
import { getNavItemsByRole } from '@/lib/navItems.config';
import { getUserInfo } from '@/services/auth/getUserInfo';
import { NavSection } from '@/types/dashboard.interface';
import { UserInfo } from '@/types/user.interface';
import DashboardNavbarContent from './DashboardNavbarContent';

export default async function DashboardNavbar() {
  const fetchedUserInfo = await getUserInfo();

  const userInfo: UserInfo = fetchedUserInfo || {
    name: 'Guest User',
    email: 'guest@portal.test',
    role: 'STUDENT',
  };

  const navItems: NavSection[] = getNavItemsByRole(userInfo.role);
  const dashboardHome = getDefaultDashboardRoute(userInfo.role);

  return (
    <DashboardNavbarContent
      userInfo={userInfo}
      navItems={navItems}
      dashboardHome={dashboardHome}
    />
  );
}

