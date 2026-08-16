'use client';

import Script from 'next/script';
import { ADSENSE } from '@/lib/adsense';
import { ANALYTICS } from '@/lib/analytics';
import { useConsent } from './ConsentContext';

export default function TrackingScripts() {
  const { consent, isLoaded } = useConsent();

  return (
    <>
      {/*
        AdSense script tag - always rendered (regardless of consent) so
        Google's site-review crawler can find it during account approval.
        Ad consent itself (ad_storage / ad_user_data / ad_personalization)
        is now handled entirely by Google's own on-page consent messages
        (Privacy & messaging > European regulations / US state regulations),
        which call gtag('consent','update', ...) automatically when a
        visitor interacts with them. This file no longer sets those values
        to avoid two sources fighting over the same Consent Mode signal.
      */}
      <Script
        id="google-adsense"
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE.PUBLISHER_ID}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      {/*
        Google Analytics (gtag.js) - same "always load, let Consent Mode
        gate the data" reasoning as AdSense above. The gtag('config', ...)
        call itself lives in layout.tsx's pre-hydration script since it
        just needs window.dataLayer/gtag to exist, not this file to have
        mounted - it queues fine before this script finishes loading.
      */}
      {ANALYTICS.ANALYTICS_ENABLED && (
        <Script
          id="google-analytics"
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS.GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
      )}

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
