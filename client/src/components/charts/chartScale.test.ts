import { describe, expect, it } from 'vitest';
import { buildTicks } from './chartScale';

describe('buildTicks', () => {
  it('usa pasos de 1 para valores pequeños', () => {
    expect(buildTicks(3)).toEqual([0, 1, 2, 3]);
  });

  it('redondea hacia arriba con pasos enteros para valores grandes', () => {
    expect(buildTicks(10)).toEqual([0, 3, 6, 9, 12]);
  });

  it('siempre incluye al menos 0 y 1 aunque todo sea cero', () => {
    expect(buildTicks(1)).toEqual([0, 1]);
  });
});
