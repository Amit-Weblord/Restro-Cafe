import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';

/**
 * Big display heading whose lines arrive with a stack of stretched "echo"
 * copies that collapse into the real text.
 *
 * lines: array of strings or { text, accent }
 * play:  pass a boolean to trigger manually (e.g. after the preloader);
 *        leave undefined to play when scrolled into view.
 */
export default function EchoHeading({
  lines,
  as: Tag = 'h2',
  className = '',
  ghosts = 5,
  play,
  delay = 0,
}) {
  const ref = useRef(null);
  const tlRef = useRef(null);
  const manual = play !== undefined;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ paused: true, delay });
        ref.current.querySelectorAll('.echo-line').forEach((line, i) => {
          const at = i * 0.14;
          tl.fromTo(
            line.querySelector('.echo-main'),
            { yPercent: 70, scaleY: 1.5, opacity: 0, filter: 'blur(8px)' },
            { yPercent: 0, scaleY: 1, opacity: 1, filter: 'blur(0px)', duration: 1.3, ease: 'expo.out' },
            at,
          );
          tl.fromTo(
            line.querySelectorAll('.echo-ghost'),
            {
              yPercent: (g) => (g + 1) * 24,
              scaleY: (g) => 1 + (g + 1) * 0.14,
              opacity: (g) => 0.65 - g * 0.11,
            },
            {
              yPercent: 0,
              scaleY: 1,
              opacity: 0,
              duration: 1.45,
              ease: 'expo.out',
              stagger: 0.035,
              immediateRender: false,
            },
            at,
          );
        });
        tlRef.current = tl;
        if (!manual) {
          ScrollTrigger.create({
            trigger: ref.current,
            start: 'top 88%',
            once: true,
            onEnter: () => tl.play(),
          });
        }
        return () => {
          tlRef.current = null;
        };
      });
    },
    { scope: ref },
  );

  useEffect(() => {
    if (manual && play) tlRef.current?.play();
  }, [manual, play]);

  return (
    <Tag ref={ref} className={`h-display ${className}`}>
      {lines.map((line, i) => {
        const { text, accent } = typeof line === 'string' ? { text: line } : line;
        return (
          <span key={i} className={`echo-line ${accent ? 'echo-accent' : ''}`}>
            <span className="echo-main">{text}</span>
            {Array.from({ length: ghosts }, (_, g) => (
              <span key={g} aria-hidden="true" className="echo-ghost">
                {text}
              </span>
            ))}
          </span>
        );
      })}
    </Tag>
  );
}
