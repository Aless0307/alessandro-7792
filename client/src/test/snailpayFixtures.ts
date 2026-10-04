import type { ChargeResponse } from '@snail/shared';
import { vi } from 'vitest';

// misma forma que la respuesta real del server
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

export function stubFetchResponse(body: unknown, status: number) {
  const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}
