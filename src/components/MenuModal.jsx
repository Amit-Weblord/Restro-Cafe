import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { site } from '../config/site';

const ease = [0.16, 1, 0.3, 1];

/** Full-screen menu overlay with category tabs and veg / non-veg marks. */
export default function MenuModal({ category, onClose }) {
  const open = category !== null;
  const [tab, setTab] = useState(site.fullMenu[0].id);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    setTab(site.fullMenu.some((c) => c.id === category) ? category : site.fullMenu[0].id);
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const t = setTimeout(() => closeRef.current?.focus(), 300);
    return () => {
      window.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [open, category, onClose]);

  const current = site.fullMenu.find((c) => c.id === tab) ?? site.fullMenu[0];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="menu-modal"
          className="fixed inset-0 z-[120] flex items-stretch justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.25 } }}
          role="dialog"
          aria-modal="true"
          aria-label="Full menu"
        >
          <button
            type="button"
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close menu"
            tabIndex={-1}
          />
          <motion.div
            data-lenis-prevent
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.8, ease }}
            className="relative flex h-full w-full max-w-3xl flex-col overflow-y-auto border-l border-line bg-coal"
          >
            <div className="sticky top-0 z-10 border-b border-line bg-coal/95 backdrop-blur">
              <div className="flex items-center justify-between px-6 pt-6 md:px-12 md:pt-10">
                <div>
                  <p className="eyebrow">{site.brand.name}</p>
                  <h2 className="h-display mt-3 text-5xl md:text-6xl">The Menu</h2>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  className="grid h-12 w-12 place-items-center rounded-full border border-cream/20 transition-colors hover:border-gold hover:text-gold"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto px-6 pb-5 md:px-12" role="tablist">
                {site.fullMenu.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={tab === c.id}
                    onClick={() => setTab(c.id)}
                    className={`relative shrink-0 rounded-full px-5 py-2.5 text-xs tracking-[0.18em] uppercase transition-colors ${
                      tab === c.id ? 'text-ink' : 'text-cream/70 hover:text-cream'
                    }`}
                  >
                    {tab === c.id && (
                      <motion.span layoutId="menu-tab" className="absolute inset-0 rounded-full bg-gold" transition={{ duration: 0.5, ease }} />
                    )}
                    <span className="relative">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 px-6 py-8 md:px-12">
              <AnimatePresence mode="wait">
                <motion.ul
                  key={current.id}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                  variants={{ show: { transition: { staggerChildren: 0.05 } } }}
                  className="divide-y divide-line"
                >
                  {current.items.map((item) => (
                    <motion.li
                      key={item.name}
                      variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }}
                      className="group py-6"
                    >
                      <div className="flex items-baseline gap-3">
                        <span className={`veg-mark translate-y-[1px] ${item.veg ? '' : 'non'}`} title={item.veg ? 'Vegetarian' : 'Non-vegetarian'} />
                        <h3 className="h-display text-2xl transition-colors group-hover:text-gold md:text-[1.7rem]">{item.name}</h3>
                        {item.tag && (
                          <span className="hidden rounded-full border border-gold/40 px-2.5 py-0.5 text-[0.62rem] tracking-[0.18em] text-gold uppercase sm:inline">
                            {item.tag}
                          </span>
                        )}
                        <span className="mx-1 hidden flex-1 translate-y-[-4px] border-b border-dotted border-cream/20 sm:block" />
                        <span className="ml-auto font-display text-2xl text-gold">₹{item.price}</span>
                      </div>
                      <p className="mt-1.5 pl-[26px] text-sm text-mute">{item.desc}</p>
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>
              <p className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-mute">
                <span className="inline-flex items-center gap-2">
                  <span className="veg-mark" /> Vegetarian
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="veg-mark non" /> Non-vegetarian
                </span>
                <span>Prices in INR, inclusive of taxes.</span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
