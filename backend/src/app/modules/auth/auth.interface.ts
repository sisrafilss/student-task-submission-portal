export type UserRole = 'STUDENT' | 'MENTOR' | 'ADMIN' | 'INSTRUCTOR';

export interface IRegisterUserPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface ILoginUserPayload {
  email: string;
  password: string;
}

export interface IChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface IAuthUserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  needsPasswordChange: boolean;
}

export interface ILoginResponse {
  user: IAuthUserResponse;
  accessToken: string;
  refreshToken: string;
}

export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

