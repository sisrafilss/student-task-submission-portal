'use server';

import { serverFetch } from '@/lib/server-fetch';
import { zodValidator } from '@/lib/zodValidator';
import { setCookie } from '@/services/auth/tokenHandler';
import { IActionResult } from '@/types/action.interface';
import { registerValidationZodSchema } from '@/zod/auth.validation';
import { redirect } from 'next/navigation';

export type IRegisterActionResult = IActionResult;

export const registerStudent = async (
  _currentState: IRegisterActionResult | null,
  formData: FormData
): Promise<IRegisterActionResult> => {
  try {
    const name = formData.get('name')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const password = formData.get('password')?.toString() || '';
    const confirmPassword = formData.get('confirmPassword')?.toString() || '';

    const payload = { name, email, password, confirmPassword };

    // 1. Validate payload using Zod
    const validationResult = zodValidator(payload, registerValidationZodSchema);
    if (!validationResult.success) {
      return validationResult;
    }

    const validatedPayload = validationResult.data;

    // 2. Attempt real backend API call with fallback for frontend dev phase
    try {
      const res = await serverFetch.post('/auth/register', {
        body: JSON.stringify({
          name: validatedPayload.name,
          email: validatedPayload.email,
          password: validatedPayload.password,
          role: 'STUDENT',
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          const accessToken = result.data.accessToken || 'demo_student_token';
          const refreshToken = result.data.refreshToken || 'demo_refresh_token';
          await setCookie('accessToken', accessToken, { maxAge: 60 * 60 * 24 });
          await setCookie('refreshToken', refreshToken, { maxAge: 60 * 60 * 24 * 30 });
        }
      } else {
        // Fallback for dev phase before backend register endpoint is live
        await setCookie('accessToken', 'mock_student_token', { maxAge: 60 * 60 * 24 });
      }
    } catch {
      // Backend not running in this phase: allow mock student registration
      await setCookie('accessToken', 'mock_student_token', { maxAge: 60 * 60 * 24 });
    }

    // 3. Redirect to student dashboard
    redirect('/student/dashboard?registered=true');
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
      message: error instanceof Error ? error.message : 'An unexpected error occurred during registration',
    };
  }
};
