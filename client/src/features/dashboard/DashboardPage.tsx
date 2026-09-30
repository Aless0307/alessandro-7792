import { useMemo } from 'react';
import { useAuth } from '../auth/authContext';
import { simulateBets } from '../races/bets';
import { simulateRaceDay } from '../races/raceDay';
import { BalanceCard } from './components/BalanceCard';
import { BetsCard } from './components/BetsCard';
import { DashboardHeader } from './components/DashboardHeader';
import { WinsCard } from './components/WinsCard';
import styles from './DashboardPage.module.css';

const dateFormatter = new Intl.DateTimeFormat('es-MX', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

export function DashboardPage() {
  const { user, logout } = useAuth();
  const today = useMemo(() => new Date(), []);
  const day = useMemo(() => simulateRaceDay(today), [today]);
  const bets = useMemo(() => (user ? simulateBets(user.id, day) : null), [user, day]);

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
          <div className={styles.balance}>
            <BalanceCard balance={user.balance} />
          </div>
          <BetsCard summary={bets} />
          <WinsCard day={day} />
        </div>
      </main>
    </div>
  );
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
