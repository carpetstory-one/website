'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { SlideIn } from '@/components/editorial/SlideIn';
import { Reveal } from '@/components/editorial/Reveal';
import { PARTNER_TYPES, INTERESTS } from '@/lib/schemas/trade';
import { submitTradeInquiry } from '@/app/actions/trade';

const WHATSAPP_NUMBER = '919602492022';

/* Section heading sizes follow the editorial.css header scale
   (clamp(40px, 4.5vw, 64px) for section h2s, one step down here). */
const H2_CLASS =
  'font-display text-ink text-[length:clamp(34px,4.5vw,56px)] leading-[1.05] font-light tracking-[-0.02em]';

export function TradeContent() {
  const t = useTranslations('TradePage');

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
  const [submitError, setSubmitError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = (field: string, value: string) =>
    setFormData((p) => ({ ...p, [field]: value }));

  const handleInterestChange = (interest: string) => {
    setFormData((prev) => {
      const interests = prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests };
    });
  };

  const stats = [
    { value: t('stat1Value'), label: t('stat1Label') },
    { value: t('stat2Value'), label: t('stat2Label') },
    { value: t('stat3Value'), label: t('stat3Label') },
    { value: t('stat4Value'), label: t('stat4Label') },
  ];

  const partners = [
    {
      num: '01',
      title: t('partner1Title'),
      body: t('partner1Body'),
      bullets: [
        t('partner1Bullet1'),
        t('partner1Bullet2'),
        t('partner1Bullet3'),
        t('partner1Bullet4'),
      ],
    },
    {
      num: '02',
      title: t('partner2Title'),
      body: t('partner2Body'),
      bullets: [
        t('partner2Bullet1'),
        t('partner2Bullet2'),
        t('partner2Bullet3'),
        t('partner2Bullet4'),
      ],
    },
    {
      num: '03',
      title: t('partner3Title'),
      body: t('partner3Body'),
      bullets: [
        t('partner3Bullet1'),
        t('partner3Bullet2'),
        t('partner3Bullet3'),
        t('partner3Bullet4'),
      ],
    },
    {
      num: '04',
      title: t('partner4Title'),
      body: t('partner4Body'),
      bullets: [
        t('partner4Bullet1'),
        t('partner4Bullet2'),
        t('partner4Bullet3'),
        t('partner4Bullet4'),
      ],
    },
  ];

  const processSteps = [
    { step: '01', title: t('step1Title'), desc: t('step1Desc') },
    { step: '02', title: t('step2Title'), desc: t('step2Desc') },
    { step: '03', title: t('step3Title'), desc: t('step3Desc') },
    { step: '04', title: t('step4Title'), desc: t('step4Desc') },
    { step: '05', title: t('step5Title'), desc: t('step5Desc') },
  ];

  const faqs = [1, 2, 3, 4, 5, 6].map((i) => ({
    q: t(`faq${i}q`),
    a: t(`faq${i}a`),
  }));

  /* Skyline + flag pairs for the markets marquee. Paths must match the
     on-disk filename case exactly — the production host is case-sensitive. */
  const markets = [
    { skyline: '/Markets We Supply/Group-1.svg', flag: '/Markets We Supply/SINGAPORE.svg', name: 'Singapore' },
    { skyline: '/Markets We Supply/Group-2.svg', flag: '/Markets We Supply/GERMANY.svg', name: 'Germany' },
    { skyline: '/Markets We Supply/Group-3.svg', flag: '/Markets We Supply/DUBAI.svg', name: 'Dubai' },
    { skyline: '/Markets We Supply/Group-4.svg', flag: '/Markets We Supply/TURKEY.svg', name: 'Turkey' },
    { skyline: '/Markets We Supply/Group.svg', flag: '/Markets We Supply/USA.svg', name: 'USA' },
    { skyline: '/Markets We Supply/Vector.svg', flag: '/Markets We Supply/CANADA.svg', name: 'Canada' },
    { skyline: '/Markets We Supply/moscow.svg', flag: '/Markets We Supply/RUSSIA.svg', name: 'Russia' },
  ];

  function validate() {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = t('errorRequired');
    if (!formData.company.trim()) e.company = t('errorRequired');
    if (!formData.country.trim()) e.country = t('errorRequired');
    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    )
      e.email = t('errorEmail');
    if (!formData.phone.trim()) e.phone = t('errorRequired');
    if (!formData.designation.trim()) e.designation = t('errorRequired');
    if (!formData.partnerType) e.partnerType = t('errorSelectOne');
    return e;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setSubmitError(false);
    if (Object.keys(errs).length > 0) {
      document
        .getElementById('query-form')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.set('name', formData.name);
      fd.set('company', formData.company);
      fd.set('designation', formData.designation);
      fd.set('country', formData.country);
      fd.set('email', formData.email);
      fd.set('phone', formData.phone);
      fd.set('partnerType', formData.partnerType);
      formData.interests.forEach((i) => fd.append('interests', i));
      fd.set('requirement', formData.requirement);

      const result = await submitTradeInquiry(fd);
      if (result.success) {
        setSubmitted(true);
      } else {
        setSubmitError(true);
      }
    } catch {
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = (preselectSampleKit = false) => {
    const el = document.getElementById('query-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      if (preselectSampleKit && !formData.interests.includes('kit')) {
        handleInterestChange('kit');
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
    <div className="space-y-section">
      {/* 1. Header ───────────────────────────────────────────── */}
      <Reveal>
        <header className="text-center">
          <span className="label text-accent mb-6 block">{t('eyebrow')}</span>
          <h1 className="font-display text-ink mx-auto max-w-[14ch] text-[40px] leading-[1.04] font-light tracking-[-0.03em] sm:text-[56px] md:text-[80px]">
            {t('title')}
          </h1>
          <p className="body-md text-ink-soft mx-auto mt-8 max-w-[58ch] leading-relaxed font-light">
            {t('intro')}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => scrollToForm()}
              className="bg-accent inline-flex min-h-[48px] items-center px-9 py-4 text-[11px] font-medium tracking-[0.18em] text-white uppercase transition-colors duration-300 hover:bg-[var(--accent-soft)]"
            >
              {t('ctaStart')}
            </button>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('whatsappPrefill'))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border-ink text-ink hover:bg-ink inline-flex min-h-[48px] items-center gap-2 border px-9 py-4 text-[11px] tracking-[0.18em] uppercase transition-colors duration-300 hover:text-white"
            >
              {t('ctaWhatsApp')}
            </a>
          </div>
        </header>
      </Reveal>

      {/* 2. Credibility strip ────────────────────────────────── */}
      <Reveal>
        <div className="border-y border-[rgba(26,24,23,0.1)] py-10 md:py-14">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 text-center md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-accent text-[38px] leading-none font-light italic md:text-[48px]">
                  {s.value}
                </div>
                <div className="text-ink-soft mx-auto mt-3 max-w-[20ch] text-[11px] tracking-[0.16em] uppercase">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* 3. Philosophy pillars ───────────────────────────────── */}
      <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3 lg:gap-x-14">
        {[
          { num: 'I', title: t('pillar1Title'), body: t('pillar1Body') },
          { num: 'II', title: t('pillar2Title'), body: t('pillar2Body') },
          { num: 'III', title: t('pillar3Title'), body: t('pillar3Body') },
        ].map((p, i) => (
          <SlideIn key={p.num} direction="u" delay={i * 100}>
            <div>
              <span className="font-display text-accent text-[24px] font-light italic">
                {p.num} — {p.title}
              </span>
              <p className="body-md text-ink-soft mt-4 leading-relaxed font-light">
                {p.body}
              </p>
            </div>
          </SlideIn>
        ))}
      </div>

      {/* 4. Who we partner with ──────────────────────────────── */}
      <section className="space-y-12 md:space-y-16">
        <Reveal>
          <div className="text-center">
            <span className="label text-ink-soft mb-4 block">
              {t('collaborators')}
            </span>
            <h2 className={H2_CLASS}>{t('whoWePartnerWith')}</h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          {partners.map((card, i) => (
            <SlideIn
              key={card.num}
              direction="u"
              delay={i % 2 === 0 ? 0 : 100}
              className="h-full"
            >
              <div className="hover:border-accent flex h-full flex-col border border-[rgba(26,24,23,0.1)] p-8 transition-colors duration-500 md:p-10">
                <span className="font-display text-accent mb-5 text-[26px] leading-none font-light">
                  {card.num}
                </span>
                <h3 className="text-ink mb-3 text-[17px] font-medium tracking-[0.01em]">
                  {card.title}
                </h3>
                <p className="text-ink-soft mb-8 flex-1 text-[14px] leading-relaxed font-light">
                  {card.body}
                </p>
                <ul className="space-y-2.5 border-t border-[rgba(26,24,23,0.08)] pt-6">
                  {card.bullets.map((b) => (
                    <li
                      key={b}
                      className="text-ink-soft flex items-start gap-3 text-[13px] font-light"
                    >
                      <span className="bg-accent mt-[8px] h-1 w-1 flex-shrink-0 rounded-full" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </SlideIn>
          ))}
        </div>
      </section>

      {/* 5. Our process ──────────────────────────────────────── */}
      <section className="space-y-12 md:space-y-16">
        <Reveal>
          <div className="text-center">
            <span className="label text-accent mb-4 block">
              {t('howWeWork')}
            </span>
            <h2 className={H2_CLASS}>{t('ourProcess')}</h2>
          </div>
        </Reveal>

        <div className="process-container border-t border-[rgba(26,24,23,0.12)] pt-10 md:pt-12">
          {processSteps.map((item) => (
            <div key={item.step} className="process-item">
              <span className="font-display text-accent mb-4 block text-[34px] leading-none font-light">
                {item.step}
              </span>
              <h4 className="text-ink mb-2 text-[14px] font-medium tracking-[0.01em]">
                {item.title}
              </h4>
              <p className="text-ink-soft max-w-[26ch] text-[13px] leading-relaxed font-light">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Markets we supply ────────────────────────────────── */}
      <SlideIn direction="u">
        <div className="overflow-hidden border-y border-[rgba(26,24,23,0.1)] py-14 text-center md:py-16">
          <span className="label text-ink-soft mb-5 block">
            {t('globalLogistics')}
          </span>
          <h3 className="font-display text-ink mb-5 text-[length:clamp(26px,3vw,36px)] font-light tracking-[-0.02em]">
            {t('marketsWeSupply')}
          </h3>
          <p className="text-ink-soft mx-auto mb-12 max-w-[62ch] px-4 text-[14px] leading-relaxed font-light">
            {t('marketsNote')}
          </p>

          <style>{`
            @keyframes marquee-markets {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .marquee-markets-container {
              display: flex;
              width: max-content;
              animation: marquee-markets 40s linear infinite;
            }
            .marquee-markets-container:hover {
              animation-play-state: paused;
            }
          `}</style>
          <div
            className="relative w-full overflow-hidden"
            style={{
              maskImage:
                'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            }}
          >
            <div className="marquee-markets-container flex items-center gap-12 px-6 md:gap-24">
              {[...Array(2)].map((_, i) => (
                <React.Fragment key={i}>
                  {markets.map((m) => (
                    <React.Fragment key={`${i}-${m.name}`}>
                      <Image
                        src={m.skyline}
                        alt=""
                        width={100}
                        height={40}
                        className="h-8 w-auto object-contain opacity-80 md:h-12"
                      />
                      <Image
                        src={m.flag}
                        alt={m.name}
                        width={60}
                        height={60}
                        className="h-4 w-auto object-contain opacity-80 md:h-6"
                      />
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </SlideIn>

      {/* 7. FAQ ──────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-[820px]">
        <Reveal>
          <div className="mb-12 text-center md:mb-14">
            <span className="label text-ink-soft mb-4 block">
              {t('faqEyebrow')}
            </span>
            <h2 className={H2_CLASS}>{t('faqTitle')}</h2>
          </div>
        </Reveal>

        <div className="border-t border-[rgba(26,24,23,0.1)]">
          {faqs.map((f, i) => (
            <SlideIn key={f.q} direction="u" delay={Math.min(i * 60, 240)}>
              <div className="grid grid-cols-1 gap-3 border-b border-[rgba(26,24,23,0.1)] py-7 md:grid-cols-[1fr_1.6fr] md:gap-10 md:py-8">
                <h3 className="text-ink text-[15px] leading-snug font-medium tracking-[0.01em]">
                  {f.q}
                </h3>
                <p className="text-ink-soft text-[14px] leading-relaxed font-light">
                  {f.a}
                </p>
              </div>
            </SlideIn>
          ))}
        </div>
      </section>

      {/* 8. Submit query form ────────────────────────────────── */}
      <div
        id="query-form"
        className="inquiry mb-10 md:mb-10"
        style={{ padding: 0 }}
      >
        {submitted ? (
          <div
            className="inquiry-form"
            role="status"
            aria-live="polite"
            style={{ textAlign: 'center' }}
          >
            <h2>{t('received')}</h2>
            <p style={{ marginTop: '24px', color: 'var(--ink-soft)' }}>
              {t('successMessage')}
            </p>
          </div>
        ) : (
          <form className="inquiry-form" onSubmit={handleSubmit} noValidate>
            <h2>
              {t('submitQuery').split(' ')[0]}{' '}
              <span className="it">
                {t('submitQuery').split(' ').slice(1).join(' ')}
              </span>
            </h2>

            <div className="row-2">
              <div className="field">
                <label htmlFor="name">{t('fullName')}</label>
                <input
                  id="name"
                  type="text"
                  placeholder={t('fullNamePlaceholder')}
                  value={formData.name}
                  onChange={(e) => set('name', e.target.value)}
                  style={inputBorder('name')}
                />
                {errors.name && <span style={errStyle}>{errors.name}</span>}
              </div>
              <div className="field">
                <label htmlFor="company">{t('company')}</label>
                <input
                  id="company"
                  type="text"
                  placeholder={t('companyPlaceholder')}
                  value={formData.company}
                  onChange={(e) => set('company', e.target.value)}
                  style={inputBorder('company')}
                />
                {errors.company && (
                  <span style={errStyle}>{errors.company}</span>
                )}
              </div>
            </div>

            <div className="row-2">
              <div className="field">
                <label htmlFor="designation">{t('designation')}</label>
                <input
                  id="designation"
                  type="text"
                  placeholder={t('designationPlaceholder')}
                  value={formData.designation}
                  onChange={(e) => set('designation', e.target.value)}
                  style={inputBorder('designation')}
                />
                {errors.designation && (
                  <span style={errStyle}>{errors.designation}</span>
                )}
              </div>
              <div className="field">
                <label htmlFor="country">{t('country')}</label>
                <input
                  id="country"
                  type="text"
                  placeholder={t('countryPlaceholder')}
                  value={formData.country}
                  onChange={(e) => set('country', e.target.value)}
                  style={inputBorder('country')}
                />
                {errors.country && (
                  <span style={errStyle}>{errors.country}</span>
                )}
              </div>
            </div>

            <div className="row-2">
              <div className="field">
                <label htmlFor="email">{t('email')}</label>
                <input
                  id="email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  value={formData.email}
                  onChange={(e) => set('email', e.target.value)}
                  style={inputBorder('email')}
                />
                {errors.email && <span style={errStyle}>{errors.email}</span>}
              </div>
              <div className="field">
                <label htmlFor="phone">{t('phone')}</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder={t('phonePlaceholder')}
                  value={formData.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  style={inputBorder('phone')}
                />
                {errors.phone && <span style={errStyle}>{errors.phone}</span>}
              </div>
            </div>

            {/* I am a… — pill radios */}
            <div className="field">
              <label>{t('iAmA')}</label>
              <div className="flex flex-wrap gap-3 pt-2">
                {PARTNER_TYPES.map((opt) => {
                  const isSelected = formData.partnerType === opt;
                  return (
                    <label key={opt} className="group cursor-pointer">
                      <input
                        type="radio"
                        name="partnerType"
                        value={opt}
                        checked={isSelected}
                        onChange={() => set('partnerType', opt)}
                        className="peer sr-only"
                      />
                      <span
                        className={`block rounded-full border px-5 py-2.5 text-[13px] font-light transition-all duration-300 ${
                          isSelected
                            ? 'bg-accent border-accent text-white'
                            : 'text-ink-soft group-hover:text-ink border-[rgba(26,24,23,0.15)] bg-transparent group-hover:border-[rgba(26,24,23,0.3)]'
                        }`}
                      >
                        {t(`partnerTypes.${opt}`)}
                      </span>
                    </label>
                  );
                })}
              </div>
              {errors.partnerType && (
                <span style={errStyle}>{errors.partnerType}</span>
              )}
            </div>

            {/* I am interested in… — pill checkboxes */}
            <div className="field">
              <label>{t('iAmInterestedIn')}</label>
              <div className="flex flex-wrap gap-3 pt-2">
                {INTERESTS.map((opt) => {
                  const isSelected = formData.interests.includes(opt);
                  return (
                    <label key={opt} className="group cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleInterestChange(opt)}
                        className="peer sr-only"
                      />
                      <span
                        className={`block rounded-full border px-5 py-2.5 text-[13px] font-light transition-all duration-300 ${
                          isSelected
                            ? 'bg-accent border-accent text-white'
                            : 'text-ink-soft group-hover:text-ink border-[rgba(26,24,23,0.15)] bg-transparent group-hover:border-[rgba(26,24,23,0.3)]'
                        }`}
                      >
                        {t(`interests.${opt}`)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="requirement">{t('requirement')}</label>
              <textarea
                id="requirement"
                placeholder={t('requirementPlaceholder')}
                value={formData.requirement}
                onChange={(e) => set('requirement', e.target.value)}
              />
            </div>

            {submitError && (
              <p
                role="alert"
                className="text-accent mt-8 text-center text-[13px] leading-relaxed"
              >
                {t('errorSubmit')}
              </p>
            )}

            <div className="mt-14 flex justify-center">
              <button
                className="btn-send magnetic"
                type="submit"
                disabled={isSubmitting}
                suppressHydrationWarning
              >
                {isSubmitting ? t('sending') : t('submitQuery')}
                <svg
                  width="16"
                  height="10"
                  viewBox="0 0 16 10"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M1 5H15M15 5L11 1M15 5L11 9"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </svg>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 9. Sample kit ───────────────────────────────────────── */}
      <SlideIn direction="u">
        <div className="bg-accent flex flex-col text-white lg:flex-row lg:items-stretch">
          <div className="flex-1 p-10 md:p-14 lg:p-16">
            <span className="label mb-6 block text-white/55">
              {t('sampleKitEyebrow')}
            </span>
            <h2 className="font-display mb-6 text-[30px] leading-[1.08] font-light md:text-[42px]">
              {t('notReady')}
              <br />
              <span className="italic">{t('startWithSample')}</span>
            </h2>
            <p className="mb-8 max-w-[52ch] text-[14.5px] leading-relaxed font-light text-white/80">
              {t('sampleKitDesc')}
            </p>
            <ul className="space-y-3">
              {[
                t('sampleKitBullet1'),
                t('sampleKitBullet2'),
                t('sampleKitBullet3'),
              ].map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-3 text-[13.5px] font-light text-white/85"
                >
                  <span className="mt-[8px] h-1 w-1 flex-shrink-0 rounded-full bg-white/70" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-shrink-0 flex-col items-center justify-center gap-7 border-t border-white/15 p-10 text-center md:p-12 lg:w-[320px] lg:border-t-0 lg:border-l">
            <div>
              <span className="mb-2 block text-[10px] tracking-[0.2em] text-white/55 uppercase">
                {t('startingFrom')}
              </span>
              <div className="font-display text-[44px] leading-none font-light">
                $99
              </div>
            </div>
            <button
              onClick={() => scrollToForm(true)}
              className="w-full bg-white px-8 py-4 text-[11px] font-medium tracking-[0.18em] text-[#6E1F23] uppercase transition-colors hover:bg-white/85"
            >
              {t('requestSampleKit')}
            </button>
          </div>
        </div>
      </SlideIn>
    </div>
  );
}
