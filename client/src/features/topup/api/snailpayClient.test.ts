import { afterEach, describe, expect, it, vi } from 'vitest';
import { chargeResponse, stubFetchResponse } from '../../../test/snailpayFixtures';
import { requestCharge } from './snailpayClient';

const request = {
  card_number: '1234123412341234',
  expiration_date: '12/26',
  cvv: '543',
  cardholder_name: 'Ana López',
  amount: 250,
  payer_id: 'user-1',
  payer_email: 'ana@correo.com',
};

describe('requestCharge', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('clasifica un cobro aprobado', async () => {
    stubFetchResponse(chargeResponse(), 201);

    await expect(requestCharge(request)).resolves.toMatchObject({ kind: 'approved' });
  });

  it('clasifica rechazos y errores del sistema', async () => {
    stubFetchResponse(
      chargeResponse({
        status: 'rejected',
        status_detail: 'card_declined',
        authorization_code: null,
      }),
      402,
    );
    await expect(requestCharge(request)).resolves.toMatchObject({ kind: 'rejected' });

    stubFetchResponse(
      chargeResponse({
        status: 'error',
        status_detail: 'service_unavailable',
        authorization_code: null,
      }),
      503,
    );
    await expect(requestCharge(request)).resolves.toMatchObject({ kind: 'system_error' });
  });

  describe('no acepta falsos cobros exitosos', () => {
    it.each([
      ['un "approved" con HTTP 500', chargeResponse(), 500],
      [
        'un "approved" sin código de autorización',
        chargeResponse({ authorization_code: null }),
        201,
      ],
      ['un "approved" por otro monto', chargeResponse({ transaction_amount: 9999 }), 201],
      ['un "approved" para otro usuario', chargeResponse({ payer_id: 'otro' }), 201],
      ['una respuesta que no cumple el contrato', { status: 'approved' }, 201],
    ])('rechaza %s', async (_case, body, status) => {
      stubFetchResponse(body, status);

      await expect(requestCharge(request)).resolves.toEqual({ kind: 'unexpected' });
    });
  });

  it('informa timeout cuando SnailPay no responde a tiempo', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_url: string, init?: RequestInit) =>
          new Promise((_resolve, reject) =>
            init?.signal?.addEventListener('abort', () =>
              reject(new DOMException('aborted', 'AbortError')),
            ),
          ),
      ),
    );

    await expect(requestCharge(request, 20)).resolves.toEqual({ kind: 'timeout' });
  });

  it('informa error de red cuando no hay conexión', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(requestCharge(request)).resolves.toEqual({ kind: 'network_error' });
  });
});
