'use server';

import { serverFetch } from '@/lib/server-fetch';
import { redirect } from 'next/navigation';
import { deleteCookie } from './tokenHandler';

/**
 * Server action to log out the user by revoking backend session,
 * clearing httpOnly cookies and redirecting to the login screen.
 */
export const logoutUser = async (): Promise<void> => {
  try {
    await serverFetch.post('/auth/logout');
  } catch {
    // Gracefully proceed with local cookie clearance if backend is unreachable
  }

  await deleteCookie('accessToken');
  await deleteCookie('refreshToken');
  redirect('/login?loggedOut=true');
};
