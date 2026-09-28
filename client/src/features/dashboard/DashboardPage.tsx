import { Logo } from '../../components/brand/Logo';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../lib/format';
import { useAuth } from '../auth/authContext';
import styles from './DashboardPage.module.css';

// Versión mínima de la fase 1: confirma la sesión. La fase 2 agrega gráficas y recarga.
export function DashboardPage() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Logo />
        <Button variant="ghost" onClick={logout}>
          Cerrar sesión
        </Button>
      </header>
      <h1 className={styles.greeting}>Hola, {user.fullName}</h1>
      <p className={styles.balance}>
        Saldo actual: <strong>{formatCurrency(user.balance)}</strong>
      </p>
    </main>
  );
}
