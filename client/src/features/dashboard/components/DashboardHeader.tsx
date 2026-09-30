import { Logo } from '../../../components/brand/Logo';
import { Button } from '../../../components/ui/Button';
import styles from './DashboardHeader.module.css';

interface DashboardHeaderProps {
  fullName: string;
  onLogout: () => void;
}

export function DashboardHeader({ fullName, onLogout }: DashboardHeaderProps) {
  return (
    <header className={styles.header}>
      <Logo />
      <div className={styles.account}>
        <span className={styles.avatar} aria-hidden="true">
          {getInitials(fullName)}
        </span>
        <span className={styles.name}>{fullName}</span>
        <Button variant="ghost" onClick={onLogout}>
          Cerrar sesión
        </Button>
      </div>
    </header>
  );
}

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}
