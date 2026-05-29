'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { collections } from '@/lib/collections';

type Errors = { name?: string; email?: string; message?: string };

export function Inquiry() {
  const t = useTranslations('Inquiry');
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  // Prefill from query params (set when coming from a rug page)
  const prefillMessage = searchParams?.get('message') ?? '';
  const prefillCollection = searchParams?.get('collection') ?? '';

  const [messageValue, setMessageValue] = useState(prefillMessage);
  const [collectionValue, setCollectionValue] = useState(prefillCollection);

  useEffect(() => {
    if (prefillMessage) setMessageValue(decodeURIComponent(prefillMessage));
    if (prefillCollection) setCollectionValue(decodeURIComponent(prefillCollection));
  }, [prefillMessage, prefillCollection]);

  function validate(form: HTMLFormElement): Errors {
    const data = new FormData(form);
    const name = (data.get('name') as string)?.trim();
    const email = (data.get('email') as string)?.trim();
    const message = (data.get('message') as string)?.trim();
    const errs: Errors = {};
    if (!name) errs.name = 'Please enter your name.';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Please enter a valid email address.';
    if (!message) errs.message = 'Please tell us about your space.';
    return errs;
  }

  const errorStyle: React.CSSProperties = { color: 'var(--accent)', fontSize: '12px', marginTop: '4px', display: 'block' };

  return (
    <section className="inquiry" id="inquiry" aria-labelledby="inquiry-heading">
      {submitted ? (
        <div className="inquiry-form" role="status" aria-live="polite" style={{ textAlign: 'center' }}>
          <h2 id="inquiry-heading">{t('successTitle')}</h2>
          <p style={{ marginTop: '24px', color: 'var(--ink-soft)' }}>{t('successBody')}</p>
        </div>
      ) : (
        <form
          className="inquiry-form"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            const errs = validate(e.currentTarget);
            setErrors(errs);
            if (Object.keys(errs).length === 0) setSubmitted(true);
          }}
        >
          <h2 id="inquiry-heading">
            {t('headlineStart')} <span className="it">{t('headlineItalic')}</span>
          </h2>

          <div className="row-2">
            <div className="field">
              <label htmlFor="inquiry-name">{t('name')}</label>
              <input
                id="inquiry-name"
                name="name"
                type="text"
                placeholder={t('namePlaceholder')}
                autoComplete="name"
                aria-required="true"
                aria-describedby={errors.name ? 'inquiry-name-error' : undefined}
                style={errors.name ? { borderBottomColor: 'var(--accent)' } : undefined}
              />
              {errors.name && <span id="inquiry-name-error" role="alert" style={errorStyle}>{errors.name}</span>}
            </div>
            <div className="field">
              <label htmlFor="inquiry-email">{t('email')}</label>
              <input
                id="inquiry-email"
                name="email"
                type="email"
                placeholder={t('emailPlaceholder')}
                autoComplete="email"
                inputMode="email"
                aria-required="true"
                aria-describedby={errors.email ? 'inquiry-email-error' : undefined}
                style={errors.email ? { borderBottomColor: 'var(--accent)' } : undefined}
              />
              {errors.email && <span id="inquiry-email-error" role="alert" style={errorStyle}>{errors.email}</span>}
            </div>
          </div>

          <div className="row-2">
            <div className="field">
              <label htmlFor="inquiry-location">{t('location')}</label>
              <input
                id="inquiry-location"
                name="location"
                type="text"
                placeholder={t('locationPlaceholder')}
                autoComplete="address-level2"
              />
            </div>
            <div className="field">
              <label htmlFor="inquiry-space">{t('space')}</label>
              <select id="inquiry-space" name="space" defaultValue="">
                <option value="" disabled>—</option>
                <option>{t('spaceOption1')}</option>
                <option>{t('spaceOption2')}</option>
                <option>{t('spaceOption3')}</option>
                <option>{t('spaceOption4')}</option>
              </select>
            </div>
          </div>

          {/* Interested-in-collection dropdown */}
          <div className="field">
            <label htmlFor="inquiry-collection">Interested in collection</label>
            <select
              id="inquiry-collection"
              name="collection"
              value={collectionValue}
              onChange={(e) => setCollectionValue(e.target.value)}
            >
              <option value="">Not sure yet</option>
              {collections.map((c) => (
                <option key={c.slug} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="inquiry-message">{t('imagining')}</label>
            <textarea
              id="inquiry-message"
              name="message"
              placeholder={t('imaginingPlaceholder')}
              aria-required="true"
              aria-describedby={errors.message ? 'inquiry-message-error' : undefined}
              style={errors.message ? { borderBottomColor: 'var(--accent)' } : undefined}
              value={messageValue}
              onChange={(e) => setMessageValue(e.target.value)}
            />
            {errors.message && <span id="inquiry-message-error" role="alert" style={errorStyle}>{errors.message}</span>}
          </div>

          <div className="submit-row">
            <button className="btn-send magnetic" type="submit">
              {t('send')}
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M1 5H15M15 5L11 1M15 5L11 9" stroke="currentColor" strokeWidth="1" />
              </svg>
            </button>
            <div className="whatsapp-alt">
              {t('orWriteOn')}
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="wa-link link magnetic"
                style={{ marginLeft: '4px' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '4px' }} aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t('whatsapp')}
              </a>
            </div>
          </div>
        </form>
      )}
    </section>
  );
}
