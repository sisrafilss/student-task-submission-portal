import { UserRole } from '@/lib/auth-utils';

export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  needsPasswordChange?: boolean;
}

export interface IAuthResponseData {
  user: IAuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface IChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

