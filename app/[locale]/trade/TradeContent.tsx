'use client';

import { useState } from 'react';
import { SlideIn } from '@/components/editorial/SlideIn';
import { Reveal } from '@/components/editorial/Reveal';

const PARTNER_TYPES = [
  'Interior designer / Architect',
  'Importer / Distributor',
  'Retailer / Showroom',
  'Luxury carpet brand',
  'Other',
];

const INTERESTS = [
  'Ready collections',
  'Made to specification orders',
  'White label manufacturing',
  'Trade account',
  'Sample kit',
  'General enquiry',
];

const PARTNERS = [
  {
    num: '01',
    title: 'Interior Designers & Architects',
    body: 'We manufacture to your exact project specification, size, construction, material, and palette, with the precision and lead-time discipline that professional projects demand.',
    bullets: ['Preferential trade pricing', 'Sample dispatch worldwide', 'CAD-ready technical spec sheets', 'Dedicated account management'],
  },
  {
    num: '02',
    title: 'Importers & Distributors',
    body: 'Our production infrastructure supports high-volume, repeat-order supply with full export documentation, private label manufacturing, and consistent quality across every shipment.',
    bullets: ['MOQ from 5 pieces', 'Private label & OEM production', 'Full export documentation', 'Sea & air freight ex Delhi'],
  },
  {
    num: '03',
    title: 'Retailers & Showrooms',
    body: 'We supply curated, commercially ready collections to retail and showroom partners with the exclusivity, reorder reliability, and brand support that serious retail operations require.',
    bullets: ['Regional exclusivity available', 'Consignment for new partners', 'Co-branded trade materials', 'Reorder consistency guaranteed'],
  },
  {
    num: '04',
    title: 'Luxury Carpet Brands',
    body: 'We provide white label manufacturing for established luxury brands requiring a high-calibre Jaipur production partner. Your designs and standards, executed with complete discretion.',
    bullets: ['White label manufacturing', 'Design-to-production handoff', 'NDA & exclusivity arrangements', 'Collection-level consistency'],
  },
];

const PROCESS = [
  { step: '01', title: 'Submit your brief', desc: 'Specifications, quantities, reference materials, or a product requirement.' },
  { step: '02', title: 'Technical review', desc: 'Production options, pricing, and lead times within one business day.' },
  { step: '03', title: 'Sample approval', desc: 'A physical sample dispatched for review and sign-off before production.' },
  { step: '04', title: 'Production', desc: 'Full transparency on timeline with milestone updates and inspection.' },
  { step: '05', title: 'Export & delivery', desc: 'Door-to-door shipping with complete documentation and compliance.' },
];

const MARKETS = ['Europe', 'United Kingdom', 'United States', 'Canada', 'UAE', 'Saudi Arabia', 'Qatar', 'Australia'];

