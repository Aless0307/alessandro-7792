import { useMemo } from 'react';
import { ShellIcon } from '../../../components/brand/ShellIcon';
import { simulateRaceDay } from '../raceDay';
import { getSnail } from '../snails';
import styles from './TodayResults.module.css';

const dateFormatter = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long' });

// Ganador de cada carrera del día simulado: los mismos datos que usa el panel.
export function TodayResults() {
  const today = useMemo(() => new Date(), []);
  const day = useMemo(() => simulateRaceDay(today), [today]);

  return (
    <section className={styles.results} aria-labelledby="today-results-title">
      <header className={styles.header}>
        <h2 id="today-results-title" className={styles.title}>
          Hoy en la pista
        </h2>
        <p className={styles.date}>{dateFormatter.format(today)}</p>
      </header>
      <ol className={styles.list}>
        {day.races.map((race) => {
          const winner = getSnail(race.winnerId);
          return (
            <li key={race.raceNumber} className={styles.item}>
              <ShellIcon color={winner.shellColor} size={20} />
              <span className={styles.name}>{winner.name}</span>
              <span className={styles.race}>Carrera {race.raceNumber}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
