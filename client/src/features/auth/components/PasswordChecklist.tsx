import { PASSWORD_RULES } from '../validation';
import styles from './PasswordChecklist.module.css';

export function PasswordChecklist({ password }: { password: string }) {
  return (
    <ul className={styles.list} aria-label="Requisitos de la contraseña">
      {PASSWORD_RULES.map((rule) => {
        const isMet = rule.test(password);
        return (
          <li key={rule.id} className={isMet ? styles.met : styles.pending}>
            <span aria-hidden="true" className={styles.mark} />
            {rule.label}
            <span className={styles.srOnly}>{isMet ? ' (cumplido)' : ' (pendiente)'}</span>
          </li>
        );
      })}
    </ul>
  );
}
