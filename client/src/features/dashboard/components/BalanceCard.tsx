import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { formatCurrency } from '../../../lib/format';
import styles from './BalanceCard.module.css';

interface BalanceCardProps {
  balance: number;
  onTopUp: () => void;
}

// La cifra principal del panel: una sola por vista, grande y en la misma familia tipográfica.
export function BalanceCard({ balance, onTopUp }: BalanceCardProps) {
  return (
    <Card className={styles.card}>
      <div className={styles.figure}>
        <p className={styles.label}>Saldo disponible</p>
        <p className={styles.value} aria-live="polite">
          {formatCurrency(balance)}
        </p>
      </div>
      <Button onClick={onTopUp}>Recargar saldo</Button>
    </Card>
  );
}
