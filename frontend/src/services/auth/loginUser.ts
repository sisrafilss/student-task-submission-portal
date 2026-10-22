'use server';

import { getDefaultDashboardRoute, isValidRedirectForRole, type UserRole } from '@/lib/auth-utils';
import { serverFetch } from '@/lib/server-fetch';
import { zodValidator } from '@/lib/zodValidator';
import { setCookie } from '@/services/auth/tokenHandler';
import { IActionResult } from '@/types/action.interface';
import { loginValidationZodSchema } from '@/zod/auth.validation';
import { redirect } from 'next/navigation';

export type ILoginActionResult = IActionResult;

export const loginUser = async (
  _currentState: ILoginActionResult | null,
  formData: FormData
): Promise<ILoginActionResult> => {
  try {
    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';
    const redirectTo = formData.get('redirect')?.toString() || null;

    const payload = { email, password };

    // 1. Validate payload using Zod
    const validationResult = zodValidator(payload, loginValidationZodSchema);
    if (!validationResult.success) {
      return validationResult;
    }

    const validatedPayload = validationResult.data;

    let userRole: UserRole = 'STUDENT';
    let targetPath = '';

    // 2. Attempt real backend API call
    try {
      const res = await serverFetch.post('/auth/login', {
        body: JSON.stringify(validatedPayload),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          const accessToken = result.data.accessToken || 'demo_access_token';
          const refreshToken = result.data.refreshToken || 'demo_refresh_token';
          userRole = result.data.user?.role || (email.includes('admin') ? 'ADMIN' : email.includes('mentor') ? 'MENTOR' : 'STUDENT');

          await setCookie('accessToken', accessToken, { maxAge: 60 * 60 * 24 });
          await setCookie('refreshToken', refreshToken, { maxAge: 60 * 60 * 24 * 30 });
        }
      } else {
        // Fallback for demo users during pure frontend phase
        if (validatedPayload.email === 'student@portal.test' && validatedPayload.password === 'Password123!') {
          userRole = 'STUDENT';
          await setCookie('accessToken', 'mock_student_token', { maxAge: 60 * 60 * 24 });
        } else if (validatedPayload.email === 'mentor@portal.test' && validatedPayload.password === 'Password123!') {
          userRole = 'MENTOR';
          await setCookie('accessToken', 'mock_mentor_token', { maxAge: 60 * 60 * 24 });
        } else if (validatedPayload.email === 'admin@portal.test' && validatedPayload.password === 'Password123!') {
          userRole = 'ADMIN';
          await setCookie('accessToken', 'mock_admin_token', { maxAge: 60 * 60 * 24 });
        } else {
          return {
            success: false,
            message: 'Invalid email or password. Please verify your credentials.',
          };
        }
      }
    } catch {
      // Backend not yet running in this phase: allow recognized demo credentials
      if (validatedPayload.email === 'student@portal.test' && validatedPayload.password === 'Password123!') {
        userRole = 'STUDENT';
        await setCookie('accessToken', 'mock_student_token', { maxAge: 60 * 60 * 24 });
      } else if (validatedPayload.email === 'mentor@portal.test' && validatedPayload.password === 'Password123!') {
        userRole = 'MENTOR';
        await setCookie('accessToken', 'mock_mentor_token', { maxAge: 60 * 60 * 24 });
      } else if (validatedPayload.email === 'admin@portal.test' && validatedPayload.password === 'Password123!') {
        userRole = 'ADMIN';
        await setCookie('accessToken', 'mock_admin_token', { maxAge: 60 * 60 * 24 });
      } else {
        return {
          success: false,
          message: 'Unable to connect to authentication server. For testing, please use one of the Demo Accounts.',
        };
      }
    }

    // 3. Determine redirection route
    if (redirectTo && isValidRedirectForRole(redirectTo, userRole)) {
      targetPath = `${redirectTo}${redirectTo.includes('?') ? '&' : '?'}loggedIn=true`;
    } else {
      targetPath = `${getDefaultDashboardRoute(userRole)}?loggedIn=true`;
    }

    redirect(targetPath);
  } catch (error: unknown) {
    // Preserve Next.js redirect errors
    if (
      typeof error === 'object' &&
      error !== null &&
      'digest' in error &&
      typeof (error as { digest: string }).digest === 'string' &&
      (error as { digest: string }).digest.startsWith('NEXT_REDIRECT')
    ) {
      throw error;
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred during login',
    };
  }
};

