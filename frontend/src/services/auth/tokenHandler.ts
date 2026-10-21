import { cookies } from 'next/headers';

export type CookieOptions = {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: boolean | 'lax' | 'strict' | 'none';
  path?: string;
  maxAge?: number;
};

export const tokenHandler = {
  setCookie: async (key: string, value: string, options?: CookieOptions) => {
    const cookieStore = await cookies();
    cookieStore.set(key, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      ...options,
    });
  },

  getCookie: async (key: string): Promise<string | undefined> => {
    const cookieStore = await cookies();
    return cookieStore.get(key)?.value;
  },

  removeCookie: async (key: string) => {
    const cookieStore = await cookies();
    cookieStore.delete(key);
  },
};

