import { useState } from 'react';
import type { ChargeResponse } from '@snail/shared';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { TextField } from '../../../components/ui/TextField';
import { useZodForm } from '../../../lib/forms/useZodForm';
import { formatCurrency } from '../../../lib/format';
import type { User } from '../../auth/types';
import { formatAmount, formatCardNumber, formatCvv, formatExpirationDate } from '../cardFormat';
import { getOutcomeNotice, type Notice } from '../outcomeNotice';
import { topUp } from '../services/topUpService';
import { EMPTY_TOP_UP_FORM, topUpFormSchema } from '../validation';
import { TestCardPicker } from './TestCardPicker';
import { TopUpSuccess } from './TopUpSuccess';
import styles from './TopUpDialog.module.css';

type Phase =
  | { kind: 'form'; notice: Notice | null }
  | { kind: 'submitting' }
  | { kind: 'success'; response: ChargeResponse; balance: number };

const QUICK_AMOUNTS = [100, 250, 500, 1000];

interface TopUpDialogProps {
  user: User;
  onClose: () => void;
  // Se llama en cuanto se acredita el saldo, para que el panel lo muestre de inmediato.
  onBalanceChange: () => void;
}

export function TopUpDialog({ user, onClose, onBalanceChange }: TopUpDialogProps) {
  const [phase, setPhase] = useState<Phase>({ kind: 'form', notice: null });
  const form = useZodForm(topUpFormSchema, EMPTY_TOP_UP_FORM);
  const isSubmitting = phase.kind === 'submitting';

  const onSubmit = form.handleSubmit(async (data) => {
    // Evita un segundo cobro por doble clic.
    if (isSubmitting) return;
    setPhase({ kind: 'submitting' });

    const result = await topUp(user, data);
    if (result.kind === 'approved') {
      onBalanceChange();
      setPhase({ kind: 'success', response: result.response, balance: result.balance });
    } else {
      setPhase({ kind: 'form', notice: getOutcomeNotice(result) });
    }
  });

  if (phase.kind === 'success') {
    return (
      <Modal title="Recargar saldo" onClose={onClose}>
        <TopUpSuccess response={phase.response} balance={phase.balance} onDone={onClose} />
      </Modal>
    );
  }

  const amount = Number(form.values.amount);
  const submitLabel = amount > 0 ? `Pagar ${formatCurrency(amount)}` : 'Pagar';
  const notice = phase.kind === 'form' ? phase.notice : null;

  return (
    <Modal title="Recargar saldo" onClose={onClose} canClose={!isSubmitting}>
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        {notice && (
          <div role="alert" className={styles.notice}>
            <strong>{notice.title}</strong>
            <p>{notice.message}</p>
            {notice.reference && <p className={styles.reference}>Referencia {notice.reference}</p>}
          </div>
        )}

        <fieldset className={styles.fieldset} disabled={isSubmitting}>
          <TextField
            label="Número de tarjeta"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="1234 1234 1234 1234"
            {...form.fieldProps('card_number', { format: formatCardNumber })}
          />
          <div className={styles.row}>
            <TextField
              label="Vencimiento"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/AA"
              {...form.fieldProps('expiration_date', { format: formatExpirationDate })}
            />
            <TextField
              label="CVV"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="123"
              {...form.fieldProps('cvv', { format: formatCvv })}
            />
          </div>
          <TextField
            label="Nombre en la tarjeta"
            autoComplete="cc-name"
            {...form.fieldProps('cardholder_name')}
          />
          <TextField
            label="Monto a recargar (MXN)"
            inputMode="decimal"
            placeholder="0.00"
            hint="Máximo $10,000 por recarga."
            {...form.fieldProps('amount', { format: formatAmount })}
          />
          <div className={styles.quickAmounts} role="group" aria-label="Montos rápidos">
            {QUICK_AMOUNTS.map((value) => (
              <button
                key={value}
                type="button"
                className={styles.chip}
                aria-pressed={amount === value}
                onClick={() => form.setFieldValues({ amount: String(value) })}
              >
                {formatCurrency(value)}
              </button>
            ))}
          </div>
        </fieldset>

        <Button type="submit" isLoading={isSubmitting} loadingText="Procesando pago…">
          {submitLabel}
        </Button>

        <TestCardPicker
          disabled={isSubmitting}
          onPick={(card) =>
            form.setFieldValues({
              card_number: formatCardNumber(card.number),
              expiration_date: card.expirationDate,
              cvv: card.cvv,
              cardholder_name: form.values.cardholder_name || user.fullName,
            })
          }
        />
      </form>
    </Modal>
  );
}
