import { STORAGE_KEYS, readJson, removeItem, writeJson } from '../../../lib/storage/localStore';
import type { Session, StoredUser, User } from '../types';
import type { LoginInput, RegisterInput } from '../validation';
import { hashPassword, verifyPassword } from './passwordHasher';

// Simulación local del backend de autenticación: toda la persistencia vive en localStorage.
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export class AuthError extends Error {
  constructor(
    public readonly code: 'EMAIL_TAKEN' | 'INVALID_CREDENTIALS',
    message: string,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export async function register(input: RegisterInput): Promise<User> {
  const users = getStoredUsers();
  if (users.some((user) => user.email === input.email)) {
    throw new AuthError('EMAIL_TAKEN', 'Ya existe una cuenta con este correo. Inicia sesión.');
  }

  const user: StoredUser = {
    id: crypto.randomUUID(),
    fullName: input.fullName,
    email: input.email,
    password: await hashPassword(input.password),
    balance: 0,
    createdAt: new Date().toISOString(),
  };
  writeJson(STORAGE_KEYS.users, [...users, user]);
  startSession(user.id);
  return toPublicUser(user);
}

export async function login(input: LoginInput): Promise<User> {
  const user = getStoredUsers().find((candidate) => candidate.email === input.email);
  // Mismo mensaje si el correo no existe o si la contraseña falla: no se revela qué cuentas existen.
  if (!user || !(await verifyPassword(input.password, user.password))) {
    throw new AuthError('INVALID_CREDENTIALS', 'El correo o la contraseña no son correctos.');
  }
  startSession(user.id);
  return toPublicUser(user);
}

export function logout(): void {
  removeItem(STORAGE_KEYS.session);
}

export function getCurrentUser(): User | null {
  const session = readJson<Session>(STORAGE_KEYS.session);
  if (!session) return null;

  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    logout();
    return null;
  }

  const user = getStoredUsers().find((candidate) => candidate.id === session.userId);
  return user ? toPublicUser(user) : null;
}

function startSession(userId: string): void {
  const now = Date.now();
  const session: Session = {
    userId,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + SESSION_DURATION_MS).toISOString(),
  };
  writeJson(STORAGE_KEYS.session, session);
}

function getStoredUsers(): StoredUser[] {
  const users = readJson<StoredUser[]>(STORAGE_KEYS.users);
  return Array.isArray(users) ? users : [];
}

function toPublicUser({ password: _password, ...user }: StoredUser): User {
  return user;
}
