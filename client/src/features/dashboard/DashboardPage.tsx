import { useMemo, useState } from 'react';
import { useAuth } from '../auth/authContext';
import { simulateBets } from '../races/bets';
import { simulateRaceDay } from '../races/raceDay';
import { RecentTopUps } from '../topup/components/RecentTopUps';
import { TopUpDialog } from '../topup/components/TopUpDialog';
import { getChargesFor } from '../topup/services/chargeHistory';
import { BalanceCard } from './components/BalanceCard';
import { BetsCard } from './components/BetsCard';
import { DashboardHeader } from './components/DashboardHeader';
import { WinsCard } from './components/WinsCard';
import styles from './DashboardPage.module.css';
import { useDocumentTitle } from '../../lib/hooks/useDocumentTitle';

const dateFormatter = new Intl.DateTimeFormat('es-MX', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

export function DashboardPage() {
  useDocumentTitle('Panel');
  const { user, logout, refreshUser } = useAuth();
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const today = useMemo(() => new Date(), []);
  const day = useMemo(() => simulateRaceDay(today), [today]);
  const bets = useMemo(() => (user ? simulateBets(user.id, day) : null), [user, day]);
  // Se vuelve a leer al cerrar el diálogo: una recarga rechazada no cambia al usuario,
  // pero sí agrega una operación al historial.
  const charges = useMemo(
    () => (user && !isTopUpOpen ? getChargesFor(user.id) : []),
    [user, isTopUpOpen],
  );

  if (!user || !bets) return null;
  const firstName = user.fullName.split(' ')[0];

  return (
    <div className={styles.page}>
      <DashboardHeader fullName={user.fullName} onLogout={logout} />

      <main className={styles.main}>
        <div className={styles.intro}>
          <h1 className={styles.greeting}>Hola, {firstName}</h1>
          <p className={styles.date}>{capitalize(dateFormatter.format(today))}</p>
        </div>

        <div className={styles.grid}>
          <div className={styles.fullWidth}>
            <BalanceCard balance={user.balance} onTopUp={() => setIsTopUpOpen(true)} />
          </div>
          <BetsCard summary={bets} />
          <WinsCard day={day} />
          <div className={styles.fullWidth}>
            <RecentTopUps charges={charges} onTopUp={() => setIsTopUpOpen(true)} />
          </div>
        </div>
      </main>

      {isTopUpOpen && (
        <TopUpDialog
          user={user}
          onClose={() => setIsTopUpOpen(false)}
          onBalanceChange={refreshUser}
        />
      )}
    </div>
  );
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
