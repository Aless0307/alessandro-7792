import { SNAILPAY_MAX_AMOUNT } from '@snail/shared';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../app';

const validCharge = {
  card_number: '1234 1234 1234 1234',
  expiration_date: '12/26',
  cvv: '543',
  cardholder_name: 'Ana López',
  amount: 250.5,
  payer_id: 'user-123',
  payer_email: 'ana@correo.com',
};

function charge(body: object, options?: Parameters<typeof createApp>[0]) {
  return request(createApp(options)).post('/api/snailpay/charges').send(body);
}

const REQUIRED_FIELDS = [
  'id',
  'status',
  'status_detail',
  'transaction_amount',
  'date_created',
  'authorization_code',
  'reference',
  'payer_id',
  'payer_email',
];

describe('POST /api/snailpay/charges', () => {
  describe('cobro exitoso', () => {
    it('aprueba la tarjeta de prueba 1234 1234 1234 1234', async () => {
      const res = await charge(validCharge);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        status: 'approved',
        status_detail: 'accredited',
        transaction_amount: 250.5,
        payer_id: 'user-123',
        payer_email: 'ana@correo.com',
        card_number: '1234123412341234',
        cvv: '543',
      });
      expect(res.body.authorization_code).toMatch(/^\d{6}$/);
      expect(res.body.reference).toMatch(/^SNP-\d{8}-[A-Z0-9]{6}$/);
      expect(res.body.id).toMatch(/^pay_/);
    });

    it('incluye todos los campos exigidos en la respuesta', async () => {
      const res = await charge(validCharge);

      for (const field of REQUIRED_FIELDS) expect(res.body).toHaveProperty(field);
    });
  });

  describe('errores de transacción', () => {
    it.each([
      ['4000000000000002', 'card_declined'],
      ['4000000000009995', 'insufficient_funds'],
      ['4000000000000069', 'expired_card'],
      ['9999888877776666', 'unknown_card'],
    ])('la tarjeta %s se rechaza con %s', async (cardNumber, detail) => {
      const res = await charge({ ...validCharge, card_number: cardNumber });

      expect(res.status).toBe(402);
      expect(res.body).toMatchObject({ status: 'rejected', status_detail: detail });
      expect(res.body.authorization_code).toBeNull();
      for (const field of REQUIRED_FIELDS) expect(res.body).toHaveProperty(field);
    });

    it('rechaza la tarjeta aprobada si la fecha o el CVV no coinciden', async () => {
      const wrongCvv = await charge({ ...validCharge, cvv: '999' });
      const wrongDate = await charge({ ...validCharge, expiration_date: '11/27' });

      expect(wrongCvv.body.status_detail).toBe('invalid_card_data');
      expect(wrongDate.body.status_detail).toBe('invalid_card_data');
    });

    it('rechaza montos mayores al límite por recarga', async () => {
      const res = await charge({ ...validCharge, amount: SNAILPAY_MAX_AMOUNT + 0.01 });

      expect(res.status).toBe(402);
      expect(res.body.status_detail).toBe('amount_limit_exceeded');
    });

    it('rechaza datos mal formados indicando el error de cada campo', async () => {
      const res = await charge({
        ...validCharge,
        card_number: '1234',
        cvv: 'abc',
        amount: -5,
        cardholder_name: '  ',
      });

      expect(res.status).toBe(422);
      expect(res.body).toMatchObject({ status: 'rejected', status_detail: 'invalid_data' });
      const fields = res.body.errors.map((error: { field: string }) => error.field);
      expect(fields).toEqual(
        expect.arrayContaining(['card_number', 'cvv', 'amount', 'cardholder_name']),
      );
    });

    it('rechaza montos con más de 2 decimales', async () => {
      const res = await charge({ ...validCharge, amount: 10.001 });

      expect(res.body.status_detail).toBe('invalid_data');
    });

    it('acepta montos con 2 decimales sin errores de punto flotante', async () => {
      const res = await charge({ ...validCharge, amount: 10.1 });

      expect(res.body.status).toBe('approved');
    });
  });

  describe('error del sistema', () => {
    it('la tarjeta de error interno responde 503 sin aprobar nada', async () => {
      const res = await charge({ ...validCharge, card_number: '4000000000000500' });

      expect(res.status).toBe(503);
      expect(res.body).toMatchObject({ status: 'error', status_detail: 'service_unavailable' });
      expect(res.body.authorization_code).toBeNull();
    });

    it('con la caída forzada ni siquiera la tarjeta válida se aprueba', async () => {
      const res = await charge(validCharge, { snailpay: { forceOutage: true } });

      expect(res.status).toBe(503);
      expect(res.body.status).toBe('error');
      expect(res.body.authorization_code).toBeNull();
    });

    it('la tarjeta lenta termina en error de timeout, nunca en aprobación', async () => {
      const res = await charge(
        { ...validCharge, card_number: '4000000000000408' },
        { snailpay: { slowResponseMs: 10 } },
      );

      expect(res.status).toBe(504);
      expect(res.body).toMatchObject({ status: 'error', status_detail: 'gateway_timeout' });
    });
  });
});
