import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Menu as MenuIcon, X } from 'lucide-react';
import Logo from './Logo';
import Magnetic from './Magnetic';
import SocialIcon from './SocialIcon';
import { site } from '../config/site';
import { scrollToSection, useLenis } from '../lib/SmoothScroll';

export default function Navbar({ ready }) {
  const lenis = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  // Solid background after scrolling, hide on scroll down / show on scroll up
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 40);
        if (y > last + 6 && y > 400) setHidden(true);
        else if (y < last - 6) setHidden(false);
        last = y;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Highlight the section currently in view
  useEffect(() => {
    const sections = site.nav.map((n) => document.getElementById(n.id)).filter(Boolean);
    const visible = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visible.set(entry.target.id, entry.isIntersecting));
        setActive(site.nav.find((n) => visible.get(n.id))?.id ?? '');
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop();
    else lenis.start();
  }, [open, lenis]);

  const go = (e, target) => {
    e.preventDefault();
    setOpen(false);
    scrollToSection(lenis, target);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-[var(--ease-expo)] ${
          hidden && !open ? '-translate-y-full' : 'translate-y-0'
        } ${ready ? 'opacity-100' : 'opacity-0'}`}
      >
        <div
          className={`transition-all duration-500 ${
            scrolled ? 'border-b border-cream/8 bg-ink/70 backdrop-blur-xl' : 'border-b border-transparent'
          }`}
        >
          <nav className="wrap flex h-20 items-center justify-between gap-6" aria-label="Main">
            <a href="#home" onClick={(e) => go(e, '#home')} aria-label={`${site.brand.name} — home`}>
              <Logo />
            </a>

            <ul className="hidden items-center gap-9 lg:flex">
              {site.nav.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => go(e, `#${item.id}`)}
                    className={`group relative py-2 text-[0.8rem] tracking-[0.16em] uppercase transition-colors ${
                      active === item.id ? 'text-gold' : 'text-cream/75 hover:text-cream'
                    }`}
                  >
                    {item.label}
                    <span
                      className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-gold transition-transform duration-500 ${
                        active === item.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <Magnetic>
                  <a href="#reserve" onClick={(e) => go(e, '#reserve')} className="btn btn-gold !px-6 !py-3">
                    Book a table
                  </a>
                </Magnetic>
              </div>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="grid h-11 w-11 place-items-center rounded-full border border-cream/20 text-cream transition-colors hover:border-gold hover:text-gold lg:hidden"
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
              >
                {open ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-nav"
            data-lenis-prevent
            initial={{ clipPath: 'circle(0% at calc(100% - 3rem) 2.5rem)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 3rem) 2.5rem)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 3rem) 2.5rem)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[45] flex flex-col overflow-y-auto bg-coal pt-28 pb-10 lg:hidden"
          >
            <ul className="wrap flex flex-col gap-2">
              {[{ id: 'home', label: 'Home' }, ...site.nav].map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => go(e, `#${item.id}`)}
                    className="h-display flex items-baseline gap-4 py-1 text-5xl text-cream hover:text-gold"
                  >
                    <span className="font-sans text-xs tracking-widest text-gold">0{i + 1}</span>
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="wrap mt-auto pt-10 text-sm text-mute">
              <p>{site.contact.address}</p>
              <p className="mt-1 text-cream">{site.contact.phone}</p>
              <div className="mt-5 flex gap-3">
                {site.socials.map((s) => (
                  <a
                    key={s.type}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="grid h-10 w-10 place-items-center rounded-full border border-cream/15 hover:border-gold hover:text-gold"
                  >
                    <SocialIcon type={s.type} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
