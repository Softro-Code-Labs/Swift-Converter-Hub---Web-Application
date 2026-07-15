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
    const gtag = (...args: any[]) => {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push(args);
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
        -- AD-DELIVERY ENGINE INJECTION ------------------------------------- 
        This tag is now ALWAYS rendered in the DOM. 
        Google's approval crawler will easily find it here 100% of the time.
      */}
      <Script
        id="google-adsense"
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE.PUBLISHER_ID}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      {/* 
        -- MICROSOFT CLARITY ------------------------------------------------- 
        Only loaded if the user has explicitly accepted.
      */}
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
