import { createContext, useContext, useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

const LenisContext = createContext(null);

export const useLenis = () => useContext(LenisContext);

/** Buttery smooth scrolling (Lenis) kept in sync with GSAP ScrollTrigger. */
export function SmoothScroll({ children }) {
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const instance = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 1 });
    instance.on('scroll', ScrollTrigger.update);
    const tick = (time) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

/** Scroll to "#section" (or 0 for top) using Lenis when available. */
export function scrollToSection(lenis, target) {
  const isTop = target === 0 || target === '#home';
  if (lenis) {
    lenis.scrollTo(isTop ? 0 : target, { duration: 1.8, offset: 0 });
    return;
  }
  if (isTop) window.scrollTo({ top: 0, behavior: 'smooth' });
  else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
}
