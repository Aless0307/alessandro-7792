import { SNAILS } from './snails';

// Simulación de un día de carreras. Es determinista por fecha: el mismo día siempre
// produce los mismos resultados, así que no cambian al recargar ni entre pantallas.
export const RACES_PER_DAY = 6;

export interface RaceResult {
  raceNumber: number;
  winnerId: string;
}

export interface RaceDay {
  date: string; // AAAA-MM-DD
  races: RaceResult[];
}

export function simulateRaceDay(date: Date): RaceDay {
  const dateKey = toDateKey(date);
  const random = createSeededRandom(hashString(dateKey));

  const races = Array.from({ length: RACES_PER_DAY }, (_, index) => {
    const winner = SNAILS[Math.floor(random() * SNAILS.length)]!;
    return { raceNumber: index + 1, winnerId: winner.id };
  });

  return { date: dateKey, races };
}

// Victorias por caracol, incluidos los que no ganaron ninguna. Siempre suman RACES_PER_DAY.
export function countWins(day: RaceDay): { snailId: string; wins: number }[] {
  return SNAILS.map((snail) => ({
    snailId: snail.id,
    wins: day.races.filter((race) => race.winnerId === snail.id).length,
  }));
}

export function toDateKey(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

// Mulberry32: generador pseudoaleatorio pequeño y reproducible a partir de una semilla.
export function createSeededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// FNV-1a: convierte un texto (fecha, id de usuario) en una semilla numérica estable.
export function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
