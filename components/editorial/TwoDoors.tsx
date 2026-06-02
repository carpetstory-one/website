import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { SlideIn } from './SlideIn';
import { MessageCircle } from 'lucide-react';

export function TwoDoors() {
  const t = useTranslations('TwoDoors');

  return (
    <section
      aria-label={t('tradeHeadline')}
      className="border-ink-faint relative z-10 flex h-auto min-h-[600px] flex-col border-b py-0 md:h-screen md:flex-row"
    >
      <div className="border-ink-faint bg-canvas group flex w-full flex-col justify-center border-b p-8 md:w-1/2 md:border-r md:border-b-0 md:p-12 lg:p-24">
        <SlideIn direction="u" delay={100}>
          <h2 className="font-display text-ink mb-6 text-[28px] leading-[1.1] font-light tracking-[-0.02em] sm:text-[32px] md:text-[48px]">
            {t('tradeHeadline')}
          </h2>
          <p className="body-md text-ink-soft mb-12 max-w-sm">
            {t('tradeBody')}
          </p>
          <Link
            href="/trade"
            className="text-accent hover:text-accent-soft inline-flex min-h-[44px] items-center gap-2 text-[12px] font-medium tracking-[0.16em] uppercase transition-colors"
          >
            {t('tradeCta')}
            <span className="h-[1px] w-6 bg-current transition-all group-hover:w-10" />
          </Link>
        </SlideIn>
      </div>

      <div className="bg-canvas-warm group flex w-full flex-col justify-center p-8 md:w-1/2 md:p-12 lg:p-24">
        <SlideIn direction="u" delay={200}>
          <h2 className="font-display text-ink mb-6 text-[28px] leading-[1.1] font-light tracking-[-0.02em] sm:text-[32px] md:text-[48px]">
            {t('commissionHeadline')}
          </h2>
          <p className="body-md text-ink-soft mb-12 max-w-sm">
            {t('commissionBody')}
          </p>
          <a
            href="https://wa.me/919602492022"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-soft inline-flex min-h-[44px] items-center gap-2 text-[12px] font-medium tracking-[0.16em] uppercase transition-colors"
          >
            <MessageCircle className="h-4 w-4 fill-current" />
            {t('commissionCta')}
          </a>
        </SlideIn>
      </div>
    </section>
  );
}
