import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'fr', 'de'],
  defaultLocale: 'en',
  localeDetection: false
});

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);

export const localeLabels: Record<(typeof routing.locales)[number], string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch'
};

export const localeCountries: Record<(typeof routing.locales)[number], string[]> = {
  de: ['DE', 'AT', 'LI'],
  fr: ['FR', 'BE', 'LU', 'MC'],
  en: []
};
