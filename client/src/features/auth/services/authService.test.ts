import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  AuthError,
  SESSION_DURATION_MS,
  getCurrentUser,
  login,
  logout,
  register,
} from './authService';

const ana = {
  fullName: 'Ana López',
  email: 'ana@correo.com',
  password: 'caracol123',
  confirmPassword: 'caracol123',
};

describe('authService', () => {
  afterEach(() => vi.useRealTimers());

  it('registra al usuario con saldo $0 y deja la sesión iniciada', async () => {
    const user = await register(ana);

    expect(user).toMatchObject({ fullName: 'Ana López', email: 'ana@correo.com', balance: 0 });
    expect(getCurrentUser()?.id).toBe(user.id);
  });

  it('nunca guarda la contraseña en texto plano en localStorage', async () => {
    await register(ana);

    const everything = Object.values({ ...localStorage }).join('');
    expect(everything).not.toContain(ana.password);
  });

  it('no expone el hash de la contraseña a la interfaz', async () => {
    const user = await register(ana);

    expect(user).not.toHaveProperty('password');
  });

  it('rechaza registrar dos veces el mismo correo', async () => {
    await register(ana);

    await expect(register(ana)).rejects.toMatchObject({ code: 'EMAIL_TAKEN' });
  });

  it('cierra sesión y permite volver a entrar con las mismas credenciales', async () => {
    await register(ana);
    logout();
    expect(getCurrentUser()).toBeNull();

    const user = await login({ email: ana.email, password: ana.password });

    expect(user.fullName).toBe('Ana López');
    expect(getCurrentUser()?.email).toBe(ana.email);
  });

  it('da el mismo error si el correo no existe o si la contraseña es incorrecta', async () => {
    await register(ana);
    logout();

    const wrongPassword = login({ email: ana.email, password: 'otra123abc' }).catch((e) => e);
    const unknownEmail = login({ email: 'nadie@correo.com', password: ana.password }).catch(
      (e) => e,
    );

    const [a, b] = await Promise.all([wrongPassword, unknownEmail]);
    expect(a).toBeInstanceOf(AuthError);
    expect(a.message).toBe(b.message);
    expect(getCurrentUser()).toBeNull();
  });

  it('descarta una sesión vencida', async () => {
    await register(ana);

    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(Date.now() + SESSION_DURATION_MS + 1);

    expect(getCurrentUser()).toBeNull();
  });

  it('ignora datos corruptos en localStorage sin romperse', () => {
    localStorage.setItem('snailbet:session', '{no es json');

    expect(getCurrentUser()).toBeNull();
  });
});
