'use server';

import { cookies } from 'next/headers';

export type CookieOptions = {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: boolean | 'lax' | 'strict' | 'none';
  path?: string;
  maxAge?: number;
};

export const setCookie = async (key: string, value: string, options?: CookieOptions): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.set(key, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    ...options,
  });
};

export const getCookie = async (key: string): Promise<string | undefined> => {
  const cookieStore = await cookies();
  return cookieStore.get(key)?.value;
};

export const deleteCookie = async (key: string): Promise<void> => {
  const cookieStore = await cookies();
  cookieStore.delete(key);
};

export const removeCookie = deleteCookie;
