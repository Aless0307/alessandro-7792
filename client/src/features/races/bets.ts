import { createSeededRandom, hashString, type RaceDay } from './raceDay';
import { SNAILS } from './snails';

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

// una apuesta se gana solo si ese caracol ganó la carrera, así cuadran la dona y las barras
export function simulateBets(userId: string, day: RaceDay): BetSummary {
  const random = createSeededRandom(hashString(`${userId}:${day.date}`));

  const bets = day.races.flatMap((race) => {
    const betCount = 1 + Math.floor(random() * MAX_BETS_PER_RACE);
    // caracoles distintos dentro de la misma carrera
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

// Fisher-Yates (un sort con random() sale sesgado)
function shuffle<T>(items: T[], random: () => number): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [items[i], items[j]] = [items[j]!, items[i]!];
  }
  return items;
}
