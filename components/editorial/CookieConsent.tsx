'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

const STORAGE_KEY = 'carpetstory_analytics_consent';

export function CookieConsent() {
  const [consent, setConsent] = useState<'accepted' | 'declined' | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'accepted' || stored === 'declined') {
      setConsent(stored as 'accepted' | 'declined');
    } else {
      // Small delay so banner doesn't flash immediately on load
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setConsent('accepted');
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(STORAGE_KEY, 'declined');
    setConsent('declined');
    setVisible(false);
  }

  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

  return (
    <>
      {/* GA4 — only if accepted */}
      {consent === 'accepted' && gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}');`}
          </Script>
        </>
      )}

      {/* Microsoft Clarity — only if accepted */}
      {consent === 'accepted' && clarityId && (
        <Script
          id="clarity-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");`,
          }}
        />
      )}

      {/* Cookie banner */}
      {visible && (
        <div
          role="dialog"
          aria-label="Cookie preferences"
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 'var(--z-banner)',
            background: 'var(--ink)',
            color: 'var(--canvas)',
            padding: '20px 28px',
            maxWidth: '520px',
            width: 'calc(100vw - 32px)',
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            flexWrap: 'wrap',
            fontFamily: 'var(--font-poppins), sans-serif',
            fontSize: '13px',
            lineHeight: '1.5',
          }}
        >
          <p style={{ margin: 0, flex: '1 1 200px', opacity: 0.8 }}>
            We use analytics to understand how visitors experience the site.{' '}
            <a
              href="/privacy"
              style={{
                color: 'var(--canvas)',
                textDecoration: 'underline',
                textUnderlineOffset: '2px',
              }}
            >
              Privacy
            </a>
          </p>
          <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
            <button
              onClick={decline}
              style={{
                background: 'none',
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'var(--canvas)',
                padding: '8px 16px',
                fontSize: '12px',
                letterSpacing: '0.06em',
                cursor: 'pointer',
                opacity: 0.7,
              }}
            >
              Decline
            </button>
            <button
              onClick={accept}
              style={{
                background: 'var(--canvas)',
                border: 'none',
                color: 'var(--ink)',
                padding: '8px 16px',
                fontSize: '12px',
                letterSpacing: '0.06em',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              Accept
            </button>
          </div>
        </div>
      )}
    </>
  );
}
