// Wrapper de localStorage: todas las claves llevan el prefijo y un JSON corrupto no rompe la app.
const PREFIX = 'snailbet:';

export const STORAGE_KEYS = {
  users: 'users',
  session: 'session',
  charges: 'charges',
} as const;

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

export function readJson<T>(key: StorageKey): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? null : (JSON.parse(raw) as T);
  } catch {
    return null;
  }
}

export function writeJson<T>(key: StorageKey, value: T): void {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

export function removeItem(key: StorageKey): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    // sin acceso a localStorage no hay nada que borrar
  }
}
