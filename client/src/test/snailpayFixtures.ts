import type { ChargeResponse } from '@snail/shared';
import { vi } from 'vitest';

// Respuestas de SnailPay con la misma forma que devuelve el servidor real.
export function chargeResponse(overrides: Partial<ChargeResponse> = {}): ChargeResponse {
  return {
    id: `pay_${Math.random().toString(36).slice(2)}`,
    status: 'approved',
    status_detail: 'accredited',
    message: 'Pago aprobado.',
    transaction_amount: 250,
    date_created: '2026-09-30T12:00:00.000Z',
    authorization_code: '123456',
    reference: 'SNP-20260930-ABC123',
    payer_id: 'user-1',
    payer_email: 'ana@correo.com',
    card_number: '1234123412341234',
    cvv: '543',
    ...overrides,
  };
}

// Sustituye fetch por uno que responde con el cuerpo y el estado HTTP indicados.
export function stubFetchResponse(body: unknown, status: number) {
  const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}
