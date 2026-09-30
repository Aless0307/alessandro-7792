import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { chargeResponse, stubFetchResponse } from '../../../test/snailpayFixtures';
import { getCurrentUser, register } from '../../auth/services/authService';
import type { User } from '../../auth/types';
import { getCharges } from './chargeHistory';
import { topUp } from './topUpService';

const form = {
  card_number: '1234123412341234',
  expiration_date: '12/26',
  cvv: '543',
  cardholder_name: 'Ana López',
  amount: 250,
};

let user: User;

describe('topUp', () => {
  beforeEach(async () => {
    user = await register({
      fullName: 'Ana López',
      email: 'ana@correo.com',
      password: 'caracol123',
      confirmPassword: 'caracol123',
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  it('con cobro aprobado suma el monto y lo guarda en localStorage', async () => {
    stubFetchResponse(chargeResponse({ payer_id: user.id }), 201);

    const result = await topUp(user, form);

    expect(result.kind).toBe('approved');
    expect(result.balance).toBe(250);
    expect(getCurrentUser()?.balance).toBe(250);
  });

  it('guarda la operación con número de tarjeta y CVV, como pide el enunciado', async () => {
    stubFetchResponse(chargeResponse({ payer_id: user.id }), 201);

    await topUp(user, form);

    expect(getCharges()[0]).toMatchObject({ card_number: '1234123412341234', cvv: '543' });
  });

  it.each([
    [
      'rechazado',
      chargeResponse({
        status: 'rejected',
        status_detail: 'card_declined',
        authorization_code: null,
      }),
      402,
    ],
    [
      'error del sistema',
      chargeResponse({
        status: 'error',
        status_detail: 'service_unavailable',
        authorization_code: null,
      }),
      503,
    ],
    ['respuesta sospechosa', chargeResponse({ authorization_code: null }), 201],
  ])('con resultado %s el saldo no cambia', async (_case, body, status) => {
    stubFetchResponse({ ...body, payer_id: user.id }, status);

    const result = await topUp(user, form);

    expect(result.balance).toBe(0);
    expect(getCurrentUser()?.balance).toBe(0);
  });

  it('no acredita dos veces la misma operación', async () => {
    const response = chargeResponse({ id: 'pay_repetido', payer_id: user.id });
    stubFetchResponse(response, 201);
    await topUp(user, form);

    stubFetchResponse(response, 201);
    await topUp(getCurrentUser()!, form);

    expect(getCurrentUser()?.balance).toBe(250);
  });

  it('acumula recargas redondeando a centavos', async () => {
    stubFetchResponse(chargeResponse({ payer_id: user.id, transaction_amount: 0.1 }), 201);
    await topUp(user, { ...form, amount: 0.1 });
    stubFetchResponse(chargeResponse({ payer_id: user.id, transaction_amount: 0.2 }), 201);
    await topUp(getCurrentUser()!, { ...form, amount: 0.2 });

    expect(getCurrentUser()?.balance).toBe(0.3);
  });
});
