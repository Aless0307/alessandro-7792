// El color del caparazón se reutiliza en la pista y en las gráficas.
export interface Snail {
  id: string;
  name: string;
  shellColor: string;
}

export const SNAILS: readonly Snail[] = [
  { id: 'turbo', name: 'Turbo', shellColor: '#8e93d1' },
  { id: 'babosin', name: 'Babosín', shellColor: '#b9a47c' },
  { id: 'lechuga', name: 'Lechuga', shellColor: '#6f9c86' },
  { id: 'dona-concha', name: 'Doña Concha', shellColor: '#b88a9a' },
  { id: 'rayo-lento', name: 'Rayo Lento', shellColor: '#7f93aa' },
  { id: 'espiral', name: 'Espiral', shellColor: '#a0a861' },
];

export function getSnail(id: string): Snail {
  const snail = SNAILS.find((candidate) => candidate.id === id);
  if (!snail) throw new Error(`Caracol desconocido: ${id}`);
  return snail;
}
