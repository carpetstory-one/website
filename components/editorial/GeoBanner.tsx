import { headers } from 'next/headers';
import { routing, localeCountries } from '@/i18n/routing';
import { GeoBannerClient } from './GeoBannerClient';

type Locale = (typeof routing.locales)[number];

const COUNTRY_NAMES: Record<string, Record<Locale, string>> = {
  DE: { en: 'Germany', fr: 'Allemagne', de: 'Deutschland' },
  AT: { en: 'Austria', fr: 'Autriche', de: 'Österreich' },
  LI: { en: 'Liechtenstein', fr: 'Liechtenstein', de: 'Liechtenstein' },
  FR: { en: 'France', fr: 'France', de: 'Frankreich' },
  BE: { en: 'Belgium', fr: 'Belgique', de: 'Belgien' },
  LU: { en: 'Luxembourg', fr: 'Luxembourg', de: 'Luxemburg' },
  MC: { en: 'Monaco', fr: 'Monaco', de: 'Monaco' },
};

export async function GeoBanner({ locale }: { locale: string }) {
  const hdrs = await headers();
  const country = (
    hdrs.get('x-user-country') ||
    hdrs.get('x-vercel-ip-country') ||
    hdrs.get('cf-ipcountry') ||
    ''
  ).toUpperCase();

  if (!country) return null;

  // Find which locale this country prefers (if any), and skip if already on it.
  const preferredLocale = (
    Object.entries(localeCountries) as Array<[Locale, string[]]>
  ).find(([, countries]) => countries.includes(country))?.[0];

  if (!preferredLocale || preferredLocale === locale) return null;

  const countryName = COUNTRY_NAMES[country]?.[locale as Locale] || country;

  return (
    <GeoBannerClient
      suggestedLocale={preferredLocale}
      countryName={countryName}
    />
  );
}
