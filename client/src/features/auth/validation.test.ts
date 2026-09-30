import { describe, expect, it } from 'vitest';
import { toFieldErrors } from '../../lib/forms/fieldErrors';
import { loginSchema, registerSchema } from './validation';

const validRegistration = {
  fullName: 'Ana López',
  email: 'ana@correo.com',
  password: 'caracol123',
  confirmPassword: 'caracol123',
};

function registerErrors(overrides: Partial<typeof validRegistration>) {
  const result = registerSchema.safeParse({ ...validRegistration, ...overrides });
  return result.success ? {} : toFieldErrors<typeof validRegistration>(result.error);
}

describe('registerSchema', () => {
  it('acepta un registro válido y normaliza el correo', () => {
    const result = registerSchema.parse({ ...validRegistration, email: '  Ana@Correo.COM ' });

    expect(result.email).toBe('ana@correo.com');
  });

  it.each([
    ['nombre vacío', { fullName: '   ' }, 'fullName'],
    ['nombre con números', { fullName: 'Ana 123' }, 'fullName'],
    ['correo inválido', { email: 'ana@' }, 'email'],
    ['contraseña corta', { password: 'a1', confirmPassword: 'a1' }, 'password'],
    [
      'contraseña sin número',
      { password: 'caracolitos', confirmPassword: 'caracolitos' },
      'password',
    ],
    ['contraseña sin letra', { password: '12345678', confirmPassword: '12345678' }, 'password'],
    ['confirmación distinta', { confirmPassword: 'caracol124' }, 'confirmPassword'],
  ])('rechaza %s', (_case, overrides, field) => {
    expect(registerErrors(overrides)).toHaveProperty(field);
  });

  it('avisa que las contraseñas no coinciden aunque otro campo tenga error', () => {
    const errors = registerErrors({ fullName: '', confirmPassword: 'otra123abc' });

    expect(errors.confirmPassword).toBe('Las contraseñas no coinciden.');
  });
});

describe('loginSchema', () => {
  it('pide correo y contraseña', () => {
    const result = loginSchema.safeParse({ email: '', password: '' });

    expect(result.success).toBe(false);
    expect(
      result.success ? {} : toFieldErrors<typeof validRegistration>(result.error),
    ).toMatchObject({
      email: expect.any(String),
      password: expect.any(String),
    });
  });
});
