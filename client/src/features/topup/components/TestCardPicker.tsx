import { SNAILPAY_TEST_CARDS, type TestCard } from '@snail/shared';
import { maskCardNumber } from '../cardFormat';
import styles from './TestCardPicker.module.css';

interface TestCardPickerProps {
  onPick: (card: TestCard) => void;
  disabled?: boolean;
}

export function TestCardPicker({ onPick, disabled }: TestCardPickerProps) {
  return (
    <details className={styles.picker}>
      <summary className={styles.summary}>Tarjetas de prueba</summary>
      <ul className={styles.list}>
        {SNAILPAY_TEST_CARDS.map((card) => (
          <li key={card.number}>
            <button
              type="button"
              className={styles.card}
              disabled={disabled}
              onClick={() => onPick(card)}
            >
              <span>{card.label}</span>
              <span className={styles.number}>{maskCardNumber(card.number)}</span>
            </button>
          </li>
        ))}
      </ul>
    </details>
  );
}
