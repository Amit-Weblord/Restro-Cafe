import { gsap, useGSAP } from './gsap';

/**
 * Fades + lifts every [data-reveal] element inside `scope` when it scrolls into view.
 * Optional data-delay="0.2" per element.
 */
export function useReveal(scope) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray('[data-reveal]', scope.current).forEach((el) => {
          gsap.fromTo(
            el,
            { y: 44, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.1,
              ease: 'power3.out',
              delay: parseFloat(el.dataset.delay || '0'),
              scrollTrigger: { trigger: el, start: 'top 90%', once: true },
            },
          );
        });
      });
    },
    { scope },
  );
}
