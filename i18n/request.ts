import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    formats: {
      dateTime: {
        short: {day: 'numeric', month: 'short', year: 'numeric'},
        long: {day: 'numeric', month: 'long', year: 'numeric'}
      },
      number: {
        usd: {style: 'currency', currency: 'USD', maximumFractionDigits: 0},
        eur: {style: 'currency', currency: 'EUR', maximumFractionDigits: 0}
      }
    }
  };
});
