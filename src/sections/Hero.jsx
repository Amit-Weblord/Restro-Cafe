import { lazy, Suspense, useMemo, useRef, useState } from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import EchoHeading from '../components/EchoHeading';
import ErrorBoundary from '../components/ErrorBoundary';
import Magnetic from '../components/Magnetic';
import SmartImage from '../components/SmartImage';
import { site } from '../config/site';
import { makeCloud } from '../lib/clouds';
import { gsap, useGSAP } from '../lib/gsap';
import { useMenu } from '../lib/menuContext';
import { scrollToSection, useLenis } from '../lib/SmoothScroll';

const HeroScene = lazy(() => import('../three/HeroScene'));

// Cloud bank layout: x / y = centre in % of the screen, w = width in vw,
// side = which way it drifts when the clouds part, soft = extra blur (depth).
const CLOUDS = [
  { x: 16, y: 90, w: 64, s: 3, side: -1, soft: 0.5 },
  { x: 72, y: 94, w: 70, s: 7, side: 1, soft: 0.4 },
  { x: 40, y: 68, w: 58, s: 5, side: -1, soft: 0 },
  { x: 90, y: 60, w: 56, s: 13, side: 1, soft: 0.1 },
  { x: 6, y: 44, w: 54, s: 17, side: -1, soft: 0.1 },
  { x: 60, y: 38, w: 60, s: 19, side: 1, soft: 0 },
  { x: 26, y: 16, w: 56, s: 29, side: -1, soft: 0.2 },
  { x: 84, y: 12, w: 58, s: 31, side: 1, soft: 0.2 },
  { x: 52, y: -4, w: 64, s: 37, side: -1, soft: 0.4 },
];

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return Boolean(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function Hero({ ready }) {
  const root = useRef(null);
  const progress = useRef(0);
  const activeRef = useRef(true);
  const [sceneActive, setSceneActive] = useState(true);
  const [webgl] = useState(webglAvailable);
  const lenis = useLenis();
  const openMenu = useMenu();
  const { hero, space } = site;
  const clouds = useMemo(() => CLOUDS.map((c) => ({ ...c, src: makeCloud(c.s, { soft: c.soft }) })), []);

  // Scroll sequence: hero → steam clouds rise → space revealed → clouds part
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const cloudEls = gsap.utils.toArray('.cloud');
        const vh = () => window.innerHeight;
        const vw = () => window.innerWidth;

        gsap.set(cloudEls, { xPercent: -50, yPercent: -50, autoAlpha: 1 });

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: () => `+=${vh() * 2.8}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              progress.current = Math.min(1, self.progress / 0.3);
              const active = self.progress < 0.34;
              if (active !== activeRef.current) {
                activeRef.current = active;
                setSceneActive(active);
              }
            },
          },
        });

        tl.to('.hero-copy', { y: () => -vh() * 0.18, opacity: 0, duration: 0.8 }, 0)
          .to('.hero-meta', { y: 50, opacity: 0, duration: 0.4 }, 0)
          // clouds drift up from below, bottom row first (top ones travel further = parallax)
          .fromTo(
            cloudEls,
            { y: (i) => vh() * (0.62 + (1 - CLOUDS[i].y / 100) * 0.9) },
            { y: 0, duration: 0.95, ease: 'power1.out', stagger: 0.04 },
            0.02,
          )
          // swap hero → space while the clouds hide the cut
          .fromTo('.fog', { opacity: 0 }, { opacity: 0.55, duration: 0.3 }, 0.5)
          .to('.hero-layer', { opacity: 0, duration: 0.3 }, 0.6)
          .fromTo('.space-layer', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.6)
          .to('.fog', { opacity: 0, duration: 0.5 }, 0.85)
          .fromTo('.space-img', { scale: 1.45 }, { scale: 1, duration: 2.3, ease: 'power1.out' }, 0.6)
          // clouds part to the sides
          .to(
            cloudEls,
            {
              x: (i) => CLOUDS[i].side * vw() * (0.55 + Math.abs(CLOUDS[i].x - 50) / 90),
              y: (i) => -vh() * (0.08 + (1 - CLOUDS[i].y / 100) * 0.3),
              scale: 1.35,
              opacity: 0,
              duration: 1.3,
              ease: 'power2.in',
              stagger: { each: 0.03, from: 'center' },
            },
            1.2,
          )
          .fromTo(
            '.space-copy > *',
            { y: 70, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power2.out' },
            1.8,
          )
          .to({}, { duration: 0.5 });
      });
    },
    { scope: root },
  );

  // Intro once the preloader lifts
  useGSAP(
    () => {
      if (!ready) return;
      gsap.fromTo(
        '.hero-fade',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', stagger: 0.1, delay: 0.55 },
      );
      gsap.fromTo('.hero-glow', { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 2.4, ease: 'expo.out' });
    },
    { scope: root, dependencies: [ready] },
  );

  const fallbackPlate = (
    <div className="absolute top-1/2 right-[6%] aspect-square w-[min(42vw,560px)] -translate-y-1/2 max-md:top-[86%] max-md:right-[-14%] max-md:w-[88vw]">
      <SmartImage src={hero.image} alt="" className="h-full w-full rounded-full object-cover shadow-[0_40px_80px_-20px_rgb(0_0_0/0.9)]" />
    </div>
  );

  return (
    <section id="home" ref={root} className="relative h-svh min-h-[560px] overflow-hidden bg-ink">
      {/* ── Space revealed behind the clouds ── */}
      <div className="space-layer invisible absolute inset-0">
        <div className="absolute inset-0 overflow-hidden">
          <SmartImage src={space.image} alt={space.title} className="space-img h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/25 to-ink/50" />
        <div className="space-copy absolute inset-x-0 bottom-[13%] px-6 text-center">
          <p className="eyebrow justify-center">{space.eyebrow}</p>
          <h2 className="h-display mt-5 text-[clamp(3.2rem,9vw,8.5rem)] text-cream drop-shadow-[0_4px_30px_rgb(0_0_0/0.6)]">
            {space.title}
          </h2>
          <p className="mt-4 text-sm tracking-[0.25em] text-cream/80 uppercase">{space.text}</p>
        </div>
      </div>

      {/* ── Hero ── */}
      <div className="hero-layer absolute inset-0">
        <div className="hero-glow pointer-events-none absolute top-1/2 right-[8%] h-[70vmin] w-[70vmin] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-gold)_22%,transparent),transparent_65%)] blur-2xl max-md:top-[70%] max-md:right-[-15%]" />

        <div className="absolute inset-0">
          {webgl ? (
            <ErrorBoundary fallback={fallbackPlate}>
              <Suspense fallback={null}>
                <HeroScene image={hero.image} zoom={hero.imageZoom} ready={ready} progress={progress} active={sceneActive} />
              </Suspense>
            </ErrorBoundary>
          ) : (
            fallbackPlate
          )}
        </div>

        <div className="hero-copy wrap relative z-10 flex h-full flex-col justify-center pt-16 max-md:justify-start max-md:pt-32">
          <p className="hero-fade eyebrow opacity-0">{hero.eyebrow}</p>
          <EchoHeading
            as="h1"
            play={ready}
            delay={0.15}
            className="mt-6 text-[clamp(3.1rem,7.6vw,7.8rem)] leading-[0.92]"
            lines={hero.lines.map((text, i) => ({ text, accent: i === hero.accentLine }))}
          />
          <p className="hero-fade mt-7 max-w-md text-base leading-relaxed text-cream/70 opacity-0 md:text-lg">{hero.text}</p>
          <div className="hero-fade mt-9 flex flex-wrap items-center gap-4 opacity-0">
            <Magnetic>
              <a
                href="#reserve"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(lenis, '#reserve');
                }}
                className="btn btn-gold"
              >
                Reserve a table <ArrowRight className="h-4 w-4" />
              </a>
            </Magnetic>
            <Magnetic>
              <button type="button" onClick={() => openMenu('mains')} className="btn btn-ghost">
                <BookOpen className="h-4 w-4" /> Explore menu
              </button>
            </Magnetic>
          </div>
        </div>

        <div className="hero-meta wrap pointer-events-none absolute inset-x-0 bottom-6 z-10 flex items-end justify-between md:bottom-10">
          <dl className="hero-fade hidden gap-10 opacity-0 sm:flex">
            {hero.stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="h-display text-3xl text-cream">{s.value}</dd>
                <dd className="mt-1 text-[0.68rem] tracking-[0.22em] text-mute uppercase">{s.label}</dd>
              </div>
            ))}
          </dl>
          <div className="hero-fade flex flex-col items-center gap-3 opacity-0 max-sm:hidden">
            <span className="text-[0.62rem] tracking-[0.35em] text-mute uppercase">Scroll</span>
            <span className="relative h-14 w-px overflow-hidden bg-cream/15">
              <span className="scroll-cue absolute inset-0 bg-gold" />
            </span>
          </div>
        </div>
      </div>

      {/* ── Steam / cloud bank ── */}
      <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
        <div className="fog absolute inset-0 bg-[radial-gradient(ellipse_at_center,#f3eee6_30%,#d9d1c4_100%)] opacity-0" />
        {clouds.map((c) => (
          <img
            key={c.s}
            src={c.src}
            alt=""
            className="cloud invisible absolute max-w-none will-change-transform"
            style={{
              left: `${c.x}%`,
              top: `${c.y}%`,
              width: `max(${c.w}vw, ${c.w * 0.78}vh)`,
            }}
          />
        ))}
      </div>
    </section>
  );
}
