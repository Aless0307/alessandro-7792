import type { ReactNode } from 'react';
import { Link, useRouteError } from 'react-router';
import { Logo } from '../../components/brand/Logo';
import { Button } from '../../components/ui/Button';
import { useDocumentTitle } from '../../lib/hooks/useDocumentTitle';
import { ROUTES } from '../routes';
import styles from './StatusPages.module.css';

export function NotFoundPage() {
  useDocumentTitle('Página no encontrada');
  return (
    <StatusLayout title="Esta página no existe">
      <p>Revisa la dirección o vuelve al inicio.</p>
      <Link className={styles.link} to={ROUTES.dashboard}>
        Ir al inicio
      </Link>
    </StatusLayout>
  );
}

export function ErrorPage() {
  useDocumentTitle('Algo salió mal');
  const error = useRouteError();
  // Se deja rastro en consola para depurar; al usuario solo se le muestra qué hacer.
  console.error(error);

  return (
    <StatusLayout title="Algo salió mal">
      <p>La página tuvo un problema inesperado. Tus datos y tu saldo siguen guardados.</p>
      <Button onClick={() => window.location.reload()}>Recargar la página</Button>
    </StatusLayout>
  );
}

function StatusLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <Logo />
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.body}>{children}</div>
      </div>
    </main>
  );
}
