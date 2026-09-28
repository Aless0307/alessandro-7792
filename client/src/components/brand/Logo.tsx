import { ShellIcon } from './ShellIcon';
import styles from './Logo.module.css';

export function Logo() {
  return (
    <span className={styles.logo}>
      <ShellIcon color="var(--shell-500)" />
      SnailBet
    </span>
  );
}
