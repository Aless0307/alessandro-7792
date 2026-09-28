import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  isLoading?: boolean;
  loadingText?: string;
}

export function Button({
  variant = 'primary',
  isLoading = false,
  loadingText,
  children,
  disabled,
  className,
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      className={[styles.button, styles[variant], className].filter(Boolean).join(' ')}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      {...buttonProps}
    >
      {isLoading ? (loadingText ?? children) : children}
    </button>
  );
}
