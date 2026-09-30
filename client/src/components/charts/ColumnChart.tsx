import { useState, type CSSProperties, type ReactNode } from 'react';
import { buildTicks } from './chartScale';
import styles from './ColumnChart.module.css';

export interface ColumnDatum {
  id: string;
  label: string;
  value: number;
  // Elemento que identifica la categoría junto a su nombre (por ejemplo, el caparazón).
  icon?: ReactNode;
}

interface ColumnChartProps {
  data: ColumnDatum[];
  title: string;
  // Categorías resaltadas; las demás quedan en un tono apagado.
  highlightIds?: string[];
  formatValue: (value: number) => string;
}

export function ColumnChart({ data, title, highlightIds = [], formatValue }: ColumnChartProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const ticks = buildTicks(Math.max(...data.map((datum) => datum.value), 1));
  const top = ticks[ticks.length - 1]!;

  return (
    <figure className={styles.figure} style={{ '--count': data.length } as CSSProperties}>
      <div className={styles.plot}>
        <div className={styles.axis} aria-hidden="true">
          {[...ticks].reverse().map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>

        <div className={styles.area}>
          {ticks.map((tick) => (
            <div
              key={tick}
              className={styles.gridline}
              style={{ bottom: `${(tick / top) * 100}%` }}
              aria-hidden="true"
            />
          ))}

          <div className={styles.columns}>
            {data.map((datum) => {
              const isHighlighted = highlightIds.includes(datum.id);
              const isActive = activeId === datum.id;
              return (
                <div
                  key={datum.id}
                  className={styles.column}
                  style={{ '--height': `${(datum.value / top) * 100}%` } as CSSProperties}
                  tabIndex={0}
                  aria-label={`${datum.label}: ${formatValue(datum.value)}`}
                  onMouseEnter={() => setActiveId(datum.id)}
                  onMouseLeave={() => setActiveId(null)}
                  onFocus={() => setActiveId(datum.id)}
                  onBlur={() => setActiveId(null)}
                >
                  {isActive && (
                    <div className={styles.tooltip} role="tooltip">
                      <strong>{datum.label}</strong>
                      <span>{formatValue(datum.value)}</span>
                    </div>
                  )}
                  {/* Solo se rotulan las columnas resaltadas; el resto lo cubren el eje y el tooltip. */}
                  {isHighlighted && datum.value > 0 && (
                    <span className={styles.capLabel}>{datum.value}</span>
                  )}
                  <div className={styles.bar} data-highlighted={isHighlighted || undefined} />
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.labels} aria-hidden="true">
          {data.map((datum) => (
            <span key={datum.id} className={styles.label}>
              {datum.icon}
              <span className={styles.labelText}>{datum.label}</span>
            </span>
          ))}
        </div>
      </div>

      <table className="sr-only">
        <caption>{title}</caption>
        <tbody>
          {data.map((datum) => (
            <tr key={datum.id}>
              <th scope="row">{datum.label}</th>
              <td>{formatValue(datum.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
