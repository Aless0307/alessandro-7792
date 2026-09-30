import { createSeededRandom, hashString, type RaceDay } from './raceDay';
import { SNAILS } from './snails';

// Apuestas simuladas del usuario sobre las carreras del día. Se ganan o pierden según
// el ganador real de cada carrera, así que la dona y las barras cuentan la misma historia.
export const MAX_BETS_PER_RACE = 3;

export interface Bet {
  raceNumber: number;
  snailId: string;
  won: boolean;
}

export interface BetSummary {
  bets: Bet[];
  won: number;
  lost: number;
}

export function simulateBets(userId: string, day: RaceDay): BetSummary {
  const random = createSeededRandom(hashString(`${userId}:${day.date}`));

  const bets = day.races.flatMap((race) => {
    const betCount = 1 + Math.floor(random() * MAX_BETS_PER_RACE);
    // Caracoles distintos por carrera: barajar y tomar los primeros.
    const picks = shuffle([...SNAILS], random).slice(0, betCount);
    return picks.map((snail) => ({
      raceNumber: race.raceNumber,
      snailId: snail.id,
      won: snail.id === race.winnerId,
    }));
  });

  const won = bets.filter((bet) => bet.won).length;
  return { bets, won, lost: bets.length - won };
}

// Fisher-Yates: barajado sin sesgo usando el generador con semilla.
function shuffle<T>(items: T[], random: () => number): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [items[i], items[j]] = [items[j]!, items[i]!];
  }
  return items;
}
