import { useRef } from 'react';
import { BookOpen } from 'lucide-react';
import EchoHeading from '../components/EchoHeading';
import SmartImage from '../components/SmartImage';
import Splash from '../components/Splash';
import TiltCard from '../components/TiltCard';
import { site } from '../config/site';
import { gsap, useGSAP } from '../lib/gsap';
import { useMenu } from '../lib/menuContext';
import { useReveal } from '../lib/useReveal';

/** "View [icon] Menu" — the icon slides in between the words on hover. */
export function ViewMenuButton({ onClick, label = 'View', label2 = 'Menu' }) {
  return (
    <button type="button" onClick={onClick} className="btn btn-ghost group">
      <span>{label}</span>
      <span className="grid w-0 place-items-center overflow-hidden opacity-0 transition-all duration-500 ease-[var(--ease-expo)] group-hover:w-5 group-hover:opacity-100">
        <BookOpen className="h-4 w-4 shrink-0 text-gold" />
      </span>
      <span>{label2}</span>
    </button>
  );
}

export default function Menu() {
  const root = useRef(null);
  const openMenu = useMenu();
  const { menu, menuHighlights } = site;
  useReveal(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray('.menu-row').forEach((row, i) => {
          const dir = i % 2 ? -1 : 1;
          gsap.fromTo(
            row.querySelector('.plate-spin'),
            { rotate: -70 * dir },
            {
              rotate: 50 * dir,
              ease: 'none',
              scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: 1 },
            },
          );
          gsap.fromTo(
            row.querySelector('.plate-wrap'),
            { xPercent: -25 * dir, opacity: 0, scale: 0.8 },
            {
              xPercent: 0,
              opacity: 1,
              scale: 1,
              duration: 1.6,
              ease: 'expo.out',
              scrollTrigger: { trigger: row, start: 'top 78%', once: true },
            },
          );
          gsap.fromTo(
            row.querySelector('.splash'),
            { rotate: 30 * dir, scale: 0.7, opacity: 0 },
            {
              rotate: -20 * dir,
              scale: 1,
              opacity: 1,
              ease: 'none',
              scrollTrigger: { trigger: row, start: 'top 85%', end: 'center center', scrub: 1 },
            },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="menu" ref={root} className="relative overflow-hidden py-28 md:py-40">
      <div className="wrap grid items-end gap-8 md:grid-cols-2">
        <div>
          <p className="eyebrow" data-reveal>
            {menu.eyebrow}
          </p>
          <EchoHeading lines={menu.title} className="mt-6 text-[clamp(3rem,6vw,5.6rem)]" />
        </div>
        <p className="max-w-md text-base leading-relaxed text-cream/65 md:justify-self-end" data-reveal data-delay="0.15">
          {menu.text}
        </p>
      </div>

      <div className="wrap mt-16 flex flex-col gap-24 md:mt-24 md:gap-10">
        {menuHighlights.map((m, i) => {
          const flip = i % 2 === 1;
          return (
            <div key={m.title} className="menu-row grid items-center gap-10 md:grid-cols-2 md:gap-16">
              <div className={`relative mx-auto w-[82%] max-w-[480px] ${flip ? 'md:order-2' : ''}`}>
                <div className="plate-wrap relative aspect-square">
                  <div className="absolute inset-[-8%] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-gold)_16%,transparent),transparent_70%)] blur-2xl" />
                  <Splash
                    seed={i + 2}
                    from={flip ? 0.55 : 0.05}
                    className="splash pointer-events-none absolute inset-[-18%] h-[136%] w-[136%]"
                  />
                  <TiltCard className="h-full w-full rounded-full" max={12} data-cursor="Menu">
                    <button
                      type="button"
                      onClick={() => openMenu(m.category)}
                      className="block h-full w-full rounded-full"
                      aria-label={`Open the ${m.title} menu`}
                    >
                      <div className="plate-spin h-full w-full overflow-hidden rounded-full shadow-[0_50px_90px_-25px_rgb(0_0_0/0.95),0_0_0_10px_rgb(255_255_255/0.025)]">
                        <SmartImage src={m.image} alt={m.title} className="h-full w-full scale-[1.1] object-cover" />
                      </div>
                    </button>
                  </TiltCard>
                </div>
              </div>

              <div className={`${flip ? 'md:order-1 md:text-right' : ''}`}>
                <span className="h-display block text-7xl text-gold/25 italic md:text-8xl" data-reveal>
                  0{i + 1}
                </span>
                <h3 className="h-display mt-2 text-4xl md:text-5xl" data-reveal data-delay="0.05">
                  {m.title}
                </h3>
                <p
                  className={`mt-4 max-w-sm text-base leading-relaxed text-cream/65 ${flip ? 'md:ml-auto' : ''}`}
                  data-reveal
                  data-delay="0.1"
                >
                  {m.text}
                </p>
                <div className="mt-8" data-reveal data-delay="0.2">
                  <ViewMenuButton onClick={() => openMenu(m.category)} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
