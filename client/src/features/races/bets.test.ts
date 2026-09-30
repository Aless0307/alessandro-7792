import { describe, expect, it } from 'vitest';
import { MAX_BETS_PER_RACE, simulateBets } from './bets';
import { simulateRaceDay } from './raceDay';

const day = simulateRaceDay(new Date(2026, 8, 30));

describe('simulateBets', () => {
  it('ganadas + perdidas = total de apuestas', () => {
    const summary = simulateBets('usuario-1', day);

    expect(summary.won + summary.lost).toBe(summary.bets.length);
  });

  it('una apuesta se gana solo si el caracol elegido ganó esa carrera', () => {
    const summary = simulateBets('usuario-1', day);

    for (const bet of summary.bets) {
      const race = day.races.find((r) => r.raceNumber === bet.raceNumber)!;
      expect(bet.won).toBe(bet.snailId === race.winnerId);
    }
  });

  it('en cada carrera hay de 1 a 3 apuestas, siempre a caracoles distintos', () => {
    const summary = simulateBets('usuario-1', day);

    for (const race of day.races) {
      const snails = summary.bets
        .filter((b) => b.raceNumber === race.raceNumber)
        .map((b) => b.snailId);
      expect(snails.length).toBeGreaterThanOrEqual(1);
      expect(snails.length).toBeLessThanOrEqual(MAX_BETS_PER_RACE);
      expect(new Set(snails).size).toBe(snails.length);
    }
  });

  it('es estable para el mismo usuario y día, y distinta entre usuarios', () => {
    expect(simulateBets('usuario-1', day)).toEqual(simulateBets('usuario-1', day));

    const others = Array.from({ length: 8 }, (_, i) => JSON.stringify(simulateBets(`u-${i}`, day)));
    expect(new Set(others).size).toBeGreaterThan(1);
  });
});
