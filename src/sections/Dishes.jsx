import { useRef } from 'react';
import EchoHeading from '../components/EchoHeading';
import SmartImage from '../components/SmartImage';
import TiltCard from '../components/TiltCard';
import { ViewMenuButton } from './Menu';
import { site } from '../config/site';
import { gsap, useGSAP } from '../lib/gsap';
import { useMenu } from '../lib/menuContext';

function DishCard({ dish, index }) {
  return (
    <TiltCard
      className="dish-card group w-[78vw] max-w-[380px] shrink-0 snap-start sm:w-[46vw] lg:w-[25vw] lg:max-w-[400px] lg:min-w-[300px]"
      max={8}
      data-cursor="Taste"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.6rem] bg-char">
        <SmartImage
          src={dish.image}
          alt={dish.name}
          className="dish-img absolute inset-0 h-full w-[118%] max-w-none -translate-x-[8%] object-cover transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink/80 via-transparent to-transparent" />
        {dish.tag && (
          <span
            className="absolute top-4 left-4 rounded-full bg-gold px-3 py-1 text-[0.62rem] font-medium tracking-[0.18em] text-ink uppercase"
            style={{ transform: 'translateZ(40px)' }}
          >
            {dish.tag}
          </span>
        )}
        <span className="h-display absolute top-3 right-5 text-5xl text-cream/25 italic">0{index + 1}</span>
        <div className="absolute inset-x-0 bottom-0 p-6" style={{ transform: 'translateZ(30px)' }}>
          <div className="flex items-end justify-between gap-4">
            <h3 className="h-display text-[1.9rem] leading-none">{dish.name}</h3>
            <span className="h-display shrink-0 text-2xl text-gold">₹{dish.price}</span>
          </div>
          <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-cream/70">
            <span className={`veg-mark mt-[3px] ${dish.veg ? '' : 'non'}`} />
            {dish.desc}
          </p>
        </div>
      </div>
    </TiltCard>
  );
}

export default function Dishes() {
  const root = useRef(null);
  const track = useRef(null);
  const counter = useRef(null);
  const openMenu = useMenu();
  const total = site.dishes.length;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const distance = () => track.current.scrollWidth - window.innerWidth;
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const n = Math.min(total, Math.max(1, Math.round(self.progress * (total - 1)) + 1));
              if (counter.current) counter.current.textContent = String(n).padStart(2, '0');
            },
          },
        });
        // parallax inside each photo while the row slides
        gsap.utils.toArray('.dish-card').forEach((card) => {
          gsap.fromTo(
            card.querySelector('.dish-img'),
            { xPercent: -6 },
            {
              xPercent: 6,
              ease: 'none',
              scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
            },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="dishes" ref={root} className="relative overflow-hidden py-24 lg:flex lg:h-svh lg:items-center lg:py-0">
      <div ref={track} className="flex flex-col gap-12 lg:w-max lg:flex-row lg:items-center lg:gap-10 lg:pr-[8vw] lg:pl-[max(1.25rem,calc((100vw_-_1320px)/2_+_3.5rem))]">
        <div className="wrap shrink-0 lg:w-[30vw] lg:max-w-[440px] lg:p-0">
          <p className="eyebrow">Discover</p>
          <EchoHeading lines={['Our Popular', 'Dishes']} className="mt-6 text-[clamp(2.8rem,5.2vw,5.2rem)]" />
          <p className="mt-6 max-w-sm text-base leading-relaxed text-cream/65">
            The plates our guests come back for — cooked over real fire and finished with care.
          </p>
          <div className="mt-8 flex items-center gap-6">
            <ViewMenuButton onClick={() => openMenu('mains')} label="Full" />
            <p className="hidden items-baseline gap-2 font-display text-cream/60 lg:flex">
              <span ref={counter} className="text-4xl text-gold">
                01
              </span>
              <span className="text-xl">/ {String(total).padStart(2, '0')}</span>
            </p>
          </div>
        </div>

        <div className="no-scrollbar flex snap-x snap-mandatory scroll-px-[max(1.25rem,4vw)] gap-5 overflow-x-auto px-[max(1.25rem,4vw)] pb-4 lg:snap-none lg:gap-8 lg:overflow-visible lg:px-0 lg:pb-0">
          {site.dishes.map((d, i) => (
            <DishCard key={d.name} dish={d} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
