import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from './providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';
import { CLIENT_ENV } from '@/config/env.client';

// 1. FONT CONFIGURATIONS
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

// 2. HIGH-PERFORMANCE VIEWPORT CONFIGURATION
export const viewport: Viewport = {
  themeColor: '#2563EB',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// 3. SEO METADATA CONFIGURATION
export const metadata: Metadata = {
  metadataBase: new URL('https://swiftconverterhub.com'),
  title: {
    default: 'Swift Converter Hub | Free Online Local File Converters',
    template: '%s | Swift Converter Hub',
  },
  description:
    'Securely convert images, audio, video and documents instantly in your browser. No uploads. 100% private.',
  other: {
    'google-adsense-account': CLIENT_ENV.ADSENSE_PUBLISHER_ID ?? '',
  },
  keywords: [
    'file converter',
    'image converter',
    'local file conversion',
    'secure file converter',
    'client side converter',
    'free image converter',
    'browser based converter',
    'privacy file converter',
  ],
  authors: [{ name: 'SwiftConverterHub Team' }],
  creator: 'Swift Converter Hub',
  publisher: 'Swift Converter Hub',

  // OPEN GRAPH METADATA FOR RICH LINK PREVIEWS ON SOCIAL MEDIA AND MESSAGING PLATFORMS
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://swiftconverterhub.com',
    siteName: 'Swift Converter Hub',
    title: 'Swift Converter Hub | Secure Local File Converters',
    description:
      'Convert images and files instantly inside your browser. Zero cloud uploads.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Swift Converter Hub',
      },
    ],
  },

  // TWITTER METADATA FOR RICH LINK PREVIEWS
  twitter: {
    card: 'summary_large_image',
    title: 'Swift Converter Hub | Free Online File Converters',
    description:
      'Convert images and files instantly in your browser. 100% private.',
    images: ['/og-image.jpg'],
  },

  // FAVICON AND APPLE TOUCH ICON CONFIGURATION FOR BROWSER TABS AND MOBILE DEVICES
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },

  // TELLS SEARCH ENGINES TO INDEX ALL PAGES AND FOLLOW ALL LINKS, WITH SPECIAL INSTRUCTIONS FOR GOOGLE BOT TO ALLOW UNLIMITED PREVIEWS AND SNIPPETS
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
  const adsenseId = CLIENT_ENV.ADSENSE_PUBLISHER_ID;
  const hasAdsense =
    typeof adsenseId === 'string' && adsenseId.startsWith('ca-pub-');

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} min-h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-500 selection:text-white">
        <Providers>
          <Navbar />
          <div className="flex flex-col min-h-screen">{children}</div>
          <Footer />
        </Providers>

        {/* Adsense Script */}
        {hasAdsense && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
          />
        )}
      </body>
    </html>
  );
}
