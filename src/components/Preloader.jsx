import { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { site } from '../config/site';

/**
 * Intro screen: brand name rises, counter runs to 100, then the curtain lifts.
 * onReveal fires as the curtain starts moving (start hero animations),
 * onDone when it's fully gone (unmount).
 */
export default function Preloader({ onReveal, onDone }) {
  const root = useRef(null);
  const counter = useRef(null);
  const letters = site.brand.name.split('');

  useGSAP(
    () => {
      let cancelled = false;
      const value = { v: 0 };
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const intro = gsap.timeline();
      intro
        .from('.pl-letter', { yPercent: 115, duration: 1, ease: 'expo.out', stagger: 0.035 })
        .from('.pl-sub', { opacity: 0, y: 12, duration: 0.8, ease: 'power2.out' }, 0.35)
        .to(
          value,
          {
            v: 100,
            duration: reduce ? 0.3 : 1.7,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (counter.current) counter.current.textContent = String(Math.round(value.v)).padStart(3, '0');
            },
          },
          0,
        )
        .to('.pl-bar', { scaleX: 1, duration: reduce ? 0.3 : 1.7, ease: 'power2.inOut' }, 0);

      const pageLoaded = new Promise((resolve) => {
        if (document.readyState === 'complete') resolve();
        else window.addEventListener('load', resolve, { once: true });
      });
      const fontsReady = document.fonts?.ready ?? Promise.resolve();
      const timeout = new Promise((resolve) => setTimeout(resolve, 4500));

      Promise.all([intro.then(), Promise.race([Promise.all([pageLoaded, fontsReady]), timeout])]).then(() => {
        if (cancelled) return;
        gsap
          .timeline({ onComplete: () => !cancelled && onDone?.() })
          .to('.pl-inner', { yPercent: -30, opacity: 0, duration: 0.7, ease: 'power3.in' })
          .add(() => !cancelled && onReveal?.(), '-=0.15')
          .to(root.current, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut' }, '-=0.2');
      });

      return () => {
        cancelled = true;
      };
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[200] grid place-items-center bg-ink"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      aria-label="Loading"
      role="status"
    >
      <div className="pl-inner flex flex-col items-center gap-6 px-6 text-center">
        <p className="pl-sub eyebrow">{site.brand.kind}</p>
        <div className="h-display overflow-hidden pt-2 pb-5 text-[clamp(3rem,10vw,8rem)] leading-[1.05]">
          {letters.map((ch, i) => (
            <span key={i} className={`pl-letter inline-block ${ch === '&' ? 'text-gold italic' : ''}`}>
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
        </div>
        <div className="flex w-56 items-center gap-4">
          <div className="h-px flex-1 overflow-hidden bg-line">
            <div className="pl-bar h-full origin-left scale-x-0 bg-gold" />
          </div>
          <span ref={counter} className="w-10 text-right font-sans text-xs tabular-nums tracking-[0.2em] text-mute">
            000
          </span>
        </div>
      </div>
    </div>
  );
}
