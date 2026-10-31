import { useRef } from 'react';
import { ArrowRight, Clock, MapPin, Phone } from 'lucide-react';
import EchoHeading from '../components/EchoHeading';
import RotatingBadge from '../components/RotatingBadge';
import SmartImage from '../components/SmartImage';
import { site } from '../config/site';
import { gsap, useGSAP } from '../lib/gsap';
import { useReveal } from '../lib/useReveal';
import { scrollToSection, useLenis } from '../lib/SmoothScroll';

function InfoCard({ icon: Icon, title, children, href }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  const Tag = href ? 'a' : 'div';
  return (
    <Tag
      href={href}
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noreferrer' : undefined}
      onPointerMove={onMove}
      className="spotlight group flex items-start gap-5 rounded-2xl border border-line bg-coal/60 p-6 transition-colors duration-500 hover:border-gold/40 md:p-7"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/30 text-gold transition-all duration-500 group-hover:bg-gold group-hover:text-ink group-hover:shadow-[0_0_30px_-4px_var(--color-gold)]">
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </span>
      <div>
        <h3 className="h-display text-2xl">{title}</h3>
        <div className="mt-1.5 text-sm leading-relaxed text-mute">{children}</div>
      </div>
    </Tag>
  );
}

export default function Story() {
  const root = useRef(null);
  const lenis = useLenis();
  const { story, contact } = site;
  useReveal(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.story-frame',
          { clipPath: 'inset(100% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.6,
            ease: 'expo.inOut',
            scrollTrigger: { trigger: '.story-frame', start: 'top 80%', once: true },
          },
        );
        gsap.fromTo(
          '.story-img',
          { scale: 1.3, yPercent: -8 },
          {
            scale: 1.05,
            yPercent: 8,
            ease: 'none',
            scrollTrigger: { trigger: '.story-frame', start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section id="story" ref={root} className="relative py-28 md:py-40">
      <div className="wrap grid items-center gap-16 md:grid-cols-[1fr_1.05fr] md:gap-20">
        <div>
          <p className="eyebrow" data-reveal>
            {story.eyebrow}
          </p>
          <EchoHeading lines={story.title} className="mt-6 text-[clamp(2.8rem,5.6vw,5.4rem)]" />
          <div className="mt-8 space-y-5 text-base leading-relaxed text-cream/70 md:text-[1.05rem]">
            {story.text.map((p, i) => (
              <p key={i} data-reveal data-delay={0.1 * (i + 1)}>
                {p}
              </p>
            ))}
          </div>
          <a
            href="#reserve"
            data-reveal
            data-delay="0.3"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(lenis, '#reserve');
            }}
            className="link-line mt-9 text-sm tracking-[0.2em] text-cream uppercase"
          >
            Reserve your table <ArrowRight className="h-4 w-4 text-gold" />
          </a>
        </div>

        <div className="relative">
          <div className="story-frame relative aspect-[4/5] overflow-hidden rounded-[2rem] md:aspect-[5/6]">
            <SmartImage src={story.image} alt="A waiter carrying freshly plated dishes" className="story-img h-full w-full object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-ink/50 to-transparent" />
          </div>
          <RotatingBadge
            text={story.badge}
            className="glass absolute -bottom-12 -left-4 w-32 text-cream/80 md:-left-14 md:w-40"
          >
            <span className="h-display text-4xl text-gold italic">{String(site.brand.since).slice(-2)}</span>
          </RotatingBadge>
        </div>
      </div>

      <div className="wrap mt-24 grid gap-4 md:mt-32 md:grid-cols-3">
        <div data-reveal>
          <InfoCard icon={MapPin} title="Locate us" href={contact.mapUrl}>
            {contact.address}
          </InfoCard>
        </div>
        <div data-reveal data-delay="0.1">
          <InfoCard icon={Clock} title="Open hours">
            {contact.hours.map((h) => (
              <span key={h.days} className="block">
                <span className="text-cream/85">{h.days}</span> · {h.time}
              </span>
            ))}
          </InfoCard>
        </div>
        <div data-reveal data-delay="0.2">
          <InfoCard icon={Phone} title="Reservations" href={`tel:${contact.phone.replace(/\s/g, '')}`}>
            <span className="block text-cream/85">{contact.phone}</span>
            {contact.email}
          </InfoCard>
        </div>
      </div>
    </section>
  );
}
