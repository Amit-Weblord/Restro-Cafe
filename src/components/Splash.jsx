import { useMemo } from 'react';
import { mulberry32 } from '../lib/random';

/** Burst of flour / spice specks around a plate. Purely decorative. */
export default function Splash({ seed = 1, className = '', from = 0.1, span = 0.55 }) {
  const dots = useMemo(() => {
    const rand = mulberry32(seed * 101);
    const out = [];
    for (let i = 0; i < 170; i += 1) {
      const angle = (from + rand() * span) * Math.PI * 2;
      const dist = 0.37 + Math.pow(rand(), 1.8) * 0.13;
      const x = 100 + Math.cos(angle) * dist * 200;
      const y = 100 + Math.sin(angle) * dist * 200;
      const r = 0.25 + Math.pow(rand(), 3) * 2.2;
      const gold = rand() < 0.22;
      out.push({ x, y, r, o: 0.25 + rand() * 0.7, gold });
    }
    return out;
  }, [seed, from, span]);

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.x.toFixed(2)}
          cy={d.y.toFixed(2)}
          r={d.r.toFixed(2)}
          fill={d.gold ? 'var(--color-gold)' : 'var(--color-cream)'}
          opacity={d.o.toFixed(2)}
        />
      ))}
    </svg>
  );
}
