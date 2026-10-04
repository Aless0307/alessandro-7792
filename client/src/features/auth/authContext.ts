import { createContext, useContext } from 'react';
import type { User } from './types';
import type { LoginInput, RegisterInput } from './validation';

export interface AuthContextValue {
  user: User | null;
  register: (input: RegisterInput) => Promise<void>;
  login: (input: LoginInput) => Promise<void>;
  logout: () => void;
  // relee el usuario de localStorage, p. ej. después de una recarga de saldo
  refreshUser: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return context;
}
