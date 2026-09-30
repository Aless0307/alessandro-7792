import { describe, expect, it } from 'vitest';
import { chargeResponse } from '../../test/snailpayFixtures';
import { getOutcomeNotice } from './outcomeNotice';

describe('getOutcomeNotice', () => {
  it.each([
    [
      'rejected',
      { kind: 'rejected', response: chargeResponse({ status: 'rejected' }) },
      'Pago rechazado',
    ],
    [
      'system_error',
      { kind: 'system_error', response: chargeResponse({ status: 'error' }) },
      'SnailPay no está disponible',
    ],
    ['timeout', { kind: 'timeout' }, 'SnailPay no respondió a tiempo'],
    ['network_error', { kind: 'network_error' }, 'No se pudo conectar con SnailPay'],
    ['unexpected', { kind: 'unexpected' }, 'No se pudo confirmar el pago'],
  ] as const)('%s: título claro y aviso de que el saldo no cambió', (_kind, outcome, title) => {
    const notice = getOutcomeNotice(outcome);

    expect(notice.title).toBe(title);
    expect(notice.message).toContain('Tu saldo no cambió.');
  });

  it('usa el mensaje de SnailPay y muestra la referencia cuando hay respuesta', () => {
    const response = chargeResponse({
      status: 'rejected',
      message: 'La tarjeta está vencida. Usa una tarjeta vigente.',
      reference: 'SNP-20260930-XYZ789',
    });

    const notice = getOutcomeNotice({ kind: 'rejected', response });

    expect(notice.message).toContain('La tarjeta está vencida.');
    expect(notice.reference).toBe('SNP-20260930-XYZ789');
  });
});
