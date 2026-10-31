/** Minimal line icons for social networks (lucide no longer ships brand icons). */
export default function SocialIcon({ type, className = 'h-4 w-4' }) {
  const common = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };
  if (type === 'instagram') {
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
      </svg>
    );
  }
  if (type === 'facebook') {
    return (
      <svg {...common}>
        <path d="M14.5 8H17V4h-2.5C11.9 4 10 5.9 10 8.5V11H7.5v4H10v6h4v-6h2.6l.9-4H14V8.9c0-.5.4-.9.5-.9z" />
      </svg>
    );
  }
  if (type === 'youtube') {
    return (
      <svg {...common}>
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
        <path d="M10.5 9.5v5l4.5-2.5z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}
