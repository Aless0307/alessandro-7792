// Caracol en SVG, mirando a la derecha. El origen (0,0) es la base del cuerpo, al centro.
interface SnailProps {
  shellColor: string;
  bodyColor?: string;
}

export function Snail({ shellColor, bodyColor = '#d9d2bf' }: SnailProps) {
  return (
    <g>
      <path
        d="M-30 0 C-30 -7 -24 -10 -14 -10 L14 -10 C20 -10 23 -15 24 -20 C25 -25 32 -25 32 -19 L31 -9 C34 -7 36 -4 36 0 Z"
        fill={bodyColor}
      />
      <line
        x1="26"
        y1="-21"
        x2="23"
        y2="-33"
        stroke={bodyColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="30"
        y1="-21"
        x2="34"
        y2="-32"
        stroke={bodyColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="23" cy="-34" r="2.6" fill="#15221c" />
      <circle cx="34" cy="-33" r="2.6" fill="#15221c" />
      <circle cx="-4" cy="-22" r="16" fill={shellColor} />
      <path
        d="M-4 -22 a3 3 0 1 1 3 3 a6.5 6.5 0 1 1 -8.5 -8 a10.5 10.5 0 1 1 13 14.5"
        fill="none"
        stroke="rgb(0 0 0 / 0.28)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </g>
  );
}
