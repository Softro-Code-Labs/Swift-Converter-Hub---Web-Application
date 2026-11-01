import { SITE_URL, SITE_NAME } from '@/config/site';
import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import '@fontsource-variable/bricolage-grotesque/opsz.css';
import { Providers } from './providers';
import { ADSENSE } from '@/lib/adsense';
import { ANALYTICS } from '@/lib/analytics';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  JsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from '@/components/seo/JsonLd';
import './globals.css';

// Fonts are self-hosted (no request to Google at runtime), which fits a
// product whose whole promise is that nothing leaves the device.
const geistSans = GeistSans;
const geistMono = GeistMono;

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f9fb' },
    { media: '(prefers-color-scheme: dark)', color: '#16181d' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Swift Converter Hub | Free Online Local File Converters',
    template: '%s | Swift Converter Hub',
  },
  description:
    'Securely convert images, audio, video and documents instantly in your browser. No uploads. 100% private.',
  other: {
    'google-adsense-account': ADSENSE.PUBLISHER_ID,
  },
  // A short, focused list. Search engines rank on page content, titles and
  // descriptions; long keyword lists add nothing and can read as stuffing.
  // Each page sets its own specific keywords via lib/seo.ts.
  keywords: [
    'free online file converter',
    'file converter no upload',
    'private file converter',
    'browser based file converter',
    'image converter',
    'pdf tools',
    'video converter',
    'audio converter',
    'json csv converter',
    'text tools',
    'swift converter hub',
  ],
  authors: [{ name: 'SwiftConverterHub Team' }],
  creator: SITE_NAME,
  publisher: SITE_NAME,

  // Open Graph metadata for social link previews
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'Swift Converter Hub | Secure Local File Converters',
    description:
      'Convert images and files instantly inside your browser. Zero cloud uploads.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },

  // Twitter/X card metadata
  twitter: {
    card: 'summary_large_image',
    title: 'Swift Converter Hub | Free Online File Converters',
    description:
      'Convert images and files instantly in your browser. 100% private.',
    images: ['/og-image.png'],
  },

  // Icons come from app/favicon.ico, app/icon.svg (adapts to dark tabs),
  // app/icon.png and app/apple-icon.png,
  // which Next.js links automatically.

  // Explicit indexing directives for search engine crawlers
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} min-h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-blue-600 focus:text-white focus:text-sm focus:font-semibold"
        >
          Skip to content
        </a>
        {/* Initialize Google Consent Mode default states */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              
              // If consent is already saved in localStorage, default to that to prevent state jumps
              var savedConsent = null;
              try {
                savedConsent = window.localStorage.getItem('swiftconverterhub-consent');
              } catch (e) {}

              var defaultState = (savedConsent === 'accepted') ? 'granted' : 'denied';

              gtag('consent', 'default', {
                'ad_storage': defaultState,
                'ad_user_data': defaultState,
                'ad_personalization': defaultState,
                'analytics_storage': defaultState
              });

              ${
                ANALYTICS.ANALYTICS_ENABLED
                  ? `
              // Google Analytics - config call only. Consent Mode above
              // already told gtag whether analytics_storage is granted or
              // denied, so this is safe to run unconditionally: denied
              // visitors still get cookieless, consent-aware pings, not a
              // full tracking session. The actual gtag.js library is loaded
              // separately in TrackingScripts.tsx.
              gtag('js', new Date());
              gtag('config', '${ANALYTICS.GA_MEASUREMENT_ID}');
              `
                  : ''
              }
            `,
          }}
        />

        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <div id="main-content" className="flex flex-1 flex-col">
              {children}
            </div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
