import { mulberry32 } from './random';

const cache = new Map();

/**
 * Builds a realistic, fluffy cloud / steam puff as an SVG image (data URI).
 * The fractal-noise displacement gives the soft, wispy edges. Because it is an
 * <img>, the browser rasterises it once and animating it is cheap.
 */
export function makeCloud(seed, { soft = 0 } = {}) {
  const key = `${seed}-${soft}`;
  if (cache.has(key)) return cache.get(key);

  const w = 1000;
  const h = 600;
  const rand = mulberry32(seed * 7919 + 13);
  const baseY = h * 0.66;

  const shapes = [
    `<ellipse cx="${w / 2}" cy="${baseY + h * 0.06}" rx="${w * 0.36}" ry="${h * 0.11}"/>`,
  ];
  const count = 7 + Math.floor(rand() * 4);
  for (let i = 0; i < count; i += 1) {
    const t = (i + 0.5) / count;
    const bell = Math.sin(t * Math.PI);
    const r = h * (0.09 + bell * 0.17 + rand() * 0.06);
    const cx = w * 0.17 + t * w * 0.66 + (rand() - 0.5) * w * 0.05;
    const cy = baseY - r * 0.45 - bell * h * 0.05 + (rand() - 0.5) * h * 0.04;
    shapes.push(`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}"/>`);
  }
  // a few small puffs on top for an irregular silhouette
  for (let i = 0; i < 3; i += 1) {
    const cx = w * (0.32 + rand() * 0.36);
    const r = h * (0.07 + rand() * 0.06);
    const cy = baseY - h * (0.2 + rand() * 0.1);
    shapes.push(`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}"/>`);
  }

  const body = shapes.join('');
  const blur = (5 + soft * 9).toFixed(1);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<defs>
<filter id="d" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
<feTurbulence type="fractalNoise" baseFrequency="0.011" numOctaves="5" seed="${seed}" result="n"/>
<feDisplacementMap in="SourceGraphic" in2="n" scale="120" xChannelSelector="R" yChannelSelector="B"/>
<feGaussianBlur stdDeviation="${blur}"/>
</filter>
<filter id="s" x="-20%" y="-20%" width="140%" height="140%">
<feTurbulence type="fractalNoise" baseFrequency="0.009" numOctaves="3" seed="${seed + 3}" result="n"/>
<feDisplacementMap in="SourceGraphic" in2="n" scale="140" xChannelSelector="R" yChannelSelector="B"/>
<feGaussianBlur stdDeviation="22"/>
</filter>
<radialGradient id="g" cx="42%" cy="28%" r="78%">
<stop offset="0" stop-color="#ffffff"/>
<stop offset=".55" stop-color="#f4efe7"/>
<stop offset="1" stop-color="#cfc6b8"/>
</radialGradient>
</defs>
<g filter="url(#s)" fill="#7d7468" opacity=".55" transform="translate(0 ${h * 0.06})">${body}</g>
<g filter="url(#d)" fill="url(#g)">${body}</g>
</svg>`;

  const uri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  cache.set(key, uri);
  return uri;
}
