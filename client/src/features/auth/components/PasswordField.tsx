import { useState, type ComponentProps } from 'react';
import { TextField } from '../../../components/ui/TextField';
import styles from './PasswordField.module.css';

type PasswordFieldProps = Omit<ComponentProps<typeof TextField>, 'type' | 'trailing'>;

export function PasswordField(props: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <TextField
      {...props}
      type={isVisible ? 'text' : 'password'}
      trailing={
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setIsVisible((visible) => !visible)}
          aria-pressed={isVisible}
          aria-label={
            isVisible
              ? `Ocultar ${props.label.toLowerCase()}`
              : `Mostrar ${props.label.toLowerCase()}`
          }
        >
          {isVisible ? 'Ocultar' : 'Mostrar'}
        </button>
      }
    />
  );
}
