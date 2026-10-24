'use server';

import { serverFetch } from '@/lib/server-fetch';
import { zodValidator } from '@/lib/zodValidator';
import { setCookie } from '@/services/auth/tokenHandler';
import { IActionResult } from '@/types/action.interface';
import { changePasswordValidationZodSchema } from '@/zod/auth.validation';
import { redirect } from 'next/navigation';

export type IChangePasswordActionResult = IActionResult;

export const changePassword = async (
  _currentState: IChangePasswordActionResult | null,
  formData: FormData
): Promise<IChangePasswordActionResult> => {
  try {
    const oldPassword = formData.get('oldPassword')?.toString() || '';
    const newPassword = formData.get('newPassword')?.toString() || '';
    const confirmPassword = formData.get('confirmPassword')?.toString() || '';

    const payload = { oldPassword, newPassword, confirmPassword };

    // 1. Zod payload validation
    const validationResult = zodValidator(payload, changePasswordValidationZodSchema);
    if (!validationResult.success) {
      return validationResult;
    }

    const validatedPayload = validationResult.data;

    // 2. Call backend change-password API
    try {
      const res = await serverFetch.post('/auth/change-password', {
        body: JSON.stringify({
          oldPassword: validatedPayload.oldPassword,
          newPassword: validatedPayload.newPassword,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          const accessToken = result.data.accessToken;
          const refreshToken = result.data.refreshToken;

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
            errJson?.message ||
            'Failed to change password. Please ensure your temporary password is correct.',
        };
      }
    } catch {
      return {
        success: false,
        message: 'Unable to connect to authentication server. Please try again.',
      };
    }

    // 3. Password updated successfully -> redirect to mentor dashboard
    redirect('/mentor/dashboard?passwordChanged=true');
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
      message:
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while changing password',
    };
  }
};

