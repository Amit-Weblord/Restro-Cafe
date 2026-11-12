import { useCallback, useEffect, useState } from 'react';
import Cursor from './components/Cursor';
import FloatingActions from './components/FloatingActions';
import GoldDust from './components/GoldDust';
import MenuModal from './components/MenuModal';
import Navbar from './components/Navbar';
import Preloader from './components/Preloader';
import ScrollProgress from './components/ScrollProgress';
import { site } from './config/site';
import { ScrollTrigger } from './lib/gsap';
import { MenuContext } from './lib/menuContext';
import { useLenis } from './lib/SmoothScroll';
import Dishes from './sections/Dishes';
import Events from './sections/Events';
import Footer from './sections/Footer';
import Hero from './sections/Hero';
import Marquee from './sections/Marquee';
import Menu from './sections/Menu';
import Reservation from './sections/Reservation';
import Services from './sections/Services';
import Story from './sections/Story';
import Testimonials from './sections/Testimonials';

export default function App() {
  const lenis = useLenis();
  const [ready, setReady] = useState(false);
  const [loaderGone, setLoaderGone] = useState(false);
  const [menuCategory, setMenuCategory] = useState(null);

  const openMenu = useCallback((category) => setMenuCategory(category ?? site.fullMenu[0].id), []);
  const closeMenu = useCallback(() => setMenuCategory(null), []);
  const locked = !ready || menuCategory !== null;

  // Freeze scrolling during the preloader and while the menu overlay is open
  useEffect(() => {
    document.documentElement.style.overflow = locked ? 'hidden' : '';
    if (lenis) {
      if (locked) lenis.stop();
      else lenis.start();
    }
  }, [lenis, locked]);

  // Re-measure scroll animations once everything (fonts, images) has settled
  useEffect(() => {
    if (!ready) return undefined;
    const refresh = () => ScrollTrigger.refresh();
    const id = setTimeout(refresh, 300);
    window.addEventListener('load', refresh);
    return () => {
      clearTimeout(id);
      window.removeEventListener('load', refresh);
    };
  }, [ready]);

  return (
    <MenuContext.Provider value={openMenu}>
      {!loaderGone && <Preloader onReveal={() => setReady(true)} onDone={() => setLoaderGone(true)} />}
      <Cursor />
      <GoldDust />
      <ScrollProgress />
      <div className="grain" aria-hidden="true" />
      <Navbar ready={ready} />

      <main>
        <Hero ready={ready} />
        <Story />
        <Marquee />
        <Menu />
        <Dishes />
        <Services />
        <Events />
        <Testimonials />
        <Reservation />
      </main>

      <Footer />
      <MenuModal category={menuCategory} onClose={closeMenu} />
      <FloatingActions />
    </MenuContext.Provider>
  );
}
