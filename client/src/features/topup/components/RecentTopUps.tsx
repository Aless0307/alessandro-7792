import type { ChargeResponse, ChargeStatus } from '@snail/shared';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { formatCurrency } from '../../../lib/format';
import { maskCardNumber } from '../cardFormat';
import styles from './RecentTopUps.module.css';

const MAX_ITEMS = 5;

const dateFormatter = new Intl.DateTimeFormat('es-MX', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

const STATUS_LABEL: Record<ChargeStatus, string> = {
  approved: 'Aprobada',
  rejected: 'Rechazada',
  error: 'No procesada',
};

interface RecentTopUpsProps {
  charges: ChargeResponse[];
  onTopUp: () => void;
}

export function RecentTopUps({ charges, onTopUp }: RecentTopUpsProps) {
  const recent = [...charges]
    .sort((a, b) => b.date_created.localeCompare(a.date_created))
    .slice(0, MAX_ITEMS);

  return (
    <Card
      title="Últimas recargas"
      description="Las operaciones que respondió SnailPay, de la más reciente a la más antigua."
    >
      {recent.length === 0 ? (
        <div className={styles.empty}>
          <p>Aún no has recargado saldo. Tu primera recarga aparecerá aquí.</p>
          <Button variant="ghost" onClick={onTopUp}>
            Recargar saldo
          </Button>
        </div>
      ) : (
        <ul className={styles.list}>
          {recent.map((charge) => (
            <li key={charge.id} className={styles.item}>
              <div className={styles.main}>
                <span
                  className={styles.amount}
                  data-approved={charge.status === 'approved' || undefined}
                >
                  {charge.status === 'approved' ? '+' : ''}
                  {formatCurrency(charge.transaction_amount ?? 0)}
                </span>
                <span className={styles.meta}>
                  {dateFormatter.format(new Date(charge.date_created))}
                  {charge.card_number && ` con ${maskCardNumber(charge.card_number)}`}
                </span>
              </div>
              <span className={styles.status} data-status={charge.status}>
                <StatusIcon status={charge.status} />
                {STATUS_LABEL[charge.status]}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function StatusIcon({ status }: { status: ChargeStatus }) {
  const paths: Record<ChargeStatus, string> = {
    approved: 'M5 12.5l4.5 4.5L19 7.5',
    rejected: 'M7 7l10 10M17 7L7 17',
    error: 'M12 7v6M12 17h.01',
  };
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        d={paths[status]}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
