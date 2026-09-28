// Geometría de la pista en perspectiva: una curva en S que va del primer plano (t = 0)
// hasta el horizonte (t = 1), cada vez más angosta. Todo en unidades del viewBox de la escena.
export const SCENE_WIDTH = 600;
export const SCENE_HEIGHT = 800;
export const HORIZON_Y = 352;
export const LANE_COUNT = 6;

const NEAR_Y = 830;
const NEAR_WIDTH = 620;
const FAR_WIDTH = 46;

// Tramo de la pista que recorre el caracol del usuario: de la salida a la meta.
export const START_T = 0.08;
export const FINISH_T = 0.82;

export interface Point {
  x: number;
  y: number;
}

// Lo cercano ocupa más pantalla que lo lejano: la altura se comprime hacia el horizonte.
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

// Punto sobre el borde k (0 a LANE_COUNT) o sobre el centro de un carril (k = carril + 0.5).
export function pointOnTrack(t: number, k: number): Point {
  const center = trackCenter(t);
  return { x: center.x + (k / LANE_COUNT - 0.5) * trackWidth(t), y: center.y };
}

// Escala de un objeto a la distancia t, relativa al primer plano.
export function scaleAt(t: number): number {
  return trackWidth(t) / NEAR_WIDTH;
}

export function progressToT(progress: number): number {
  const clamped = Math.min(Math.max(progress, 0), 1);
  return START_T + (FINISH_T - START_T) * clamped;
}

const SAMPLES = 48;

// Polígono SVG de un carril: borde izquierdo hacia el horizonte y derecho de regreso.
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

// Línea que separa carriles, del primer plano al horizonte.
export function edgePath(k: number): string {
  const points: Point[] = [];
  for (let i = 0; i <= SAMPLES; i++) points.push(pointOnTrack(i / SAMPLES, k));
  return `M${points.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L')}`;
}
