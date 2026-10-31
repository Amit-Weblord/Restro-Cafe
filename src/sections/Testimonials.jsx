import { useCallback, useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue } from 'motion/react';
import { ArrowLeft, ArrowRight, Quote, Star } from 'lucide-react';
import EchoHeading from '../components/EchoHeading';
import SmartImage from '../components/SmartImage';
import { site } from '../config/site';
import { useReveal } from '../lib/useReveal';

function Stars({ n, className = 'h-3.5 w-3.5' }) {
  return (
    <span className="flex gap-1 text-gold" aria-label={`${n} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={className} fill={i < n ? 'currentColor' : 'none'} strokeWidth={1.5} />
      ))}
    </span>
  );
}

export default function Testimonials() {
  const root = useRef(null);
  const viewport = useRef(null);
  const trackRef = useRef(null);
  const x = useMotionValue(0);
  const [index, setIndex] = useState(0);
  const [maxIndex, setMaxIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const { testimonials } = site;
  useReveal(root);

  const step = useCallback(() => {
    const first = trackRef.current?.children[1];
    if (!first) return 360;
    const gap = parseFloat(getComputedStyle(trackRef.current).columnGap || '24');
    return first.getBoundingClientRect().width + gap;
  }, []);

  const overflowWidth = useCallback(() => {
    const vp = viewport.current;
    const cs = getComputedStyle(vp);
    const inner = vp.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    return Math.max(0, trackRef.current.scrollWidth - inner);
  }, []);

  const measure = useCallback(() => {
    if (!viewport.current || !trackRef.current) return;
    setMaxIndex(Math.ceil(overflowWidth() / step()));
  }, [step, overflowWidth]);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  const goTo = useCallback(
    (i) => {
      const clamped = Math.max(0, Math.min(maxIndex, i));
      setIndex(clamped);
      animate(x, -Math.min(clamped * step(), overflowWidth()), { type: 'spring', stiffness: 120, damping: 22 });
    },
    [maxIndex, step, x, overflowWidth],
  );

  // gentle autoplay
  useEffect(() => {
    if (paused || maxIndex === 0) return undefined;
    const id = setInterval(() => goTo(index >= maxIndex ? 0 : index + 1), 5000);
    return () => clearInterval(id);
  }, [index, maxIndex, paused, goTo]);

  const onDragEnd = (_, info) => {
    const projected = -x.get() - info.velocity.x * 0.2;
    goTo(Math.round(projected / step()));
  };

  return (
    <section ref={root} className="relative overflow-hidden py-28 md:py-36">
      <div className="wrap flex flex-wrap items-end justify-between gap-8">
        <div>
          <p className="eyebrow" data-reveal>
            {testimonials.eyebrow}
          </p>
          <EchoHeading lines={[testimonials.title]} className="mt-6 text-[clamp(2.6rem,5vw,4.8rem)]" />
        </div>
        <div className="flex items-center gap-8" data-reveal data-delay="0.1">
          <div className="text-right">
            <p className="h-display text-5xl text-gold">{testimonials.rating.score}</p>
            <div className="mt-1 flex justify-end">
              <Stars n={5} />
            </div>
            <p className="mt-1.5 text-xs tracking-[0.18em] text-mute uppercase">{testimonials.rating.count} reviews</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              aria-label="Previous review"
              className="grid h-14 w-14 place-items-center rounded-full border border-cream/20 transition-all hover:border-gold hover:text-gold disabled:opacity-30"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              disabled={index >= maxIndex}
              aria-label="Next review"
              className="grid h-14 w-14 place-items-center rounded-full border border-cream/20 transition-all hover:border-gold hover:text-gold disabled:opacity-30"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={viewport}
        className="wrap mt-14 overflow-hidden"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        data-reveal
        data-delay="0.15"
      >
        <motion.div
          ref={trackRef}
          drag="x"
          style={{ x }}
          dragConstraints={viewport}
          dragElastic={0.12}
          onDragStart={() => setPaused(true)}
          onDragEnd={onDragEnd}
          className="flex cursor-grab gap-5 active:cursor-grabbing"
          data-cursor="Drag"
        >
          <div className="relative w-[78vw] max-w-[300px] shrink-0 overflow-hidden rounded-[1.6rem] sm:w-[300px]">
            <SmartImage src={testimonials.image} alt="" className="pointer-events-none h-full min-h-[320px] w-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-ink/90 to-transparent" />
            <p className="h-display absolute inset-x-6 bottom-6 text-3xl leading-tight">
              Loved by <span className="text-gold italic">{testimonials.rating.count}</span> guests
            </p>
          </div>
          {testimonials.items.map((t) => (
            <article
              key={t.name}
              className="flex w-[78vw] max-w-[360px] shrink-0 flex-col rounded-[1.6rem] border border-line bg-coal/60 p-7 select-none sm:w-[360px]"
            >
              <div className="flex items-center justify-between">
                <Stars n={t.stars} />
                <Quote className="h-8 w-8 text-gold/25" />
              </div>
              <p className="mt-6 flex-1 text-[0.98rem] leading-relaxed text-cream/80">“{t.text}”</p>
              <div className="mt-8 flex items-center gap-4 border-t border-line pt-6">
                <span className="h-display grid h-12 w-12 place-items-center rounded-full bg-gold/15 text-xl text-gold">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="font-medium">{t.name}</p>
                  <p className="text-xs tracking-[0.14em] text-mute uppercase">{t.occasion}</p>
                </div>
              </div>
            </article>
          ))}
        </motion.div>
      </div>

      <div className="wrap mt-10 flex gap-2" aria-hidden="true">
        {Array.from({ length: maxIndex + 1 }, (_, i) => (
          <span
            key={i}
            className={`h-[2px] rounded-full transition-all duration-500 ${i === index ? 'w-10 bg-gold' : 'w-4 bg-cream/15'}`}
          />
        ))}
      </div>
    </section>
  );
}
