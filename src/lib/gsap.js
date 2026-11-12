import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Mobile browsers (notably iOS/Android Chrome) fire resize events when the
// address bar hides/shows while scrolling. With a pinned ScrollTrigger on
// the hero, that spurious resize can retrigger a refresh mid-scroll and get
// the page stuck. Ignore those so only real layout changes trigger a refresh.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger, useGSAP };
