import type { ChargeStatus, ChargeStatusDetail } from './snailpay';

// Tarjetas de prueba de SnailPay (todas ficticias). Única fuente para el servidor, que decide
// el resultado con ellas, y para el frontend, que las ofrece para reproducir cada escenario.

export type TestCardOutcome =
  | { kind: 'approved' }
  | { kind: 'result'; status: ChargeStatus; detail: ChargeStatusDetail }
  | { kind: 'slow_response' };

export interface TestCard {
  number: string;
  expirationDate: string;
  cvv: string;
  label: string;
  outcome: TestCardOutcome;
}

const EXPIRATION = '12/26';
const CVV = '543';

export const SNAILPAY_TEST_CARDS: readonly TestCard[] = [
  {
    number: '1234123412341234',
    expirationDate: EXPIRATION,
    cvv: CVV,
    label: 'Pago aprobado',
    outcome: { kind: 'approved' },
  },
  {
    number: '4000000000000002',
    expirationDate: EXPIRATION,
    cvv: CVV,
    label: 'Tarjeta rechazada',
    outcome: { kind: 'result', status: 'rejected', detail: 'card_declined' },
  },
  {
    number: '4000000000009995',
    expirationDate: EXPIRATION,
    cvv: CVV,
    label: 'Fondos insuficientes',
    outcome: { kind: 'result', status: 'rejected', detail: 'insufficient_funds' },
  },
  {
    number: '4000000000000069',
    expirationDate: EXPIRATION,
    cvv: CVV,
    label: 'Tarjeta vencida',
    outcome: { kind: 'result', status: 'rejected', detail: 'expired_card' },
  },
  {
    number: '4000000000000500',
    expirationDate: EXPIRATION,
    cvv: CVV,
    label: 'Error del sistema',
    outcome: { kind: 'result', status: 'error', detail: 'service_unavailable' },
  },
  {
    number: '4000000000000408',
    expirationDate: EXPIRATION,
    cvv: CVV,
    label: 'Respuesta lenta (timeout)',
    outcome: { kind: 'slow_response' },
  },
];
