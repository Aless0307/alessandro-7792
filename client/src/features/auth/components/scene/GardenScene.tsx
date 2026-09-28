import { useTweenedNumber } from '../../../../lib/hooks/useTweenedNumber';
import { Snail } from '../Snail';
import {
  FINISH_T,
  HORIZON_Y,
  LANE_COUNT,
  SCENE_HEIGHT,
  SCENE_WIDTH,
  edgePath,
  lanePath,
  pointOnTrack,
  progressToT,
  scaleAt,
} from './trackGeometry';
import styles from './GardenScene.module.css';

// Jardín al amanecer después de la lluvia. La pista se pierde en el horizonte y el caracol
// del usuario avanza (y se aleja) según `progress`, rebasando a los rivales.
const PLAYER_LANE = 3;
const RIVALS = [
  { lane: 0, t: 0.36, shell: '#8e93d1' },
  { lane: 1, t: 0.52, shell: '#b9a47c' },
  { lane: 2, t: 0.22, shell: '#6f9c86' },
  { lane: 4, t: 0.64, shell: '#b88a9a' },
  { lane: 5, t: 0.44, shell: '#7f93aa' },
];
const SNAIL_SIZE = 1.3;
const CRAWL_MS = 1400;

interface GardenSceneProps {
  progress: number;
}

export function GardenScene({ progress }: GardenSceneProps) {
  const playerT = useTweenedNumber(progressToT(progress), CRAWL_MS);

  const snails = [
    ...RIVALS.map((rival) => ({ ...rival, isPlayer: false })),
    { lane: PLAYER_LANE, t: playerT, shell: 'var(--shell-500)', isPlayer: true },
  ].sort((a, b) => b.t - a.t); // Lo lejano se dibuja primero.

  return (
    <svg
      className={styles.scene}
      viewBox={`0 0 ${SCENE_WIDTH} ${SCENE_HEIGHT}`}
      preserveAspectRatio="xMidYMax slice"
      role="img"
      aria-label={`Pista de carreras. Tu caracol lleva ${Math.round(progress * 100)} % del recorrido`}
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c3cde4" />
          <stop offset="1" stopColor="#e8ede4" />
        </linearGradient>
        <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8ede4" stopOpacity="0.55" />
          <stop offset="1" stopColor="#e8ede4" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width={SCENE_WIDTH} height={HORIZON_Y + 10} fill="url(#sky)" />
      <circle cx="418" cy="262" r="64" fill="#f2eadb" opacity="0.8" />
      <Hills />

      <rect y={HORIZON_Y} width={SCENE_WIDTH} height={SCENE_HEIGHT - HORIZON_Y} fill="#6c9674" />
      <path d="M0 470 C120 450 190 520 330 500 S520 440 600 470 L600 800 L0 800 Z" fill="#628d6b" />

      {Array.from({ length: LANE_COUNT }, (_, lane) => (
        <path
          key={lane}
          d={lanePath(lane)}
          fill={lane === PLAYER_LANE ? '#dde3d6' : lane % 2 ? '#ccd5c7' : '#d4dccf'}
        />
      ))}
      {Array.from({ length: LANE_COUNT + 1 }, (_, k) => (
        <path key={k} d={edgePath(k)} className={styles.laneLine} />
      ))}

      <FinishLine />
      <rect y={HORIZON_Y} width={SCENE_WIDTH} height="150" fill="url(#mist)" />

      {snails.map((snail) => {
        const position = pointOnTrack(snail.t, snail.lane + 0.5);
        const scale = scaleAt(snail.t) * SNAIL_SIZE;
        return (
          <g
            key={snail.lane}
            transform={`translate(${position.x} ${position.y - 6 * scale}) scale(${scale})`}
            opacity={snail.isPlayer ? 1 : 0.95}
          >
            <ellipse cx="2" cy="1" rx="34" ry="5" fill="rgb(40 60 45 / 0.22)" />
            <Snail shellColor={snail.shell} bodyColor={snail.isPlayer ? '#efe4c8' : '#d8d2c0'} />
          </g>
        );
      })}

      <Foliage />
      <PlayerMarker t={playerT} />
    </svg>
  );
}

// Pin sobre el caracol del usuario. No se encoge tanto como el caracol para seguir visible a lo lejos.
function PlayerMarker({ t }: { t: number }) {
  const position = pointOnTrack(t, PLAYER_LANE + 0.5);
  const snailScale = scaleAt(t) * SNAIL_SIZE;
  const pinScale = Math.max(snailScale, 0.45);
  const top = position.y - 6 * snailScale - 44 * snailScale;

  return (
    <g transform={`translate(${position.x - 4 * snailScale} ${top}) scale(${pinScale})`}>
      <path
        d="M0 0 C-4 -8 -11 -13 -11 -21 A11 11 0 1 1 11 -21 C11 -13 4 -8 0 0 Z"
        fill="var(--shell-500)"
        stroke="#fbfcfa"
        strokeWidth="2"
      />
      <circle cy="-21" r="4" fill="#fbfcfa" />
    </g>
  );
}

