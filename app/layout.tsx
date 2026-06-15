import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from './providers';
import { ADSENSE } from '@/lib/adsense';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Script from 'next/script';
import './globals.css';

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

// 3. SEO & METADATA CONFIGURATION
export const metadata: Metadata = {
  metadataBase: new URL('https://swiftconverterhub.com'),
  title: {
    default: 'Swift Converter Hub | Free Online Local File Converters',
    template: '%s | Swift Converter Hub',
  },
  description:
    'Securely convert images, audio, video and documents instantly in your browser. No uploads. 100% private.',
  other: {
    'google-adsense-account': ADSENSE.PUBLISHER_ID,
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

  // Open Graph metadata for rich link previews across social and messaging platforms
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

  // Twitter card definitions for optimized media card rendering profiles
  twitter: {
    card: 'summary_large_image',
    title: 'Swift Converter Hub | Free Online File Converters',
    description:
      'Convert images and files instantly in your browser. 100% private.',
    images: ['/og-image.jpg'],
  },

  // Asset configuration paths for app icons, tab shortcut graphics, and Apple touch variants
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },

  // Explicit robot routing controls instructing search engines to index views and evaluate paths
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

// 4. CORE PLATFORM ROOT LAYOUT
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
      <body className="font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-500 selection:text-white">
        <Providers>
          <Navbar />
          <div className="flex flex-col min-h-screen">{children}</div>
          <Footer />
        </Providers>

        {/* ── AD-DELIVERY ENGINE INJECTION ──────────────────────────────────────────────── */}
        <Script
          id="adsense-init"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE.PUBLISHER_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
