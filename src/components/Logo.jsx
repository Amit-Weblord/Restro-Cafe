import { site } from '../config/site';

export default function Logo({ className = '' }) {
  const [a, joiner, b] = site.brand.logo;
  return (
    <span className={`h-display inline-flex items-baseline gap-1.5 whitespace-nowrap text-[1.7rem] leading-none ${className}`}>
      <span>{a}</span>
      <span className="text-gold italic">{joiner}</span>
      <span>{b}</span>
    </span>
  );
}
