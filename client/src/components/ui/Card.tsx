import type { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  title?: string;
  description?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function Card({ title, description, className, children }: CardProps) {
  return (
    <section className={[styles.card, className].filter(Boolean).join(' ')}>
      {(title || description) && (
        <header className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          {description && <p className={styles.description}>{description}</p>}
        </header>
      )}
      {children}
    </section>
  );
}
