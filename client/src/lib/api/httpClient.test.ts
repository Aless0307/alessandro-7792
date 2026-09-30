import { afterEach, describe, expect, it, vi } from 'vitest';
import { NetworkError, RequestTimeoutError, postJson } from './httpClient';

// fetch que nunca responde, pero que respeta la cancelación como el real.
function hangingFetch(_url: string, init?: RequestInit): Promise<Response> {
  return new Promise((_resolve, reject) => {
    init?.signal?.addEventListener('abort', () =>
      reject(new DOMException('The operation was aborted.', 'AbortError')),
    );
  });
}

describe('postJson', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('devuelve el estado y el cuerpo, también en respuestas 4xx/5xx', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(new Response(JSON.stringify({ status: 'rejected' }), { status: 402 })),
    );

    await expect(postJson('/api/x', {}, { timeoutMs: 1000 })).resolves.toEqual({
      status: 402,
      data: { status: 'rejected' },
    });
  });

  it('cancela y lanza RequestTimeoutError cuando se agota el tiempo', async () => {
    const fetchMock = vi.fn(hangingFetch);
    vi.stubGlobal('fetch', fetchMock);

    await expect(postJson('/api/x', {}, { timeoutMs: 20 })).rejects.toBeInstanceOf(
      RequestTimeoutError,
    );
    expect(fetchMock.mock.calls[0]![1]!.signal!.aborted).toBe(true);
  });

  it('traduce un fallo de red a NetworkError', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(postJson('/api/x', {}, { timeoutMs: 1000 })).rejects.toBeInstanceOf(NetworkError);
  });

  it('entrega data null si el cuerpo no es JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('<html>502</html>', { status: 502 })),
    );

    await expect(postJson('/api/x', {}, { timeoutMs: 1000 })).resolves.toEqual({
      status: 502,
      data: null,
    });
  });
});
