import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { BrandLogo } from './BrandLogo';

export function Footer() {
  const t = useTranslations('Footer');
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="footer-grid">
        <div>
          <a href="/" className="inline-block" aria-label="Carpetstory">
            <BrandLogo size="lg" className="mb-6" />
          </a>
          <div className="brand-line">{t('tagline')}</div>
        </div>
        <div className="col">
          <h2 className="footer-col-title">{t('explore')}</h2>
          <ul>
            <li>
              <Link href="/collection">{t('exploreCollection')}</Link>
            </li>
            <li>
              <Link href="/trade">{t('exploreTrade')}</Link>
            </li>
            <li>
              <Link href="/about">{t('exploreAbout')}</Link>
            </li>
            <li>
              <Link href="/contact">{t('exploreContact')}</Link>
            </li>
          </ul>
        </div>
        <div className="col">
          <h2 className="footer-col-title">{t('visit')}</h2>
          <ul>
            <li>{t('visitAtelier')}</li>
            <li>{t('visitAppointment')}</li>
            <li>{t('visitPhone')}</li>
          </ul>
        </div>
        <div className="col">
          <h2 className="footer-col-title">{t('follow')}</h2>
          <ul>
            <li>
              <a
                href="https://www.instagram.com/carpetstory"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('followInstagram')}
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/company/carpetstory"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('followLinkedIn')}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-threads" id="footer-threads" aria-hidden="true">
        <div className="thread"></div>
        <div className="thread"></div>
        <div className="thread"></div>
      </div>

      <div className="footer-base">
        <span>{t('copyright', { year })}</span>
        <span>
          {t('privacy')} · {t('terms')}
        </span>
      </div>
    </footer>
  );
}
