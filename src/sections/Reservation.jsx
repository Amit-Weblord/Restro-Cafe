import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, LoaderCircle, MessageCircle } from 'lucide-react';
import EchoHeading from '../components/EchoHeading';
import Magnetic from '../components/Magnetic';
import SmartImage from '../components/SmartImage';
import { site } from '../config/site';
import { gsap, useGSAP } from '../lib/gsap';
import { useReveal } from '../lib/useReveal';

const ease = [0.16, 1, 0.3, 1];

function formatSlot(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function prettyDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

const EMPTY = { name: '', phone: '', guests: '2', date: '', time: '', occasion: '', notes: '' };

/**
 * Front-end only booking form. On submit it shows a confirmation and a
 * one-tap "Send on WhatsApp" link with the booking pre-filled, so the
 * restaurant receives it with no backend. Swap handleSubmit for an API call
 * when the client has one.
 */
export default function Reservation() {
  const root = useRef(null);
  const { reservation, contact } = site;
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | done
  useReveal(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.res-bg',
          { yPercent: -12 },
          { yPercent: 12, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
        );
      });
    },
    { scope: root },
  );

  const slots = useMemo(() => {
    const out = [];
    for (let t = reservation.firstSlot; t <= reservation.lastSlot; t += 30) out.push(formatSlot(t));
    return out;
  }, [reservation.firstSlot, reservation.lastSlot]);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (form.name.trim().length < 2) er.name = 'Please enter your name';
    const digits = form.phone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
    if (!/^[6-9]\d{9}$/.test(digits)) er.phone = 'Enter a valid 10-digit mobile number';
    if (!form.date) er.date = 'Pick a date';
    else if (form.date < todayISO()) er.date = 'That date has passed';
    if (!form.time) er.time = 'Pick a time';
    return er;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;
    setStatus('sending');
    setTimeout(() => setStatus('done'), 1300);
  };

  const waText = encodeURIComponent(
    [
      `Hi ${site.brand.name}! I'd like to book a table.`,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Guests: ${form.guests}`,
      `Date: ${prettyDate(form.date)}`,
      `Time: ${form.time}`,
      form.occasion && `Occasion: ${form.occasion}`,
      form.notes && `Notes: ${form.notes}`,
    ]
      .filter(Boolean)
      .join('\n'),
  );

  const err = (key) =>
    errors[key] ? (
      <span className="mt-1.5 block text-xs text-[#e0664f]" role="alert">
        {errors[key]}
      </span>
    ) : null;

  return (
    <section id="reserve" ref={root} className="relative overflow-hidden py-28 md:py-40">
      <div className="absolute inset-0">
        <SmartImage src={reservation.image} alt="" className="res-bg absolute inset-x-0 top-[-12%] h-[124%] w-full object-cover" />
        <div className="absolute inset-0 bg-ink/78" />
        <div className="absolute inset-0 bg-linear-to-b from-ink via-transparent to-ink" />
      </div>

      <div className="wrap relative max-w-4xl text-center">
        <p className="eyebrow justify-center" data-reveal>
          {reservation.eyebrow}
        </p>
        <EchoHeading lines={[reservation.title]} className="mt-6 text-[clamp(2.8rem,6vw,5.6rem)]" />
        <p className="mx-auto mt-5 max-w-md text-base text-cream/70" data-reveal data-delay="0.1">
          {reservation.text}
        </p>

        <div className="glass relative mt-12 overflow-hidden rounded-[2rem] text-left" data-reveal data-delay="0.15">
          <AnimatePresence mode="wait" initial={false}>
            {status !== 'done' ? (
              <motion.form
                key="form"
                noValidate
                onSubmit={handleSubmit}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.35 } }}
                className="grid gap-x-8 gap-y-7 p-6 sm:p-10 md:grid-cols-2 md:p-12"
              >
                <label className="block">
                  <span className="field-label">Name</span>
                  <input className="field" value={form.name} onChange={set('name')} placeholder="Your full name" autoComplete="name" aria-invalid={Boolean(errors.name)} />
                  {err('name')}
                </label>
                <label className="block">
                  <span className="field-label">Mobile</span>
                  <input className="field" value={form.phone} onChange={set('phone')} placeholder="98765 43210" inputMode="tel" autoComplete="tel" aria-invalid={Boolean(errors.phone)} />
                  {err('phone')}
                </label>
                <label className="block">
                  <span className="field-label">Guests</span>
                  <select className="field" value={form.guests} onChange={set('guests')}>
                    {Array.from({ length: reservation.maxGuests }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'guest' : 'guests'}
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-5">
                  <label className="block">
                    <span className="field-label">Date</span>
                    <input type="date" className="field" min={todayISO()} value={form.date} onChange={set('date')} aria-invalid={Boolean(errors.date)} />
                    {err('date')}
                  </label>
                  <label className="block">
                    <span className="field-label">Time</span>
                    <select className="field" value={form.time} onChange={set('time')} aria-invalid={Boolean(errors.time)}>
                      <option value="">Select</option>
                      {slots.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    {err('time')}
                  </label>
                </div>

                <fieldset className="md:col-span-2">
                  <legend className="field-label">Occasion</legend>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {reservation.occasions.map((o) => {
                      const on = form.occasion === o;
                      return (
                        <button
                          key={o}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, occasion: on ? '' : o }))}
                          aria-pressed={on}
                          className={`rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
                            on ? 'border-gold bg-gold text-ink' : 'border-cream/20 text-cream/75 hover:border-gold/60 hover:text-cream'
                          }`}
                        >
                          {o}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                <label className="block md:col-span-2">
                  <span className="field-label">Special requests (optional)</span>
                  <textarea className="field min-h-[3rem] resize-none" rows={2} value={form.notes} onChange={set('notes')} placeholder="Window seat, high chair, allergies…" />
                </label>

                <div className="flex flex-col items-center justify-between gap-5 sm:flex-row md:col-span-2">
                  <p className="text-xs text-mute">
                    Prefer to call? <a href={`tel:${contact.phone.replace(/\s/g, '')}`} className="text-cream hover:text-gold">{contact.phone}</a>
                  </p>
                  <Magnetic>
                    <button type="submit" disabled={status === 'sending'} className="btn btn-gold min-w-[220px]">
                      {status === 'sending' ? (
                        <>
                          <LoaderCircle className="h-4 w-4 animate-spin" /> Reserving…
                        </>
                      ) : (
                        <>
                          Book a table <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </Magnetic>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease }}
                className="flex flex-col items-center p-10 text-center md:p-16"
              >
                <svg viewBox="0 0 52 52" className="h-20 w-20 text-gold" aria-hidden="true">
                  <motion.circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease }} />
                  <motion.path d="M15 27l7 7 15-16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.6, ease }} />
                </svg>
                <h3 className="h-display mt-6 text-4xl md:text-5xl">Thank you, {form.name.split(' ')[0]}!</h3>
                <p className="mt-4 max-w-md text-cream/75">
                  Your table for <span className="text-gold">{form.guests}</span> on <span className="text-gold">{prettyDate(form.date)}</span> at{' '}
                  <span className="text-gold">{form.time}</span> is requested. Tap below to confirm on WhatsApp.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <a href={`https://wa.me/${contact.whatsapp}?text=${waText}`} target="_blank" rel="noreferrer" className="btn btn-gold">
                    <MessageCircle className="h-4 w-4" /> Send on WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setForm(EMPTY);
                      setStatus('idle');
                    }}
                    className="btn btn-ghost"
                  >
                    New booking
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
