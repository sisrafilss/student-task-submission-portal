/**
 * Standardized Server Action Result Interface across all form submissions.
 * Compatible with React 19 useActionState hook.
 */
export interface IActionResult<T = unknown> {
  success?: boolean;
  message?: string;
  errors?: {
    field: string;
    message: string;
  }[];
  data?: T;
}

