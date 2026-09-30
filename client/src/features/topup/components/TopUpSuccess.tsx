import type { ChargeResponse } from '@snail/shared';
import { Button } from '../../../components/ui/Button';
import { formatCurrency } from '../../../lib/format';
import { maskCardNumber } from '../cardFormat';
import styles from './TopUpSuccess.module.css';

interface TopUpSuccessProps {
  response: ChargeResponse;
  balance: number;
  onDone: () => void;
}

export function TopUpSuccess({ response, balance, onDone }: TopUpSuccessProps) {
  return (
    <div className={styles.success} role="status">
      <div className={styles.icon} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="28" height="28">
          <path
            d="M5 12.5l4.5 4.5L19 7.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3 className={styles.title}>Recarga aprobada</h3>
      <p className={styles.amount}>+{formatCurrency(response.transaction_amount ?? 0)}</p>

      <dl className={styles.details}>
        <div>
          <dt>Nuevo saldo</dt>
          <dd>{formatCurrency(balance)}</dd>
        </div>
        {response.card_number && (
          <div>
            <dt>Tarjeta</dt>
            <dd>{maskCardNumber(response.card_number)}</dd>
          </div>
        )}
        <div>
          <dt>Autorización</dt>
          <dd>{response.authorization_code}</dd>
        </div>
        <div>
          <dt>Referencia</dt>
          <dd>{response.reference}</dd>
        </div>
      </dl>

      <Button className={styles.done} onClick={onDone}>
        Listo
      </Button>
    </div>
  );
}
