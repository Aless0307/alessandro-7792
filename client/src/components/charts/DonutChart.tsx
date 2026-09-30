import { useState } from 'react';
import styles from './DonutChart.module.css';

export interface DonutSegment {
  id: string;
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  // Lo que se muestra al centro cuando no hay un segmento señalado.
  centerValue: string;
  centerLabel: string;
  title: string;
}

const SIZE = 200;
const RADIUS = 80;
const THICKNESS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
// Espacio del color de la superficie entre segmentos, en lugar de un borde.
const GAP = 3;

export function DonutChart({ segments, centerValue, centerLabel, title }: DonutChartProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const active = segments.find((segment) => segment.id === activeId);
  const visible = segments.filter((segment) => segment.value > 0);

  let offset = 0;
  const arcs = visible.map((segment) => {
    const length = (segment.value / total) * CIRCUMFERENCE;
    const gap = visible.length > 1 ? GAP : 0;
    const arc = { segment, dash: Math.max(length - gap, 0), offset };
    offset += length;
    return arc;
  });

  return (
    <figure className={styles.figure}>
      <div className={styles.chart}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className={styles.svg} aria-hidden="true">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            strokeWidth={THICKNESS}
            className={styles.track}
          />
          {arcs.map(({ segment, dash, offset: start }) => (
            <circle
              key={segment.id}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              stroke={segment.color}
              strokeWidth={activeId === segment.id ? THICKNESS + 4 : THICKNESS}
              strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
              strokeDashoffset={-start}
              transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
              className={styles.arc}
              onMouseEnter={() => setActiveId(segment.id)}
              onMouseLeave={() => setActiveId(null)}
            />
          ))}
        </svg>
        <div className={styles.center} aria-live="polite">
          <span className={styles.centerValue}>{active ? active.value : centerValue}</span>
          <span className={styles.centerLabel}>{active ? active.label : centerLabel}</span>
        </div>
      </div>

      <ul className={styles.legend}>
        {segments.map((segment) => (
          <li
            key={segment.id}
            className={styles.legendItem}
            tabIndex={0}
            onMouseEnter={() => setActiveId(segment.id)}
            onMouseLeave={() => setActiveId(null)}
            onFocus={() => setActiveId(segment.id)}
            onBlur={() => setActiveId(null)}
          >
            <span className={styles.swatch} style={{ background: segment.color }} />
            <span className={styles.legendLabel}>{segment.label}</span>
            <span className={styles.legendValue}>{segment.value}</span>
          </li>
        ))}
      </ul>

      {/* Equivalente en tabla para lectores de pantalla. */}
      <table className="sr-only">
        <caption>{title}</caption>
        <tbody>
          {segments.map((segment) => (
            <tr key={segment.id}>
              <th scope="row">{segment.label}</th>
              <td>{segment.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
