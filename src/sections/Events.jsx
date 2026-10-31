import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, CalendarDays, Clock, MapPin } from 'lucide-react';
import SmartImage from '../components/SmartImage';
import EchoHeading from '../components/EchoHeading';
import { site } from '../config/site';
import { useReveal } from '../lib/useReveal';
import { scrollToSection, useLenis } from '../lib/SmoothScroll';

export default function Events() {
  const root = useRef(null);
  const lenis = useLenis();
  const [active, setActive] = useState(0);
  const { events } = site;
  const current = events.items[active];
  useReveal(root);

  return (
    <section id="events" ref={root} className="relative py-20 md:py-28">
      <div className="wrap">
        <div
          className="grid overflow-hidden rounded-[2rem] border border-line bg-coal/60 lg:grid-cols-[1.05fr_1fr]"
          data-reveal
        >
          <div className="p-7 sm:p-10 lg:p-14">
            <p className="eyebrow">{events.eyebrow}</p>
            <EchoHeading lines={[events.title]} className="mt-5 text-[clamp(2.6rem,4.6vw,4.4rem)]" />
            <p className="mt-5 max-w-md text-base leading-relaxed text-cream/65">{events.text}</p>

            <ul className="mt-10 divide-y divide-line border-y border-line">
              {events.items.map((ev, i) => (
                <li key={ev.title}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
                    className="group flex w-full items-center gap-5 py-5 text-left"
                    aria-pressed={active === i}
                  >
                    <span
                      className={`h-display w-8 text-3xl italic transition-colors duration-500 ${
                        active === i ? 'text-gold' : 'text-cream/25'
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <span className="flex-1">
                      <span
                        className={`h-display block text-2xl transition-all duration-500 md:text-[1.75rem] ${
                          active === i ? 'translate-x-2 text-cream' : 'text-cream/60'
                        }`}
                      >
                        {ev.title}
                      </span>
                      <span className="mt-1 block text-xs tracking-[0.2em] text-mute uppercase">
                        {ev.when} · {ev.place}
                      </span>
                    </span>
                    <ArrowUpRight
                      className={`h-5 w-5 transition-all duration-500 ${
                        active === i ? 'rotate-45 text-gold' : 'text-cream/30'
                      }`}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative min-h-[420px] overflow-hidden lg:min-h-full">
            <AnimatePresence mode="sync">
              <motion.div
                key={current.title}
                className="absolute inset-0"
                initial={{ clipPath: 'inset(0% 0% 0% 100%)', scale: 1.15 }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.6, delay: 0.3 } }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <SmartImage src={current.image} alt={current.title} className="h-full w-full object-cover" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-linear-to-t from-ink/90 via-ink/20 to-transparent" />
            <AnimatePresence mode="wait">
              <motion.div
                key={current.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.6 } }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                className="glass absolute inset-x-5 bottom-5 rounded-2xl p-6 sm:inset-x-8 sm:bottom-8"
              >
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs tracking-[0.16em] text-gold uppercase">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="h-3.5 w-3.5" /> {current.when}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" /> {current.time}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" /> {current.place}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-cream/80">{current.text}</p>
                <a
                  href="#reserve"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(lenis, '#reserve');
                  }}
                  className="link-line mt-4 text-xs tracking-[0.2em] text-cream uppercase"
                >
                  Save me a seat <ArrowUpRight className="h-3.5 w-3.5 text-gold" />
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
