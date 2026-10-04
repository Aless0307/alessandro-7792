import { API_BASE_URL } from '../../config/env';

export class RequestTimeoutError extends Error {
  constructor() {
    super('La solicitud tardó demasiado y se canceló.');
    this.name = 'RequestTimeoutError';
  }
}

// sin respuesta: servidor caído, sin red, CORS...
export class NetworkError extends Error {
  constructor() {
    super('No se pudo conectar con el servidor.');
    this.name = 'NetworkError';
  }
}

export interface HttpResponse {
  status: number;
  // unknown a propósito: quien llama valida la forma
  data: unknown;
}

interface RequestOptions {
  timeoutMs: number;
}

// No lanza en 4xx/5xx: SnailPay manda info útil en esos casos (p. ej. un rechazo).
export async function postJson(
  path: string,
  body: unknown,
  { timeoutMs }: RequestOptions,
): Promise<HttpResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    // leer el body también cuenta para el timeout
    const data: unknown = await response.json().catch(() => null);
    return { status: response.status, data };
  } catch (error) {
    if (controller.signal.aborted) throw new RequestTimeoutError();
    throw error instanceof TypeError ? new NetworkError() : error;
  } finally {
    clearTimeout(timer);
  }
}
