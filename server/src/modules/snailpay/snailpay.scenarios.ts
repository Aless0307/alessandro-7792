import {
  SNAILPAY_TEST_CARDS,
  type ChargeStatusDetail,
  type TestCard,
  type TestCardOutcome,
} from '@snail/shared';

export const APPROVED_CARD: TestCard = SNAILPAY_TEST_CARDS.find(
  (card) => card.outcome.kind === 'approved',
)!;

// La aprobada va aparte porque además valida fecha y CVV.
export const TEST_CARDS: Record<
  string,
  Exclude<TestCardOutcome, { kind: 'approved' }>
> = Object.fromEntries(
  SNAILPAY_TEST_CARDS.flatMap((card) =>
    card.outcome.kind === 'approved' ? [] : [[card.number, card.outcome]],
  ),
);

export const MESSAGES: Record<ChargeStatusDetail, string> = {
  accredited: 'Pago aprobado.',
  invalid_data: 'Algunos datos no son válidos. Revisa los campos marcados.',
  invalid_card_data:
    'Los datos de la tarjeta no coinciden. Revisa la fecha de vencimiento y el CVV.',
  card_declined: 'Tu banco rechazó el pago. Prueba con otra tarjeta.',
  insufficient_funds:
    'La tarjeta no tiene fondos suficientes. Prueba con otra tarjeta o un monto menor.',
  expired_card: 'La tarjeta está vencida. Usa una tarjeta vigente.',
  unknown_card: 'SnailPay no reconoce esta tarjeta. Revisa el número o usa otra tarjeta.',
  service_unavailable:
    'SnailPay tiene un problema y no pudo procesar el pago. No se hizo ningún cargo; intenta más tarde.',
  gateway_timeout:
    'SnailPay tardó demasiado en responder. No se hizo ningún cargo; intenta más tarde.',
};
