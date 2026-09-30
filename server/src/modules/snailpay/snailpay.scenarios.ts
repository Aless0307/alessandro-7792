import {
  SNAILPAY_TEST_CARDS,
  type ChargeStatusDetail,
  type TestCard,
  type TestCardOutcome,
} from '@snail/shared';

// Las tarjetas de prueba vienen del paquete compartido (también las usa el frontend).

export const APPROVED_CARD: TestCard = SNAILPAY_TEST_CARDS.find(
  (card) => card.outcome.kind === 'approved',
)!;

// Resultado fijo por número de tarjeta; la tarjeta aprobada se trata aparte porque
// además exige que coincidan la fecha y el CVV.
export const TEST_CARDS: Record<
  string,
  Exclude<TestCardOutcome, { kind: 'approved' }>
> = Object.fromEntries(
  SNAILPAY_TEST_CARDS.flatMap((card) =>
    card.outcome.kind === 'approved' ? [] : [[card.number, card.outcome]],
  ),
);

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
