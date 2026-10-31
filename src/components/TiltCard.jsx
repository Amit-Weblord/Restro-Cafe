import { useRef } from 'react';
import { gsap } from '../lib/gsap';

/** Card that tilts in 3D towards the mouse, with a soft light glare. */
export default function TiltCard({ children, className = '', max = 9, glare = true, as: Tag = 'div', ...rest }) {
  const ref = useRef(null);

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    gsap.to(el, {
      rotateY: (px - 0.5) * max * 2,
      rotateX: (0.5 - py) * max * 2,
      transformPerspective: 1000,
      duration: 0.5,
      ease: 'power2.out',
    });
    el.style.setProperty('--gx', `${px * 100}%`);
    el.style.setProperty('--gy', `${py * 100}%`);
  };
  const onLeave = () => gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 1, ease: 'elastic.out(1, 0.5)' });

  return (
    <Tag
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`tilt relative ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
      {...rest}
    >
      {children}
      {glare && <span className="tilt-glare" aria-hidden="true" />}
    </Tag>
  );
}
