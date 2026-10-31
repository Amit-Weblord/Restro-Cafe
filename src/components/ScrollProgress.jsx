import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';

export default function ScrollProgress() {
  const bar = useRef(null);
  useGSAP(() => {
    gsap.to(bar.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
    });
  });
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]" aria-hidden="true">
      <div ref={bar} className="h-full origin-left scale-x-0 bg-linear-to-r from-gold/40 via-gold to-gold-soft" />
    </div>
  );
}
