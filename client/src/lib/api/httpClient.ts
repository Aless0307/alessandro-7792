import { API_BASE_URL } from '../../config/env';

// La respuesta pasó el tiempo límite y se canceló.
export class RequestTimeoutError extends Error {
  constructor() {
    super('La solicitud tardó demasiado y se canceló.');
    this.name = 'RequestTimeoutError';
  }
}

// No hubo respuesta: servidor apagado, sin conexión, CORS, etc.
export class NetworkError extends Error {
  constructor() {
    super('No se pudo conectar con el servidor.');
    this.name = 'NetworkError';
  }
}

export interface HttpResponse {
  status: number;
  // Sin tipo a propósito: quien llama debe validar la forma antes de usarla.
  data: unknown;
}

interface RequestOptions {
  timeoutMs: number;
}

// POST con JSON y tiempo límite. No lanza por códigos 4xx/5xx: esas respuestas
// traen información útil (por ejemplo, un pago rechazado) y quien llama decide.
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
    // Leer el cuerpo también cuenta dentro del tiempo límite.
    const data: unknown = await response.json().catch(() => null);
    return { status: response.status, data };
  } catch (error) {
    if (controller.signal.aborted) throw new RequestTimeoutError();
    throw error instanceof TypeError ? new NetworkError() : error;
  } finally {
    clearTimeout(timer);
  }
}
