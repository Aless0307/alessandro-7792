// Pista en perspectiva: t = 0 es el frente y t = 1 el horizonte. Todo en unidades del viewBox.
export const SCENE_WIDTH = 600;
export const SCENE_HEIGHT = 800;
export const HORIZON_Y = 352;
export const LANE_COUNT = 6;

const NEAR_Y = 830;
const NEAR_WIDTH = 620;
const FAR_WIDTH = 46;

// tramo que recorre el caracol del usuario
export const START_T = 0.08;
export const FINISH_T = 0.82;

export interface Point {
  x: number;
  y: number;
}

// lo cercano ocupa más pantalla que lo lejano
function depth(t: number): number {
  return (1 - t) ** 1.9;
}

export function trackCenter(t: number): Point {
  const x = 300 - 165 * Math.cos(Math.PI * 1.15 * t) * (1 - 0.72 * t);
  const y = HORIZON_Y + (NEAR_Y - HORIZON_Y) * depth(t);
  return { x, y };
}

export function trackWidth(t: number): number {
  return FAR_WIDTH + (NEAR_WIDTH - FAR_WIDTH) * depth(t);
}

// k = número de borde (0..LANE_COUNT); para el centro de un carril usa carril + 0.5
export function pointOnTrack(t: number, k: number): Point {
  const center = trackCenter(t);
  return { x: center.x + (k / LANE_COUNT - 0.5) * trackWidth(t), y: center.y };
}

export function scaleAt(t: number): number {
  return trackWidth(t) / NEAR_WIDTH;
}

export function progressToT(progress: number): number {
  const clamped = Math.min(Math.max(progress, 0), 1);
  return START_T + (FINISH_T - START_T) * clamped;
}

const SAMPLES = 48;

// borde izquierdo de ida y el derecho de vuelta
export function lanePath(lane: number): string {
  const left: Point[] = [];
  const right: Point[] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    const t = i / SAMPLES;
    left.push(pointOnTrack(t, lane));
    right.push(pointOnTrack(t, lane + 1));
  }
  const points = [...left, ...right.reverse()];
  return `M${points.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L')} Z`;
}

export function edgePath(k: number): string {
  const points: Point[] = [];
  for (let i = 0; i <= SAMPLES; i++) points.push(pointOnTrack(i / SAMPLES, k));
  return `M${points.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L')}`;
}
