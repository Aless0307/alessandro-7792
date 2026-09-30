import { creditBalance } from '../../auth/services/authService';
import type { User } from '../../auth/types';
import { requestCharge, type ChargeOutcome } from '../api/snailpayClient';
import type { TopUpFormData } from '../validation';
import { recordCharge } from './chargeHistory';

export type TopUpResult = ChargeOutcome & { balance: number };

// Recarga de saldo: pide el cobro a SnailPay, guarda la operación y acredita el saldo
// solo si el cobro se aprobó. En cualquier otro caso el saldo no se toca.
export async function topUp(user: User, form: TopUpFormData): Promise<TopUpResult> {
  const outcome = await requestCharge({
    ...form,
    payer_id: user.id,
    payer_email: user.email,
  });

  if (!('response' in outcome)) {
    return { ...outcome, balance: user.balance };
  }

  const isNew = recordCharge(outcome.response);
  if (outcome.kind !== 'approved' || !isNew) {
    return { ...outcome, balance: user.balance };
  }

  // requestCharge ya comprobó que el monto aprobado es el mismo que se pidió.
  const updated = creditBalance(user.id, form.amount);
  return { ...outcome, balance: updated.balance };
}
