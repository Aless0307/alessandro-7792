import type { PasswordHash } from './services/passwordHasher';

// Lo que se guarda en localStorage. Nunca incluye la contraseña en texto plano.
export interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  password: PasswordHash;
  balance: number;
  createdAt: string;
}

// Lo que la UI puede ver del usuario: sin datos de la contraseña.
export type User = Omit<StoredUser, 'password'>;

export interface Session {
  userId: string;
  createdAt: string;
  expiresAt: string;
}
