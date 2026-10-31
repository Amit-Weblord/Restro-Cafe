import { Fragment, useRef } from 'react';
import { site } from '../config/site';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';

/** Two endless rows of words that speed up and skew with scroll velocity. */
export default function Marquee() {
  const root = useRef(null);

  useGSAP(
    () => {
      const rows = gsap.utils.toArray('.mq-track');
      const loops = rows.map((row, i) =>
        gsap.fromTo(
          row,
          { xPercent: i % 2 ? -50 : 0 },
          { xPercent: i % 2 ? 0 : -50, duration: 38, ease: 'none', repeat: -1 },
        ),
      );
      const skew = gsap.quickTo(rows, 'skewX', { duration: 0.5, ease: 'power3' });
      let velocity = 0;

      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          velocity = self.getVelocity();
        },
      });

      const tick = () => {
        velocity *= 0.92;
        const speed = 1 + Math.min(Math.abs(velocity) / 300, 6);
        loops.forEach((l) => l.timeScale(speed));
        skew(gsap.utils.clamp(-8, 8, velocity / -250));
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: root },
  );

  const words = [...site.marquee, ...site.marquee];
  const Row = ({ outline }) => (
    <div className="mq-track flex w-max items-center will-change-transform">
      {[0, 1].map((copy) => (
        <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
          {words.map((w, i) => (
            <Fragment key={`${copy}-${i}`}>
              <span
                className={`h-display px-6 text-[clamp(3rem,8vw,7rem)] whitespace-nowrap italic md:px-10 ${
                  outline ? 'text-outline' : 'text-cream/90'
                }`}
              >
                {w}
              </span>
              <span className="text-2xl text-gold md:text-4xl">✦</span>
            </Fragment>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <section ref={root} className="relative overflow-hidden border-y border-line py-10 md:py-14" aria-label="Highlights">
      <Row />
      <div className="mt-2">
        <Row outline />
      </div>
    </section>
  );
}
