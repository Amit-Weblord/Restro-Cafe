import { useRef } from 'react';
import { Bike, CalendarDays, ChefHat, Coffee, Sparkles } from 'lucide-react';
import EchoHeading from '../components/EchoHeading';
import { site } from '../config/site';
import { useReveal } from '../lib/useReveal';

const ICONS = { events: CalendarDays, chef: ChefHat, delivery: Bike, coffee: Coffee };

export default function Services() {
  const root = useRef(null);
  const { services } = site;
  useReveal(root);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <section ref={root} className="relative py-28 md:py-40">
      <div className="wrap grid gap-8 md:grid-cols-[1fr_1fr] md:items-end">
        <div>
          <p className="eyebrow" data-reveal>
            {services.eyebrow}
          </p>
          <EchoHeading lines={services.title} className="mt-6 text-[clamp(2.8rem,5.4vw,5.2rem)]" />
        </div>
        <p className="max-w-md text-base leading-relaxed text-cream/65 md:justify-self-end" data-reveal data-delay="0.1">
          {services.text}
        </p>
      </div>

      <div className="wrap mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.items.map((s, i) => {
          const Icon = ICONS[s.icon] ?? Sparkles;
          return (
            <div key={s.title} data-reveal data-delay={0.08 * i}>
              <article
                onPointerMove={onMove}
                className="spotlight group relative h-full overflow-hidden rounded-[1.6rem] border border-line bg-coal/50 p-7 transition-all duration-500 hover:-translate-y-2 hover:border-gold/40 md:p-8"
              >
                <span className="h-display absolute top-5 right-6 text-5xl text-cream/[0.06] italic transition-colors duration-500 group-hover:text-gold/20">
                  0{i + 1}
                </span>
                <span className="relative grid h-16 w-16 place-items-center rounded-2xl border border-gold/30 text-gold transition-all duration-500 group-hover:rotate-[-8deg] group-hover:bg-gold group-hover:text-ink group-hover:shadow-[0_0_45px_-6px_var(--color-gold)]">
                  <Icon className="h-7 w-7" strokeWidth={1.4} />
                </span>
                <h3 className="h-display mt-8 text-[1.8rem] leading-tight">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-mute">{s.text}</p>
                <span className="mt-8 block h-px w-full origin-left scale-x-0 bg-linear-to-r from-gold to-transparent transition-transform duration-700 group-hover:scale-x-100" />
              </article>
            </div>
          );
        })}
      </div>
    </section>
  );
}
