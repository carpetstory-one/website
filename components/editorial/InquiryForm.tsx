'use client';

import { useTranslations } from 'next-intl';
import { Reveal } from './Reveal';
import { SlideIn } from './SlideIn';

export function InquiryForm() {
  const t = useTranslations('InquiryForm');

  return (
    <section
      className="bg-ink text-canvas relative z-10 px-6 py-24 sm:px-7 lg:px-12 lg:py-40"
      aria-labelledby="inquiry-form-heading"
    >
      <div className="grid-12">
        <div className="col-span-12 md:col-span-4">
          <Reveal>
            <h2 className="label-text text-canvas/60 mb-8">{t('label')}</h2>
          </Reveal>
          <Reveal>
            <h3
              id="inquiry-form-heading"
              className="font-display text-canvas text-[36px] leading-[1] font-light tracking-[-0.02em] sm:text-[40px] md:text-[56px]"
            >
              {t('headline')}
            </h3>
          </Reveal>
          <SlideIn direction="u" delay={100}>
            <p className="body-sm text-canvas/60 mt-8 max-w-xs">{t('intro')}</p>
          </SlideIn>
        </div>

        <div className="col-span-12 mt-16 md:col-span-7 md:mt-0 lg:col-span-6 lg:col-start-6">
          <form
            className="flex flex-col gap-8"
            id="inquiry-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <SlideIn direction="u" delay={200}>
              <div className="group border-canvas/20 focus-within:border-accent relative border-b transition-colors">
                <label
                  htmlFor="name"
                  className="text-canvas/40 group-focus-within:text-accent absolute top-4 left-0 text-[11px] tracking-[0.16em] uppercase transition-all group-focus-within:-translate-y-6"
                >
                  {t('name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="name"
                  className="font-display text-canvas min-h-[48px] w-full border-none bg-transparent py-4 pt-8 text-[18px] placeholder-transparent focus:ring-0 focus:outline-none sm:text-[20px]"
                  placeholder={t('name')}
                />
              </div>
            </SlideIn>

            <SlideIn direction="u" delay={300}>
              <div className="group border-canvas/20 focus-within:border-accent relative border-b transition-colors">
                <label
                  htmlFor="email"
                  className="text-canvas/40 group-focus-within:text-accent absolute top-4 left-0 text-[11px] tracking-[0.16em] uppercase transition-all group-focus-within:-translate-y-6"
                >
                  {t('email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  inputMode="email"
                  className="font-display text-canvas min-h-[48px] w-full border-none bg-transparent py-4 pt-8 text-[18px] placeholder-transparent focus:ring-0 focus:outline-none sm:text-[20px]"
                  placeholder={t('email')}
                />
              </div>
            </SlideIn>

            <SlideIn direction="u" delay={400}>
              <div className="group border-canvas/20 focus-within:border-accent relative border-b transition-colors">
                <label
                  htmlFor="interest"
                  className="text-canvas/40 group-focus-within:text-accent absolute top-4 left-0 text-[11px] tracking-[0.16em] uppercase transition-all group-focus-within:-translate-y-6"
                >
                  {t('interest')}
                </label>
                <input
                  type="text"
                  id="interest"
                  name="interest"
                  className="font-display text-canvas min-h-[48px] w-full border-none bg-transparent py-4 pt-8 text-[18px] placeholder-transparent focus:ring-0 focus:outline-none sm:text-[20px]"
                  placeholder={t('interestPlaceholder')}
                />
              </div>
            </SlideIn>

            <SlideIn direction="u" delay={500} className="mt-8">
              <button
                type="submit"
                className="text-canvas hover:text-accent group/btn inline-flex min-h-[48px] items-center gap-4 text-[12px] font-medium tracking-[0.16em] uppercase transition-colors"
              >
                <span className="border-canvas/20 group-hover/btn:border-accent flex h-12 w-12 items-center justify-center rounded-full border transition-colors">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform group-hover/btn:translate-x-1"
                    aria-hidden="true"
                  >
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
