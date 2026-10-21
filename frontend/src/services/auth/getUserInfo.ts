'use server';

import { UserInfo } from '@/types/user.interface';
import { getCookie } from './tokenHandler';

/**
 * Universal server-side user info extractor.
 * Supports production JWT tokens as well as development demo tokens.
 */
export const getUserInfo = async (): Promise<UserInfo | null> => {
  try {
    const accessToken = await getCookie('accessToken');

    if (!accessToken) {
      return null;
    }

    // Handle recognized local demo tokens
    if (accessToken === 'mock_student_token') {
      return {
        id: 'student-demo',
        name: 'Demo Student',
        email: 'student@portal.test',
        role: 'STUDENT',
      };
    }

    if (accessToken === 'mock_mentor_token') {
      return {
        id: 'mentor-demo',
        name: 'Demo Mentor',
        email: 'mentor@portal.test',
        role: 'MENTOR',
      };
    }

    if (accessToken === 'mock_admin_token') {
      return {
        id: 'admin-demo',
        name: 'System Admin',
        email: 'admin@portal.test',
        role: 'ADMIN',
      };
    }

    // Attempt decoding standard 3-part JWT
    const parts = accessToken.split('.');
    if (parts.length === 3) {
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      let jsonPayload = '';

      if (typeof Buffer !== 'undefined') {
        jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
      } else if (typeof atob !== 'undefined') {
        jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
      }

      if (jsonPayload) {
        const decoded = JSON.parse(jsonPayload);
        return {
          id: decoded.id || decoded.userId || decoded.sub || 'user',
          name: decoded.name || decoded.fullName || decoded.email?.split('@')[0] || 'User',
          email: decoded.email || 'user@portal.test',
          role: decoded.role || 'STUDENT',
          avatarUrl: decoded.avatarUrl || decoded.image || undefined,
        };
      }
    }

    return null;
  } catch (error: unknown) {
    const err = error as { digest?: string; message?: string };
    if (err?.digest === 'HANGING_PROMISE_REJECTION' || err?.message?.includes('prerender')) {
      // Expected dynamic bail-out during Next.js Partial Prerendering
      return null;
    }
    console.error('Failed to parse user info from accessToken cookie:', error);
    return null;
  }
};