export function TradeContent() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    country: '',
    email: '',
    phone: '',
    designation: '',
    partnerType: '',
    interests: [] as string[],
    requirement: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = (field: string, value: string) => setFormData((p) => ({ ...p, [field]: value }));

  const handleInterestChange = (interest: string) => {
    setFormData((prev) => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
  };

  function validate() {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = 'Required';
    if (!formData.company.trim()) e.company = 'Required';
    if (!formData.country.trim()) e.country = 'Required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Invalid email';
    if (!formData.phone.trim()) e.phone = 'Required';
    if (!formData.designation.trim()) e.designation = 'Required';
    if (!formData.partnerType) e.partnerType = 'Please select one';
    return e;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      document.getElementById('query-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  const scrollToForm = (preselectSampleKit = false) => {
    const el = document.getElementById('query-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      if (preselectSampleKit && !formData.interests.includes('Sample kit')) {
        handleInterestChange('Sample kit');
      }
    }
  };

  const errStyle: React.CSSProperties = {
    color: 'var(--accent)',
    fontSize: '11px',
    marginTop: '8px',
    display: 'block',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
  };

  const inputBorder = (field: string): React.CSSProperties =>
    errors[field] ? { borderBottomColor: 'var(--accent)' } : {};

  return (
    <div className="space-y-24 md:space-y-32">

      {/* 1. Header ───────────────────────────────────────────── */}
      <Reveal>
        <header className="text-center">
          <span className="block text-[11px] tracking-[0.22em] uppercase text-accent mb-6">
            Manufacturing &amp; Trade Partnerships
          </span>
          <h1 className="font-display font-light text-[38px] sm:text-[56px] lg:text-[76px] leading-[1.04] tracking-[-0.03em] text-ink max-w-[14ch] mx-auto">
            Source With Us Or Partner With Carpetstory
          </h1>
          <p className="body-md text-ink-soft font-light max-w-[58ch] mx-auto mt-8 leading-relaxed">
            A great carpet is not made quickly. Neither is a great manufacturing house. Carpetstory
            produces the full spectrum of carpets and rugs from Jaipur — supplying trade professionals
            and luxury brands across more than thirty countries with rigour and discretion.
            We manufacture everything. We compromise on nothing.
          </p>
          <div className="w-12 h-px bg-accent mx-auto mt-10" />
        </header>
      </Reveal>

      {/* 2. Philosophy pillars ───────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-10 lg:gap-x-14">
        {[
          { num: 'I', title: 'Versatility', body: 'From hand-knotted artisan rugs to precision machine-made carpets, we produce every construction and every specification — for designers, importers, luxury brands, and retailers. Whatever your floor demands, we make it.' },
          { num: 'II', title: 'Rigour & Discretion', body: 'Built with patience, to supply the world’s finest interiors. Full export infrastructure, milestone transparency, and the kind of discretion that established luxury houses quietly depend on.' },
          { num: 'III', title: 'Trust', body: 'A full-spectrum carpet manufacturing and export house in Jaipur. We partner with those who demand a manufacturer they never have to question. If that is you, you are in the right place.' },
        ].map((p, i) => (
          <SlideIn key={p.num} direction="u" delay={i * 100}>
            <div>
              <span className="font-display font-light italic text-[24px] text-accent">{p.num} — {p.title}</span>
              <p className="body-md text-ink-soft leading-relaxed font-light mt-4">{p.body}</p>
            </div>
          </SlideIn>
        ))}
      </div>

      {/* 3. Who we partner with ──────────────────────────────── */}
      <section className="space-y-12 md:space-y-16">
        <Reveal>
          <div className="text-center">
            <span className="block text-[11px] tracking-[0.22em] uppercase text-ink-soft mb-4">Collaborators</span>
            <h2 className="font-display font-light text-[32px] md:text-[46px] text-ink tracking-[-0.02em] leading-[1.05]">Who We Partner With</h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {PARTNERS.map((card, i) => (
            <SlideIn key={card.num} direction="u" delay={i % 2 === 0 ? 0 : 100} className="h-full">
              <div className="flex flex-col h-full border border-[rgba(26,24,23,0.1)] p-8 md:p-10 transition-colors duration-500 hover:border-accent">
                <span className="font-display font-light text-accent text-[26px] leading-none mb-5">{card.num}</span>
                <h3 className="text-[17px] font-medium text-ink tracking-[0.01em] mb-3">{card.title}</h3>
                <p className="text-[14px] text-ink-soft font-light leading-relaxed mb-8 flex-1">{card.body}</p>
                <ul className="space-y-2.5 pt-6 border-t border-[rgba(26,24,23,0.08)]">
                  {card.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-[13px] text-ink-soft font-light">
                      <span className="w-1 h-1 bg-accent rounded-full mt-[8px] flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </SlideIn>
          ))}
        </div>
      </section>

      {/* 4. Our process ──────────────────────────────────────── */}
      <section className="space-y-12 md:space-y-16">
        <Reveal>
          <div className="text-center">
            <span className="block text-[11px] tracking-[0.22em] uppercase text-accent mb-4">How We Work</span>
            <h2 className="font-display font-light text-[32px] md:text-[46px] text-ink tracking-[-0.02em] leading-[1.05]">Our Process</h2>
          </div>
        </Reveal>

        <div className="flex flex-col md:flex-row gap-y-10 md:gap-x-7 border-t border-[rgba(26,24,23,0.12)] pt-10 md:pt-12">
          {PROCESS.map((item) => (
            <div key={item.step} className="md:flex-1">
              <span className="font-display font-light text-[34px] text-accent block leading-none mb-4">{item.step}</span>
              <h4 className="text-[14px] font-medium text-ink mb-2 tracking-[0.01em]">{item.title}</h4>
              <p className="text-[13px] text-ink-soft leading-relaxed font-light max-w-[26ch]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Markets we supply ────────────────────────────────── */}
      <SlideIn direction="u">
        <div className="text-center border-y border-[rgba(26,24,23,0.1)] py-14 md:py-16">
          <span className="block text-[10px] tracking-[0.26em] uppercase text-ink-soft mb-5">Global Logistics</span>
          <h3 className="font-display font-light text-[26px] md:text-[34px] text-ink tracking-[-0.02em] mb-7">Markets We Supply</h3>
          <p className="text-[12.5px] md:text-[13.5px] tracking-[0.14em] uppercase text-ink-soft leading-[2] max-w-[60ch] mx-auto">
            {MARKETS.map((m, i) => (
              <span key={m}>
                {m}
                {i < MARKETS.length - 1 && <span className="text-accent mx-2.5" aria-hidden="true">·</span>}
              </span>
            ))}
            <span className="text-accent mx-2.5" aria-hidden="true">·</span>
            <span className="italic lowercase tracking-normal font-display text-[16px] md:text-[18px] text-ink-soft normal-case">and more</span>
          </p>
        </div>
      </SlideIn>

      {/* 6. Submit query form ────────────────────────────────── */}
      <div id="query-form" className="inquiry mb-10 md:mb-10" style={{ padding: 0 }}>
        {submitted ? (
          <div className="inquiry-form" role="status" aria-live="polite" style={{ textAlign: 'center' }}>
            <h2>Received.</h2>
            <p style={{ marginTop: '24px', color: 'var(--ink-soft)' }}>
              Thank you for starting a B2B inquiry. Our trade team in Jaipur will review your
              specifications and contact you within one business day.
            </p>
          </div>
        ) : (
          <form className="inquiry-form" onSubmit={handleSubmit} noValidate>
            <h2>
              Submit <span className="it">Query</span>
            </h2>

            <div className="row-2">
              <div className="field">
                <label htmlFor="name">Full Name *</label>
                <input id="name" type="text" placeholder="e.g. Salim Khan" value={formData.name} onChange={(e) => set('name', e.target.value)} style={inputBorder('name')} />
                {errors.name && <span style={errStyle}>{errors.name}</span>}
              </div>
              <div className="field">
                <label htmlFor="company">Company *</label>
                <input id="company" type="text" placeholder="e.g. Khan Designs" value={formData.company} onChange={(e) => set('company', e.target.value)} style={inputBorder('company')} />
                {errors.company && <span style={errStyle}>{errors.company}</span>}
              </div>
            </div>

            <div className="row-2">
              <div className="field">
                <label htmlFor="designation">Designation *</label>
                <input id="designation" type="text" placeholder="e.g. Lead Designer" value={formData.designation} onChange={(e) => set('designation', e.target.value)} style={inputBorder('designation')} />
                {errors.designation && <span style={errStyle}>{errors.designation}</span>}
              </div>
              <div className="field">
                <label htmlFor="country">Country *</label>
                <input id="country" type="text" placeholder="e.g. United Kingdom" value={formData.country} onChange={(e) => set('country', e.target.value)} style={inputBorder('country')} />
                {errors.country && <span style={errStyle}>{errors.country}</span>}
              </div>
            </div>

            <div className="row-2">
              <div className="field">
                <label htmlFor="email">Email *</label>
                <input id="email" type="email" placeholder="e.g. design@studio.com" value={formData.email} onChange={(e) => set('email', e.target.value)} style={inputBorder('email')} />
                {errors.email && <span style={errStyle}>{errors.email}</span>}
              </div>
              <div className="field">
                <label htmlFor="phone">Phone *</label>
                <input id="phone" type="tel" placeholder="e.g. +44 20 7946 0000" value={formData.phone} onChange={(e) => set('phone', e.target.value)} style={inputBorder('phone')} />
                {errors.phone && <span style={errStyle}>{errors.phone}</span>}
              </div>
            </div>

            {/* I am a… — pill radios */}
            <div className="field">
              <label>I am a… *</label>
              <div className="flex flex-wrap gap-3 pt-2">
                {PARTNER_TYPES.map((opt) => {
                  const isSelected = formData.partnerType === opt;
                  return (
                    <label key={opt} className="cursor-pointer group">
                      <input
                        type="radio"
                        name="partnerType"
                        value={opt}
                        checked={isSelected}
                        onChange={() => set('partnerType', opt)}
                        className="peer sr-only"
                      />
                      <span className={`block px-5 py-2.5 rounded-full text-[13px] font-light transition-all duration-300 border ${
                        isSelected 
                          ? 'bg-accent border-accent text-white' 
                          : 'bg-transparent border-[rgba(26,24,23,0.15)] text-ink-soft group-hover:border-[rgba(26,24,23,0.3)] group-hover:text-ink'
                      }`}>
                        {opt}
                      </span>
                    </label>
                  );
                })}
              </div>
              {errors.partnerType && <span style={errStyle}>{errors.partnerType}</span>}
            </div>

            {/* I am interested in… — pill checkboxes */}
            <div className="field">
              <label>I am interested in…</label>
              <div className="flex flex-wrap gap-3 pt-2">
                {INTERESTS.map((opt) => {
                  const isSelected = formData.interests.includes(opt);
                  return (
                    <label key={opt} className="cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleInterestChange(opt)}
                        className="peer sr-only"
                      />
                      <span className={`block px-5 py-2.5 rounded-full text-[13px] font-light transition-all duration-300 border ${
                        isSelected 
                          ? 'bg-accent border-accent text-white' 
                          : 'bg-transparent border-[rgba(26,24,23,0.15)] text-ink-soft group-hover:border-[rgba(26,24,23,0.3)] group-hover:text-ink'
                      }`}>
                        {opt}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="requirement">Tell us about your requirement</label>
              <textarea
                id="requirement"
                placeholder="Estimated quantities, timelines, sizing, construction…"
                value={formData.requirement}
                onChange={(e) => set('requirement', e.target.value)}
              />
            </div>

            <div className="mt-14 flex justify-center">
              <button className="btn-send magnetic" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending…' : 'Submit Query'}
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
                  <path d="M1 5H15M15 5L11 1M15 5L11 9" stroke="currentColor" strokeWidth="1" />
                </svg>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 7. Sample kit ───────────────────────────────────────── */}
      <SlideIn direction="u">
        <div className="bg-accent text-white flex flex-col lg:flex-row lg:items-stretch">
          <div className="flex-1 p-10 md:p-14 lg:p-16">
            <span className="block text-[11px] tracking-[0.22em] uppercase text-white/55 mb-6">Carpetstory Sample Kit</span>
            <h2 className="font-display font-light text-[30px] md:text-[42px] leading-[1.08] mb-6">
              Not ready to order yet?<br />
              <span className="italic">Start with a sample.</span>
            </h2>
            <p className="text-[14.5px] text-white/80 font-light leading-relaxed max-w-[52ch] mb-8">
              Before you specify, before you order, before you commit — hold the material, feel the
              construction, understand the difference. Our consultant curates the right swatches
              personally, based on your requirement. No image does it justice.
            </p>
            <ul className="space-y-3">
              {[
                'Curated to your brief by a Carpetstory consultant',
                'Shipped to your door worldwide',
                '50% of the kit value redeemable on your first B2B order',
              ].map((b) => (
                <li key={b} className="flex items-start gap-3 text-[13.5px] text-white/85 font-light">
                  <span className="w-1 h-1 bg-white/70 rounded-full mt-[8px] flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:w-[320px] flex-shrink-0 border-t lg:border-t-0 lg:border-l border-white/15 p-10 md:p-12 flex flex-col items-center justify-center text-center gap-7">
            <div>
              <span className="text-[10px] text-white/55 tracking-[0.2em] uppercase block mb-2">Starting from</span>
              <div className="font-display text-[44px] font-light leading-none">$99</div>
            </div>
            <button
              onClick={() => scrollToForm(true)}
              className="w-full px-8 py-4 bg-white text-[#6E1F23] text-[11px] uppercase tracking-[0.18em] font-medium hover:bg-white/85 transition-colors"
            >
              Request Your Sample Kit
            </button>
          </div>
        </div>
      </SlideIn>

    </div>
  );
}
