import { ZodType } from 'zod';

export const zodValidator = <T, S extends ZodType>(payload: T, schema: S) => {
  const validatedPayload = schema.safeParse(payload);

  if (!validatedPayload.success) {
    return {
      success: false as const,
      errors: validatedPayload.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    };
  }
  return {
    success: true as const,
    data: validatedPayload.data,
  };
};

