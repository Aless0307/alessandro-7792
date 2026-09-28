import { ShellIcon } from './ShellIcon';
import styles from './Logo.module.css';

interface LogoProps {
  size?: 'md' | 'lg';
}

export function Logo({ size = 'md' }: LogoProps) {
  return (
    <span className={`${styles.logo} ${styles[size]}`}>
      <ShellIcon color="var(--shell-500)" size={size === 'lg' ? 40 : 26} />
      SnailBet
    </span>
  );
}
