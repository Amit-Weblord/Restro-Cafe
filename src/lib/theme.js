/** Applies a brand palette at runtime by overriding the Tailwind colour variables. */
export function applyTheme({ accent, accentSoft }) {
  const root = document.documentElement;
  root.style.setProperty('--color-gold', accent);
  root.style.setProperty('--color-gold-soft', accentSoft);
  window.dispatchEvent(new CustomEvent('themechange', { detail: { accent, accentSoft } }));
}

export function readAccent() {
  return getComputedStyle(document.documentElement).getPropertyValue('--color-gold').trim() || '#d6a756';
}
