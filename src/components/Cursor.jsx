import { useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';

/**
 * Gold dot + trailing ring cursor. Grows over links/buttons and shows a label
 * over anything with data-cursor="View" etc. Desktop (fine pointer) only.
 */
export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const label = useRef(null);
  const [enabled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches,
  );

  useEffect(() => {
    if (!enabled) return undefined;
    const root = document.documentElement;
    root.classList.add('has-cursor', 'cursor-hidden');

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const trail = { ...pos };
    const setDotX = gsap.quickSetter(dot.current, 'x', 'px');
    const setDotY = gsap.quickSetter(dot.current, 'y', 'px');
    const setRingX = gsap.quickSetter(ring.current, 'x', 'px');
    const setRingY = gsap.quickSetter(ring.current, 'y', 'px');

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      pos.x = e.clientX;
      pos.y = e.clientY;
      setDotX(pos.x);
      setDotY(pos.y);
      root.classList.remove('cursor-hidden');
    };
    const tick = () => {
      trail.x += (pos.x - trail.x) * 0.17;
      trail.y += (pos.y - trail.y) * 0.17;
      setRingX(trail.x);
      setRingY(trail.y);
    };
    const onOver = (e) => {
      const target = e.target.closest?.('a, button, [data-cursor], label, select, summary');
      const text = target?.getAttribute('data-cursor') || '';
      ring.current.classList.toggle('is-hover', Boolean(target) && !text);
      ring.current.classList.toggle('has-label', Boolean(text));
      label.current.textContent = text;
    };
    const onLeave = () => root.classList.add('cursor-hidden');

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerleave', onLeave);
      gsap.ticker.remove(tick);
      root.classList.remove('has-cursor', 'cursor-hidden');
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden="true">
        <div>
          <span ref={label} />
        </div>
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
