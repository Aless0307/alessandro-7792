import type { ReactNode } from 'react';
import { Logo } from '../../../components/brand/Logo';
import { GardenScene } from './scene/GardenScene';
import styles from './AuthLayout.module.css';

// Mientras se verifica, el caracol llega a la meta; los campos solo lo llevan hasta aquí.
const FIELDS_SHARE = 0.8;

interface AuthLayoutProps {
  isSubmitting: boolean;
  // Fracción de campos válidos del formulario (0 a 1).
  fieldsProgress: number;
  children: ReactNode;
}

export function AuthLayout({ isSubmitting, fieldsProgress, children }: AuthLayoutProps) {
  const progress = isSubmitting ? 1 : fieldsProgress * FIELDS_SHARE;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <main className={styles.formSide}>
          <div className={styles.brand}>
            <Logo />
            <p className={styles.tagline}>Apuestas en carreras de caracoles</p>
          </div>
          <div className={styles.formInner}>{children}</div>
        </main>

        <section className={styles.sceneSide} aria-label="Pista de carreras">
          <GardenScene progress={progress} />
        </section>
      </div>
    </div>
  );
}
