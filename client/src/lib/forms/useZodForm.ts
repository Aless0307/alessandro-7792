import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react';
import type { z } from 'zod';
import { toFieldErrors, type FieldErrors } from './fieldErrors';

interface FieldOptions {
  // p. ej. agrupar los dígitos de la tarjeta
  format?: (value: string) => string;
}

// Los errores aparecen al salir del campo o al enviar, no mientras se escribe.
export function useZodForm<TValues extends Record<string, string>, TOutput>(
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

  function fieldProps(field: keyof TValues, options: FieldOptions = {}) {
    return {
      name: String(field),
      value: values[field],
      error: errors[field],
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        const raw = event.target.value;
        setValues((current) => ({
          ...current,
          [field]: options.format ? options.format(raw) : raw,
        }));
      },
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

  function setFieldValues(next: Partial<TValues>) {
    setValues((current) => ({ ...current, ...next }));
  }

  return {
    values,
    fieldProps,
    handleSubmit,
    setFieldValues,
    // de 0 a 1, la usa la pista del login
    progress: validFields.length / fields.length,
  };
}
