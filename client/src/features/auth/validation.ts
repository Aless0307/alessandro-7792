import { z } from 'zod';

const email = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, 'Escribe tu correo.')
  .pipe(z.email('Escribe un correo válido, por ejemplo ana@correo.com.'));

export const PASSWORD_RULES = [
  { id: 'length', label: 'Al menos 8 caracteres', test: (value: string) => value.length >= 8 },
  { id: 'letter', label: 'Una letra', test: (value: string) => /\p{L}/u.test(value) },
  { id: 'number', label: 'Un número', test: (value: string) => /\d/.test(value) },
] as const;

const newPassword = z
  .string()
  .max(128, 'Usa como máximo 128 caracteres.')
  .refine((value) => PASSWORD_RULES.every((rule) => rule.test(value)), {
    message: 'La contraseña necesita al menos 8 caracteres, una letra y un número.',
  });

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, 'Escribe tu nombre completo.')
      .min(3, 'El nombre debe tener al menos 3 caracteres.')
      .max(80, 'Usa como máximo 80 caracteres.')
      .regex(/^[\p{L}' .-]+$/u, 'Usa solo letras, espacios, apóstrofos o guiones.'),
    email,
    password: newPassword,
    confirmPassword: z.string().min(1, 'Confirma tu contraseña.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Las contraseñas no coinciden.',
    // Sin esto, Zod omite la comparación mientras otro campo tenga errores.
    when: ({ value }) => {
      const data = value as { password?: unknown; confirmPassword?: unknown };
      return typeof data.password === 'string' && typeof data.confirmPassword === 'string';
    },
  });

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Escribe tu contraseña.'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
