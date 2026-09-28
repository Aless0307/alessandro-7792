import { describe, expect, it } from 'vitest';
import { RACES_PER_DAY, countWins, simulateRaceDay } from './raceDay';
import { SNAILS } from './snails';

describe('simulateRaceDay', () => {
  it('hay 6 caracoles y 6 carreras en el día', () => {
    const day = simulateRaceDay(new Date(2026, 8, 28));

    expect(SNAILS).toHaveLength(6);
    expect(day.races).toHaveLength(RACES_PER_DAY);
    expect(day.races.map((race) => race.raceNumber)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('cada carrera tiene exactamente un ganador que es uno de los 6 caracoles', () => {
    const ids = SNAILS.map((snail) => snail.id);
    const day = simulateRaceDay(new Date(2026, 8, 28));

    for (const race of day.races) expect(ids).toContain(race.winnerId);
  });

  it('las victorias suman 6 en cualquier día (congruencia con las reglas)', () => {
    for (let offset = 0; offset < 60; offset++) {
      const day = simulateRaceDay(new Date(2026, 0, 1 + offset));
      const total = countWins(day).reduce((sum, entry) => sum + entry.wins, 0);

      expect(total).toBe(RACES_PER_DAY);
    }
  });

  it('el mismo día siempre da los mismos resultados', () => {
    const morning = simulateRaceDay(new Date(2026, 8, 28, 8, 0));
    const night = simulateRaceDay(new Date(2026, 8, 28, 23, 59));

    expect(morning).toEqual(night);
  });

  it('días distintos producen resultados distintos', () => {
    const days = Array.from({ length: 10 }, (_, i) =>
      JSON.stringify(simulateRaceDay(new Date(2026, 8, 1 + i)).races),
    );

    expect(new Set(days).size).toBeGreaterThan(1);
  });
});
