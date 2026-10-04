import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { AuthContext } from './authContext';
import * as authService from './services/authService';
import type { User } from './types';
import type { LoginInput, RegisterInput } from './validation';

export function AuthProvider({ children }: { children: ReactNode }) {
  // se lee la sesión guardada al montar, por eso sobrevive a un F5
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());

  const register = useCallback(async (input: RegisterInput) => {
    setUser(await authService.register(input));
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    setUser(await authService.login(input));
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(() => {
    setUser(authService.getCurrentUser());
  }, []);

  const value = useMemo(
    () => ({ user, register, login, logout, refreshUser }),
    [user, register, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
