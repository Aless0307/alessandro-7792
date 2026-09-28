import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import type { z } from 'zod';
import { toFieldErrors, type FieldErrors } from '../validation';

// Estado y validación de los formularios de acceso. Los errores de un campo se muestran
// hasta que el usuario sale de él (blur) o intenta enviar, para no regañar mientras escribe.
export function useAuthForm<TValues extends Record<string, string>, TOutput>(
  schema: z.ZodType<TOutput, TValues>,
  initialValues: TValues,
) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState<Partial<Record<keyof TValues, boolean>>>({});
  const [wasSubmitted, setWasSubmitted] = useState(false);

  const result = useMemo(() => schema.safeParse(values), [schema, values]);
  const allErrors: FieldErrors<TValues> = result.success
    ? {}
    : toFieldErrors<TValues>(result.error);

  const fields = Object.keys(initialValues) as (keyof TValues)[];
  const validFields = fields.filter((field) => values[field] !== '' && !allErrors[field]);

  const errors: FieldErrors<TValues> = {};
  for (const field of fields) {
    if (touched[field] || wasSubmitted) errors[field] = allErrors[field];
  }

  function fieldProps(field: keyof TValues) {
    return {
      name: String(field),
      value: values[field],
      error: errors[field],
      onChange: (event: ChangeEvent<HTMLInputElement>) =>
        setValues((current) => ({ ...current, [field]: event.target.value })),
      onBlur: () => setTouched((current) => ({ ...current, [field]: true })),
    };
  }

  function handleSubmit(onValid: (data: TOutput) => void) {
    return (event: FormEvent) => {
      event.preventDefault();
      setWasSubmitted(true);
      if (result.success) onValid(result.data);
    };
  }

  return {
    values,
    fieldProps,
    handleSubmit,
    // Fracción de campos completos y válidos: mueve al caracol en la pista.
    progress: validFields.length / fields.length,
  };
}
