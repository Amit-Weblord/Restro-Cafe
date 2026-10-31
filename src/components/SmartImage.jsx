import { useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';

/** <img> that falls back to an on-brand placeholder if the photo is missing. */
export default function SmartImage({ src, alt = '', className = '', ...rest }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`grid place-items-center bg-[radial-gradient(circle_at_30%_25%,var(--color-char),var(--color-ink))] text-gold/40 ${className}`}
      >
        <UtensilsCrossed className="h-10 w-10" strokeWidth={1} />
      </div>
    );
  }

  return <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} className={className} {...rest} />;
}
