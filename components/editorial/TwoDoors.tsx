import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { SlideIn } from './SlideIn';
import { MessageCircle } from 'lucide-react';

export function TwoDoors() {
  const t = useTranslations('TwoDoors');

  return (
    <section
      aria-label={t('tradeHeadline')}
      className="py-0 flex flex-col md:flex-row h-auto md:h-screen min-h-[600px] relative z-10 border-b border-ink-faint"
    >
      <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-24 flex flex-col justify-center border-b md:border-b-0 md:border-r border-ink-faint bg-canvas group">
        <SlideIn direction="u" delay={100}>
          <h2 className="font-display text-[28px] sm:text-[32px] md:text-[48px] leading-[1.1] tracking-[-0.02em] font-light text-ink mb-6">
            {t('tradeHeadline')}
          </h2>
          <p className="body-md text-ink-soft mb-12 max-w-sm">
            {t('tradeBody')}
          </p>
          <Link
            href="/trade"
            className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] font-medium text-accent hover:text-accent-soft transition-colors min-h-[44px]"
          >
            {t('tradeCta')}
            <span className="w-6 h-[1px] bg-current transition-all group-hover:w-10" />
          </Link>
        </SlideIn>
      </div>

      <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-24 flex flex-col justify-center bg-canvas-warm group">
        <SlideIn direction="u" delay={200}>
          <h2 className="font-display text-[28px] sm:text-[32px] md:text-[48px] leading-[1.1] tracking-[-0.02em] font-light text-ink mb-6">
            {t('commissionHeadline')}
          </h2>
          <p className="body-md text-ink-soft mb-12 max-w-sm">
            {t('commissionBody')}
          </p>
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.16em] font-medium text-accent hover:text-accent-soft transition-colors min-h-[44px]"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            {t('commissionCta')}
          </a>
        </SlideIn>
      </div>
    </section>
  );
}
