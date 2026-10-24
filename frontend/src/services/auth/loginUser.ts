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
    let needsPasswordChange = false;
    let targetPath = '';

    // 2. Real backend API call with robust error extraction
    try {
      const res = await serverFetch.post('/auth/login', {
        body: JSON.stringify(validatedPayload),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          const accessToken = result.data.accessToken;
          const refreshToken = result.data.refreshToken;
          userRole = result.data.user?.role || 'STUDENT';
          needsPasswordChange = Boolean(result.data.user?.needsPasswordChange);

          if (accessToken) {
            await setCookie('accessToken', accessToken, { maxAge: 60 * 60 * 24 });
          }
          if (refreshToken) {
            await setCookie('refreshToken', refreshToken, { maxAge: 60 * 60 * 24 * 30 });
          }
        }
      } else {
        const errJson = await res.json().catch(() => null);
        return {
          success: false,
          message:
            errJson?.message || 'Invalid email or password. Please verify your credentials.',
        };
      }
    } catch {
      return {
        success: false,
        message: 'Unable to connect to authentication server. Please verify backend is running.',
      };
    }

    // 3. Intercept First-Time Mentor / Users requiring password change
    if (needsPasswordChange) {
      redirect('/change-password');
    }

    // 4. Determine redirection route
    if (redirectTo && isValidRedirectForRole(redirectTo, userRole)) {
      targetPath = `${redirectTo}${redirectTo.includes('?') ? '&' : '?'}loggedIn=true`;
    } else {
      targetPath = `${getDefaultDashboardRoute(userRole)}?loggedIn=true`;
    }

    redirect(targetPath);
  } catch (error: unknown) {
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
