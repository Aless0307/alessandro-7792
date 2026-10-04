import { creditBalance } from '../../auth/services/authService';
import type { User } from '../../auth/types';
import { requestCharge, type ChargeOutcome } from '../api/snailpayClient';
import type { TopUpFormData } from '../validation';
import { recordCharge } from './chargeHistory';

export type TopUpResult = ChargeOutcome & { balance: number };

// Solo se acredita si SnailPay aprobó; en cualquier otro caso el saldo queda igual.
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

  // requestCharge ya validó que el monto aprobado es el pedido
  const updated = creditBalance(user.id, form.amount);
  return { ...outcome, balance: updated.balance };
}
