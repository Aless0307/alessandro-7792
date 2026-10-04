interface ShellIconProps {
  color: string;
  size?: number;
}

export function ShellIcon({ color, size = 26 }: ShellIconProps) {
  return (
    <svg viewBox="-17 -17 34 34" width={size} height={size} aria-hidden="true">
      <circle r="16" fill={color} />
      <path
        d="M0 0 a3 3 0 1 1 3 3 a6.5 6.5 0 1 1 -8.5 -8 a10.5 10.5 0 1 1 13 14.5"
        fill="none"
        stroke="rgb(0 0 0 / 0.3)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
