'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { SlideIn } from '@/components/editorial/SlideIn';
import { Reveal } from '@/components/editorial/Reveal';

const PARTNER_TYPES = ['designer', 'importer', 'retailer', 'brand', 'other'] as const;

const INTERESTS = ['ready', 'custom', 'whiteLabel', 'account', 'kit', 'general'] as const;

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
    {
      step: '01',
      title: t('step1Title'),
      desc: t('step1Desc'),
    },
    {
      step: '02',
      title: t('step2Title'),
      desc: t('step2Desc'),
    },
    {
      step: '03',
      title: t('step3Title'),
      desc: t('step3Desc'),
    },
    {
      step: '04',
      title: t('step4Title'),
      desc: t('step4Desc'),
    },
    {
      step: '05',
      title: t('step5Title'),
      desc: t('step5Desc'),
    },
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      document
        .getElementById('query-form')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    <div className="space-y-24 md:space-y-32">
      {/* 1. Header ───────────────────────────────────────────── */}
      <Reveal>
        <header className="text-center">
          <span className="text-accent mb-6 block text-[11px] tracking-[0.22em] uppercase">
            {t('eyebrow')}
          </span>
          <h1 className="font-display text-ink mx-auto max-w-[14ch] text-[38px] leading-[1.04] font-light tracking-[-0.03em] sm:text-[56px] lg:text-[76px]">
            {t('title')}
          </h1>
          <p className="body-md text-ink-soft mx-auto mt-8 max-w-[58ch] leading-relaxed font-light">
            {t('intro')}
          </p>
          <div className="bg-accent mx-auto mt-10 h-px w-12" />
        </header>
      </Reveal>

      {/* 2. Philosophy pillars ───────────────────────────────── */}
      <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3 lg:gap-x-14">
        {[
          {
            num: 'I',
            title: t('pillar1Title'),
            body: t('pillar1Body'),
          },
          {
            num: 'II',
            title: t('pillar2Title'),
            body: t('pillar2Body'),
          },
          {
            num: 'III',
            title: t('pillar3Title'),
            body: t('pillar3Body'),
          },
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

      {/* 3. Who we partner with ──────────────────────────────── */}
      <section className="space-y-12 md:space-y-16">
        <Reveal>
          <div className="text-center">
            <span className="text-ink-soft mb-4 block text-[11px] tracking-[0.22em] uppercase">
              {t('collaborators')}
            </span>
            <h2 className="font-display text-ink text-[32px] leading-[1.05] font-light tracking-[-0.02em] md:text-[46px]">
              {t('whoWePartnerWith')}
            </h2>
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

      {/* 4. Our process ──────────────────────────────────────── */}
      <section className="space-y-12 md:space-y-16">
        <Reveal>
          <div className="text-center">
            <span className="text-accent mb-4 block text-[11px] tracking-[0.22em] uppercase">
              {t('howWeWork')}
            </span>
            <h2 className="font-display text-ink text-[32px] leading-[1.05] font-light tracking-[-0.02em] md:text-[46px]">
              {t('ourProcess')}
            </h2>
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

      {/* 5. Markets we supply ────────────────────────────────── */}
      <SlideIn direction="u">
        <div className="overflow-hidden border-y border-[rgba(26,24,23,0.1)] py-14 text-center md:py-16">
          <span className="text-ink-soft mb-5 block text-[10px] tracking-[0.26em] uppercase">
            {t('globalLogistics')}
          </span>
          <h3 className="font-display text-ink mb-12 text-[26px] font-light tracking-[-0.02em] md:text-[34px]">
            {t('marketsWeSupply')}
          </h3>

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
                  <Image
                    src="/Markets We Supply/Group-1.svg"
                    alt="Market"
                    width={100}
                    height={40}
                    className="h-8 w-auto object-contain opacity-80 md:h-12"
                  />
                  <Image
                    src="/Markets We Supply/singapore.svg"
                    alt="Singapore"
                    width={60}
                    height={60}
                    className="h-4 w-auto object-contain opacity-80 md:h-6"
                  />
                  <Image
                    src="/Markets We Supply/Group-2.svg"
                    alt="Market"
                    width={100}
                    height={40}
                    className="h-8 w-auto object-contain opacity-80 md:h-12"
                  />
                  <Image
                    src="/Markets We Supply/germany.svg"
                    alt="Germany"
                    width={60}
                    height={60}
                    className="h-4 w-auto object-contain opacity-80 md:h-6"
                  />
                  <Image
                    src="/Markets We Supply/Group-3.svg"
                    alt="Market"
                    width={100}
                    height={40}
                    className="h-8 w-auto object-contain opacity-80 md:h-12"
                  />
                  <Image
                    src="/Markets We Supply/dubai.svg"
                    alt="Dubai"
                    width={100}
                    height={40}
                    className="h-4 w-auto object-contain opacity-80 md:h-6"
                  />
                  <Image
                    src="/Markets We Supply/Group-4.svg"
                    alt="Market"
                    width={100}
                    height={40}
                    className="h-8 w-auto object-contain opacity-80 md:h-12"
                  />
                  <Image
                    src="/Markets We Supply/turkey.svg"
                    alt="Turkey"
                    width={100}
                    height={40}
                    className="h-4 w-auto object-contain opacity-80 md:h-6"
                  />
                  <Image
                    src="/Markets We Supply/Group.svg"
                    alt="Market"
                    width={100}
                    height={40}
                    className="h-8 w-auto object-contain opacity-80 md:h-12"
                  />
                  <Image
                    src="/Markets We Supply/USA.svg"
                    alt="USA"
                    width={100}
                    height={40}
                    className="h-4 w-auto object-contain opacity-80 md:h-6"
                  />
                  <Image
                    src="/Markets We Supply/Vector.svg"
                    alt="Market"
                    width={100}
                    height={40}
                    className="h-8 w-auto object-contain opacity-80 md:h-12"
                  />
                  <Image
                    src="/Markets We Supply/canada.svg"
                    alt="Canada"
                    width={100}
                    height={40}
                    className="h-4 w-auto object-contain opacity-80 md:h-6"
                  />
                  <Image
                    src="/Markets We Supply/moscow.svg"
                    alt="Moscow"
                    width={100}
                    height={40}
                    className="h-8 w-auto object-contain opacity-80 md:h-12"
                  />
                  <Image
                    src="/Markets We Supply/russia.svg"
                    alt="Russia"
                    width={100}
                    height={40}
                    className="h-4 w-auto object-contain opacity-80 md:h-6"
                  />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </SlideIn>

      {/* 6. Submit query form ────────────────────────────────── */}
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
              <span className="it">{t('submitQuery').split(' ')[1]}</span>
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
              <label htmlFor="requirement">
                {t('requirement')}
              </label>
              <textarea
                id="requirement"
                placeholder={t('requirementPlaceholder')}
                value={formData.requirement}
                onChange={(e) => set('requirement', e.target.value)}
              />
            </div>

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

      {/* 7. Sample kit ───────────────────────────────────────── */}
      <SlideIn direction="u">
        <div className="bg-accent flex flex-col text-white lg:flex-row lg:items-stretch">
          <div className="flex-1 p-10 md:p-14 lg:p-16">
            <span className="mb-6 block text-[11px] tracking-[0.22em] text-white/55 uppercase">
              {t('sampleKitDesc').split(' — ')[0] || t('eyebrow')}
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
