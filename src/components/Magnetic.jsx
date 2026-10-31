import { useRef } from 'react';
import { gsap } from '../lib/gsap';

/** Wrapper that makes its child gently follow the mouse (desktop only). */
export default function Magnetic({ children, strength = 0.3, className = '' }) {
  const ref = useRef(null);

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = ref.current.getBoundingClientRect();
    gsap.to(ref.current, {
      x: (e.clientX - r.left - r.width / 2) * strength,
      y: (e.clientY - r.top - r.height / 2) * strength,
      duration: 0.4,
      ease: 'power3.out',
    });
  };
  const onLeave = () => gsap.to(ref.current, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });

  return (
    <span ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`inline-block ${className}`}>
      {children}
    </span>
  );
}
