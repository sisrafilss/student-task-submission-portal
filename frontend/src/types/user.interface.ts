import { UserRole } from '@/lib/auth-utils';

export interface UserInfo {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

