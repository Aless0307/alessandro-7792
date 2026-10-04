import type { z } from 'zod';

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

// { campo: primer error } para pintarlo debajo de cada input
export function toFieldErrors<T>(error: z.ZodError): FieldErrors<T> {
  const errors: FieldErrors<T> = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as keyof T | undefined;
    if (field !== undefined && errors[field] === undefined) errors[field] = issue.message;
  }
  return errors;
}
