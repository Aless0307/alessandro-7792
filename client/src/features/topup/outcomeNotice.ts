import { SNAILPAY_TIMEOUT_MS } from '../../config/env';
import type { ChargeOutcome } from './api/snailpayClient';

export interface Notice {
  title: string;
  message: string;
  reference?: string;
}

const BALANCE_UNCHANGED = 'Tu saldo no cambió.';

// Todo lo que no es un aprobado. Siempre se aclara que el saldo no cambió.
export function getOutcomeNotice(outcome: Exclude<ChargeOutcome, { kind: 'approved' }>): Notice {
  switch (outcome.kind) {
    case 'rejected':
      return {
        title: 'Pago rechazado',
        message: `${outcome.response.message} ${BALANCE_UNCHANGED}`,
        reference: outcome.response.reference,
      };
    case 'system_error':
      return {
        title: 'SnailPay no está disponible',
        message: `${outcome.response.message} ${BALANCE_UNCHANGED}`,
        reference: outcome.response.reference,
      };
    case 'timeout':
      return {
        title: 'SnailPay no respondió a tiempo',
        message: `Esperamos ${SNAILPAY_TIMEOUT_MS / 1000} segundos sin respuesta y cancelamos la solicitud. ${BALANCE_UNCHANGED} Intenta de nuevo en un momento.`,
      };
    case 'network_error':
      return {
        title: 'No se pudo conectar con SnailPay',
        message: `Revisa tu conexión e intenta de nuevo. ${BALANCE_UNCHANGED}`,
      };
    case 'unexpected':
      return {
        title: 'No se pudo confirmar el pago',
        message: `SnailPay respondió algo que no se pudo verificar, así que no se aplicó la recarga. ${BALANCE_UNCHANGED}`,
      };
  }
}
