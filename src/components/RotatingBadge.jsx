import { useId } from 'react';

/** Circular text badge that slowly spins. */
export default function RotatingBadge({ text, children, className = '' }) {
  const id = `badge-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <div className={`relative grid aspect-square place-items-center rounded-full ${className}`}>
      <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <path id={id} d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" />
        </defs>
        <text fill="currentColor" style={{ fontFamily: 'var(--font-sans)', fontSize: 15, letterSpacing: '0.3em', textTransform: 'uppercase' }}>
          <textPath href={`#${id}`} textLength="470" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <div className="relative">{children}</div>
    </div>
  );
}