function Hills() {
  return (
    <g>
      <path d="M0 300 C90 250 170 262 250 290 S420 236 600 282 L600 360 L0 360 Z" fill="#a9bcae" />
      <path
        d="M0 330 C80 306 150 318 230 334 S400 300 470 318 S560 330 600 322 L600 360 L0 360 Z"
        fill="#8aa893"
      />
      {/* Seto sobre el horizonte */}
      <path
        d="M0 356 q15 -16 30 -4 q12 -14 28 -2 q14 -16 30 -3 q14 -12 28 0 q16 -15 32 -2 q12 -13 26 -1 q15 -16 30 -3 q14 -12 28 0 q16 -15 32 -2 q12 -13 26 -1 q15 -16 30 -3 q14 -12 28 0 q16 -15 32 -2 q12 -13 26 -1 q15 -16 30 -3 q14 -12 28 0 q16 -15 32 -2 q12 -13 26 -1 q15 -16 30 -3 q14 -12 28 0 q10 -8 20 0 L600 364 L0 364 Z"
        fill="#5f8a6b"
      />
    </g>
  );
}

// Banda a cuadros sobre la pista, con dos postes y un banderín.
function FinishLine() {
  const cells = 12;
  const depthStep = 0.018;
  const squares = [];
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < cells; col++) {
      const t0 = FINISH_T + row * depthStep;
      const t1 = t0 + depthStep;
      const k0 = (col / cells) * LANE_COUNT;
      const k1 = ((col + 1) / cells) * LANE_COUNT;
      const a = pointOnTrack(t0, k0);
      const b = pointOnTrack(t0, k1);
      const c = pointOnTrack(t1, k1);
      const d = pointOnTrack(t1, k0);
      squares.push(
        <path
          key={`${row}-${col}`}
          d={`M${a.x} ${a.y} L${b.x} ${b.y} L${c.x} ${c.y} L${d.x} ${d.y} Z`}
          fill={(row + col) % 2 ? '#f4f6f2' : '#1f2e27'}
        />,
      );
    }
  }

  const left = pointOnTrack(FINISH_T, -0.15);
  const right = pointOnTrack(FINISH_T, LANE_COUNT + 0.15);
  const postHeight = 58 * scaleAt(FINISH_T) * 3.2;

  return (
    <g>
      {squares}
      <line x1={left.x} y1={left.y} x2={left.x} y2={left.y - postHeight} className={styles.post} />
      <line
        x1={right.x}
        y1={right.y}
        x2={right.x}
        y2={right.y - postHeight}
        className={styles.post}
      />
      <rect
        x={left.x}
        y={left.y - postHeight}
        width={right.x - left.x}
        height={postHeight * 0.22}
        fill="var(--shell-500)"
      />
    </g>
  );
}

// Hojas en primer plano con gotas de rocío: enmarcan la escena y dan profundidad.
const LEAF = 'M0 0 C30 -40 112 -56 176 -18 C122 10 52 22 0 0 Z';
const VEIN = 'M6 -2 C62 -18 116 -24 170 -18';

function Leaf({ transform, fill }: { transform: string; fill: string }) {
  return (
    <g transform={transform}>
      <path d={LEAF} fill={fill} />
      <path d={VEIN} className={styles.vein} />
    </g>
  );
}

function Foliage() {
  return (
    <g>
      <Leaf transform="translate(-40 812) rotate(-38) scale(1.5)" fill="#2c5443" />
      <Leaf transform="translate(-24 800) rotate(-12) scale(1.15)" fill="#3e7c5a" />
      <Leaf transform="translate(640 820) scale(-1.55 1.55) rotate(-34)" fill="#2c5443" />
      <Leaf transform="translate(630 808) scale(-1.05 1.05) rotate(-8)" fill="#4a8a63" />
      <Dew cx={112} cy={728} r={6} />
      <Dew cx={86} cy={752} r={3.5} />
      <Dew cx={522} cy={722} r={5} />
    </g>
  );
}

function Dew({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="rgb(232 240 236 / 0.55)" />
      <circle cx={cx - r * 0.35} cy={cy - r * 0.35} r={r * 0.3} fill="#ffffff" />
    </g>
  );
}
