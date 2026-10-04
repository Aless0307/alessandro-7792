import type { PasswordHash } from './services/passwordHasher';

// Como se guarda en localStorage (la contraseña solo como hash).
export interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  password: PasswordHash;
  balance: number;
  createdAt: string;
}

// Lo que usa la UI, sin el hash.
export type User = Omit<StoredUser, 'password'>;

export interface Session {
  userId: string;
  createdAt: string;
  expiresAt: string;
}
