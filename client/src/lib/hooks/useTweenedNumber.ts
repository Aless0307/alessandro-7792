import { useEffect, useRef, useState } from 'react';

// Interpola suavemente hacia `target` en `durationMs`. Si el usuario pidió reducir
// el movimiento, salta directo al valor final.
export function useTweenedNumber(target: number, durationMs: number): number {
  const [value, setValue] = useState(target);
  const valueRef = useRef(target);

  useEffect(() => {
    const from = valueRef.current;
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (from === target || prefersReducedMotion) {
      valueRef.current = target;
      setValue(target);
      return;
    }

    const start = performance.now();
    let frame = requestAnimationFrame(function step(now) {
      const elapsed = Math.min((now - start) / durationMs, 1);
      const eased = 1 - (1 - elapsed) ** 3;
      valueRef.current = from + (target - from) * eased;
      setValue(valueRef.current);
      if (elapsed < 1) frame = requestAnimationFrame(step);
    });

    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return value;
}
