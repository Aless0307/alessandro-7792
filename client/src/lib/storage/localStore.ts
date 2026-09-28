// Envoltura tipada de localStorage. Todas las claves de la app pasan por aquí,
// con un prefijo común y sin que un JSON corrupto o un navegador bloqueado rompa la app.
const PREFIX = 'snailbet:';

export const STORAGE_KEYS = {
  users: 'users',
  session: 'session',
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
    // Si el almacenamiento no está disponible no hay nada que borrar.
  }
}
