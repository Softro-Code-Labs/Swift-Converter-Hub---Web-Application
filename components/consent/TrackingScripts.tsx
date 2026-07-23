'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { ADSENSE } from '@/lib/adsense';
import { useConsent } from './ConsentContext';

export default function TrackingScripts() {
  const { consent, isLoaded } = useConsent();

  useEffect(() => {
    if (!isLoaded) return;

    // Standard gtag helper
    const gtag = (...args: unknown[]) => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(args);
    };

    // Update Google Consent Mode states based on user choice
    if (consent === 'accepted') {
      gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted',
      });
    } else if (consent === 'declined') {
      gtag('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
      });
    }
  }, [consent, isLoaded]);

  return (
    <>
      {/*
        AdSense script tag - always rendered (regardless of consent) so
        Google's site-review crawler can find it during account approval.
        Consent Mode above controls what data it's allowed to use, not
        whether the tag itself loads.
      */}
      <Script
        id="google-adsense"
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE.PUBLISHER_ID}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      {/* Microsoft Clarity - only loaded after explicit consent. */}
      {isLoaded && consent === 'accepted' && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "xb2li95vg9");
          `}
        </Script>
      )}
    </>
  );
}
