import { API_BASE_URL } from '../../config/env';

// Cliente HTTP mínimo. En la fase 4 se amplía con timeout y errores tipados.
export async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return (await response.json()) as T;
}
