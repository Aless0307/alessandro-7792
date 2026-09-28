import { describe, expect, it } from 'vitest';
import { hashPassword, verifyPassword } from './passwordHasher';

// Pocas iteraciones para que las pruebas sean rápidas; el algoritmo es el mismo.
const FAST_ITERATIONS = 1_000;

describe('passwordHasher', () => {
  it('no guarda la contraseña en texto plano', async () => {
    const stored = await hashPassword('caracol123', FAST_ITERATIONS);

    expect(JSON.stringify(stored)).not.toContain('caracol123');
  });

  it('verifica la contraseña correcta y rechaza una incorrecta', async () => {
    const stored = await hashPassword('caracol123', FAST_ITERATIONS);

    await expect(verifyPassword('caracol123', stored)).resolves.toBe(true);
    await expect(verifyPassword('caracol124', stored)).resolves.toBe(false);
  });

  it('usa una sal distinta cada vez: misma contraseña, hash distinto', async () => {
    const first = await hashPassword('caracol123', FAST_ITERATIONS);
    const second = await hashPassword('caracol123', FAST_ITERATIONS);

    expect(first.salt).not.toBe(second.salt);
    expect(first.hash).not.toBe(second.hash);
  });
});
