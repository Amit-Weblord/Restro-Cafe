import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MessageCircle, Palette, X } from 'lucide-react';
import { site } from '../config/site';
import { applyTheme } from '../lib/theme';

/** WhatsApp chat button + (demo only) brand colour switcher. */
export default function FloatingActions() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(site.theme.accent);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const wa = `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(`Hi ${site.brand.name}! I'd like to know more.`)}`;

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.a
            key="wa"
            href={wa}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat with us on WhatsApp"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="group fixed right-5 bottom-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-gold text-ink shadow-[0_10px_40px_-8px_var(--color-gold)] md:right-8 md:bottom-8"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-gold/40 [animation-duration:2.5s]" />
            <MessageCircle className="relative h-6 w-6" />
            <span className="pointer-events-none absolute right-full mr-3 hidden rounded-full bg-cream px-3 py-1.5 text-xs whitespace-nowrap text-ink opacity-0 transition-opacity group-hover:opacity-100 md:block">
              Chat on WhatsApp
            </span>
          </motion.a>
        )}
      </AnimatePresence>

      {site.demo.themeSwitcher && (
        <div className="fixed bottom-5 left-5 z-40 md:bottom-8 md:left-8">
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="glass absolute bottom-16 left-0 w-60 rounded-2xl p-4"
              >
                <p className="text-[0.65rem] tracking-[0.22em] text-mute uppercase">Demo · brand colour</p>
                <div className="mt-3 grid gap-1.5">
                  {site.demo.palettes.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => {
                        applyTheme(p);
                        setCurrent(p.accent);
                      }}
                      className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-cream/5 ${
                        current === p.accent ? 'text-cream' : 'text-cream/70'
                      }`}
                    >
                      <span
                        className="h-5 w-5 rounded-full ring-2 ring-offset-2 ring-offset-coal"
                        style={{ background: p.accent, '--tw-ring-color': current === p.accent ? p.accent : 'transparent' }}
                      />
                      {p.name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="glass grid h-12 w-12 place-items-center rounded-full text-gold transition-transform hover:scale-105"
            aria-label="Try brand colours"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Palette className="h-5 w-5" />}
          </button>
        </div>
      )}
    </>
  );
}
