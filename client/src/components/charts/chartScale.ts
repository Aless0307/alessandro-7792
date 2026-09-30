const MAX_TICKS = 4;

// Marcas del eje en números enteros y redondos: 0, 1, 2, 3… o 0, 3, 6… según el máximo.
export function buildTicks(maxValue: number): number[] {
  const step = Math.max(1, Math.ceil(maxValue / MAX_TICKS));
  const top = Math.ceil(maxValue / step) * step;
  const ticks: number[] = [];
  for (let tick = 0; tick <= top; tick += step) ticks.push(tick);
  return ticks;
}
