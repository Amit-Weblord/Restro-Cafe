import { useEffect, useRef } from 'react';
import { readAccent } from '../lib/theme';

/** Fixed full-page layer of slowly drifting, twinkling gold specks that react to scrolling. */
export default function GoldDust() {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let color = readAccent();
    let lastScroll = window.scrollY;
    const count = window.innerWidth < 768 ? 26 : 55;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const spawn = (anywhere) => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 10,
      r: 0.4 + Math.random() * 1.5,
      vy: 0.08 + Math.random() * 0.25,
      depth: 0.2 + Math.random() * 0.9,
      phase: Math.random() * Math.PI * 2,
      tw: 0.0008 + Math.random() * 0.0025,
      a: 0.25 + Math.random() * 0.6,
    });
    const particles = Array.from({ length: count }, () => spawn(true));

    const frame = (t) => {
      const scrollY = window.scrollY;
      const dy = scrollY - lastScroll;
      lastScroll = scrollY;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      for (const p of particles) {
        p.y -= p.vy + dy * p.depth * 0.25;
        p.x += Math.sin(t * 0.0004 + p.phase) * 0.18;
        if (p.y < -12) Object.assign(p, spawn(false));
        if (p.y > h + 40) p.y = -10;
        const alpha = p.a * (0.45 + 0.55 * Math.sin(t * p.tw + p.phase));
        if (alpha <= 0.02) continue;
        ctx.globalAlpha = alpha * 0.25;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(frame);
    };
    const onTheme = () => {
      color = readAccent();
    };
    window.addEventListener('resize', resize);
    window.addEventListener('themechange', onTheme);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('themechange', onTheme);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 h-full w-full mix-blend-screen" />;
}
