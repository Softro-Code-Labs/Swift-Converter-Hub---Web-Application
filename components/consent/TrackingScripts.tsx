'use client';

import Script from 'next/script';
import { ADSENSE } from '@/lib/adsense';
import { useConsent } from './ConsentContext';

/**
 * Renders the AdSense loader + Microsoft Clarity scripts, but only after
 * the visitor has explicitly accepted non-essential cookies.
 */
export default function TrackingScripts() {
  const { consent, isLoaded } = useConsent();

  if (!isLoaded || consent !== 'accepted') return null;

  return (
    <>
      {/* -- AD-DELIVERY ENGINE INJECTION ------------------------------------- */}
      <script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE.PUBLISHER_ID}`}
        crossOrigin="anonymous"
      />

      {/* -- MICROSOFT CLARITY ------------------------------------------------- */}
      <Script id="microsoft-clarity" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "xb2li95vg9");
        `}
      </Script>
    </>
  );
}
