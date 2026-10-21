'use server';

import { redirect } from 'next/navigation';
import { deleteCookie } from './tokenHandler';

/**
 * Server action to log out the user by clearing session cookies
 * and redirecting to the login screen with confirmation indicator.
 */
export const logoutUser = async (): Promise<void> => {
  await deleteCookie('accessToken');
  await deleteCookie('refreshToken');
  redirect('/login?loggedOut=true');
};

