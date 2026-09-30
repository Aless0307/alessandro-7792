import type { ChargeStatus, ChargeStatusDetail } from '@snail/shared';

// Tarjetas de prueba de SnailPay: cada una provoca un resultado conocido.
// Esta tabla es la fuente de la documentación del README.

export const APPROVED_CARD = {
  number: '1234123412341234',
  expirationDate: '12/26',
  cvv: '543',
} as const;

export type ScenarioOutcome =
  { kind: 'result'; status: ChargeStatus; detail: ChargeStatusDetail } | { kind: 'slow_response' };

export const TEST_CARDS: Record<string, ScenarioOutcome> = {
  '4000000000000002': { kind: 'result', status: 'rejected', detail: 'card_declined' },
  '4000000000009995': { kind: 'result', status: 'rejected', detail: 'insufficient_funds' },
  '4000000000000069': { kind: 'result', status: 'rejected', detail: 'expired_card' },
  '4000000000000500': { kind: 'result', status: 'error', detail: 'service_unavailable' },
  '4000000000000408': { kind: 'slow_response' },
};

// Mensajes para el usuario: dicen qué pasó y qué puede hacer.
export const MESSAGES: Record<ChargeStatusDetail, string> = {
  accredited: 'Pago aprobado.',
  invalid_data: 'Algunos datos no son válidos. Revisa los campos marcados.',
  invalid_card_data:
    'Los datos de la tarjeta no coinciden. Revisa la fecha de vencimiento y el CVV.',
  card_declined: 'Tu banco rechazó el pago. Prueba con otra tarjeta.',
  insufficient_funds:
    'La tarjeta no tiene fondos suficientes. Prueba con otra tarjeta o un monto menor.',
  expired_card: 'La tarjeta está vencida. Usa una tarjeta vigente.',
  amount_limit_exceeded:
    'El monto supera el límite de $10,000 por recarga. Prueba con un monto menor.',
  unknown_card: 'SnailPay no reconoce esta tarjeta. Revisa el número o usa otra tarjeta.',
  service_unavailable:
    'SnailPay tiene un problema y no pudo procesar el pago. No se hizo ningún cargo; intenta más tarde.',
  gateway_timeout:
    'SnailPay tardó demasiado en responder. No se hizo ningún cargo; intenta más tarde.',
};
