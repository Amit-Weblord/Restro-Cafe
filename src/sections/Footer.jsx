import { useRef, useState } from 'react';
import { ArrowRight, ArrowUp, Check } from 'lucide-react';
import Logo from '../components/Logo';
import SocialIcon from '../components/SocialIcon';
import { site } from '../config/site';
import { gsap, useGSAP } from '../lib/gsap';
import { scrollToSection, useLenis } from '../lib/SmoothScroll';

export default function Footer() {
  const root = useRef(null);
  const lenis = useLenis();
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const { contact, brand } = site;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.ft-letter',
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 1.3,
            ease: 'expo.out',
            stagger: 0.035,
            scrollTrigger: { trigger: '.ft-word', start: 'top 95%', once: true },
          },
        );
      });
    },
    { scope: root },
  );

  const go = (e, id) => {
    e.preventDefault();
    scrollToSection(lenis, id);
  };

  return (
    <footer ref={root} className="relative overflow-hidden border-t border-line bg-coal pt-20">
      <div className="wrap grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1fr_1.3fr]">
        <div>
          <Logo className="text-3xl" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-mute">
            {brand.kind}. Wood-fired food and good coffee in {brand.city} since {brand.since}.
          </p>
          <div className="mt-6 flex gap-3">
            {site.socials.map((s) => (
              <a
                key={s.type}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="grid h-11 w-11 place-items-center rounded-full border border-cream/15 text-cream/80 transition-all hover:-translate-y-1 hover:border-gold hover:text-gold"
              >
                <SocialIcon type={s.type} />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Footer">
          <h3 className="field-label">Explore</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {[{ id: 'home', label: 'Home' }, ...site.nav].map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} onClick={(e) => go(e, `#${n.id}`)} className="text-cream/75 transition-colors hover:text-gold">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="field-label">Visit</h3>
          <address className="mt-4 text-sm leading-relaxed text-cream/75 not-italic">
            <a href={contact.mapUrl} target="_blank" rel="noreferrer" className="hover:text-gold">
              {contact.address}
            </a>
            <span className="mt-4 block">
              {contact.hours.map((h) => (
                <span key={h.days} className="block">
                  {h.days}: <span className="text-mute">{h.time}</span>
                </span>
              ))}
            </span>
            <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="mt-4 block text-cream hover:text-gold">
              {contact.phone}
            </a>
            <a href={`mailto:${contact.email}`} className="block hover:text-gold">
              {contact.email}
            </a>
          </address>
        </div>

        <div>
          <h3 className="field-label">Join our mailing list</h3>
          <p className="mt-4 text-sm text-mute">Get news on events, new menus and members-only offers.</p>
          {joined ? (
            <p className="mt-6 inline-flex items-center gap-2 text-sm text-gold">
              <Check className="h-4 w-4" /> You're on the list — see you soon!
            </p>
          ) : (
            <form
              className="mt-6 flex items-center gap-2 rounded-full border border-cream/15 p-1.5 pl-5 focus-within:border-gold"
              onSubmit={(e) => {
                e.preventDefault();
                if (/\S+@\S+\.\S+/.test(email)) setJoined(true);
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                aria-label="Email address"
                className="min-w-0 flex-1 bg-transparent text-sm text-cream outline-none placeholder:text-cream/35"
              />
              <button type="submit" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold text-ink transition-colors hover:bg-gold-soft" aria-label="Subscribe">
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="ft-word wrap mt-20 overflow-hidden" aria-hidden="true">
        <p className="h-display flex justify-center bg-linear-to-b from-cream/90 to-cream/10 bg-clip-text text-[clamp(3rem,11.5vw,12.5rem)] leading-[1] whitespace-nowrap text-transparent">
          {brand.name.split('').map((ch, i) => (
            <span key={i} className={`ft-letter inline-block ${ch === '&' ? 'text-gold/70 italic' : ''}`}>
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
        </p>
      </div>

      <div className="wrap mt-8 flex flex-col items-center justify-between gap-4 border-t border-line py-7 text-xs text-mute sm:flex-row">
        <p>
          © {new Date().getFullYear()} {brand.name}. All rights reserved.
        </p>
        <p>
          Website by{' '}
          <a href={site.credit.url} className="text-cream/80 hover:text-gold">
            {site.credit.name}
          </a>
        </p>
        <button type="button" onClick={(e) => go(e, '#home')} className="inline-flex items-center gap-2 tracking-[0.2em] uppercase hover:text-gold">
          Back to top <ArrowUp className="h-3.5 w-3.5" />
        </button>
      </div>
    </footer>
  );
}
