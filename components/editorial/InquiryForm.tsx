'use client';

import { useTranslations } from 'next-intl';
import { Reveal } from './Reveal';
import { SlideIn } from './SlideIn';

export function InquiryForm() {
  const t = useTranslations('InquiryForm');

  return (
    <section className="py-24 lg:py-40 px-6 sm:px-7 lg:px-12 bg-ink text-canvas relative z-10" aria-labelledby="inquiry-form-heading">
      <div className="grid-12">
        <div className="col-span-12 md:col-span-4">
          <Reveal>
            <h2 className="label-text text-canvas/60 mb-8">{t('label')}</h2>
          </Reveal>
          <Reveal>
            <h3 id="inquiry-form-heading" className="font-display text-[36px] sm:text-[40px] md:text-[56px] leading-[1] tracking-[-0.02em] font-light text-canvas">
              {t('headline')}
            </h3>
          </Reveal>
          <SlideIn direction="u" delay={100}>
            <p className="body-sm text-canvas/60 mt-8 max-w-xs">
              {t('intro')}
            </p>
          </SlideIn>
        </div>

        <div className="col-span-12 md:col-span-7 lg:col-span-6 lg:col-start-6 mt-16 md:mt-0">
          <form
            className="flex flex-col gap-8"
            id="inquiry-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <SlideIn direction="u" delay={200}>
              <div className="group border-b border-canvas/20 focus-within:border-accent transition-colors relative">
                <label
                  htmlFor="name"
                  className="absolute top-4 left-0 text-[11px] tracking-[0.16em] uppercase text-canvas/40 transition-all group-focus-within:-translate-y-6 group-focus-within:text-accent"
                >
                  {t('name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="name"
                  className="w-full bg-transparent border-none py-4 pt-8 text-[18px] sm:text-[20px] font-display text-canvas focus:outline-none focus:ring-0 placeholder-transparent min-h-[48px]"
                  placeholder={t('name')}
                />
              </div>
            </SlideIn>

            <SlideIn direction="u" delay={300}>
              <div className="group border-b border-canvas/20 focus-within:border-accent transition-colors relative">
                <label
                  htmlFor="email"
                  className="absolute top-4 left-0 text-[11px] tracking-[0.16em] uppercase text-canvas/40 transition-all group-focus-within:-translate-y-6 group-focus-within:text-accent"
                >
                  {t('email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  className="w-full bg-transparent border-none py-4 pt-8 text-[18px] sm:text-[20px] font-display text-canvas focus:outline-none focus:ring-0 placeholder-transparent min-h-[48px]"
                  placeholder={t('email')}
                />
              </div>
            </SlideIn>

            <SlideIn direction="u" delay={400}>
              <div className="group border-b border-canvas/20 focus-within:border-accent transition-colors relative">
                <label
                  htmlFor="interest"
                  className="absolute top-4 left-0 text-[11px] tracking-[0.16em] uppercase text-canvas/40 transition-all group-focus-within:-translate-y-6 group-focus-within:text-accent"
                >
                  {t('interest')}
                </label>
                <input
                  type="text"
                  id="interest"
                  name="interest"
                  className="w-full bg-transparent border-none py-4 pt-8 text-[18px] sm:text-[20px] font-display text-canvas focus:outline-none focus:ring-0 placeholder-transparent min-h-[48px]"
                  placeholder={t('interestPlaceholder')}
                />
              </div>
            </SlideIn>

            <SlideIn direction="u" delay={500} className="mt-8">
              <button
                type="submit"
                className="inline-flex items-center gap-4 text-[12px] uppercase tracking-[0.16em] font-medium text-canvas hover:text-accent transition-colors group/btn min-h-[48px]"
              >
                <span className="w-12 h-12 rounded-full border border-canvas/20 flex items-center justify-center group-hover/btn:border-accent transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:translate-x-1 transition-transform" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </span>
                {t('submit')}
              </button>
            </SlideIn>
          </form>
        </div>
      </div>
    </section>
  );
}
