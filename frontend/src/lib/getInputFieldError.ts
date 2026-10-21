export interface IInputErrorState {
  success?: boolean;
  message?: string;
  errors?: {
    field: string;
    message: string;
  }[];
}

export const getInputFieldError = (
  fieldName: string,
  state: IInputErrorState | null | undefined
): string | null => {
  if (state && Array.isArray(state.errors)) {
    const error = state.errors.find((err) => err.field === fieldName);
    return error ? error.message : null;
  }
  return null;
};

