import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from './providers';
import Script from 'next/script';
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
  title: {
    default: 'Swift Converter Hub | Free Online Local File Converters',
    template: '%s | Swift Converter Hub',
  },
  description:
    'Securely convert and compress images, graphics, and office documents instantly right inside your browser. No cloud uploads. 100% private client-side processing.',
  keywords: [
    'file converter',
    'image converter',
    'local file conversion',
    'secure file converter',
    'client side converter',
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
        alt: 'Swift Converter Hub Platform Cover Banner',
      },
    ],
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} min-h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white">
        <Providers>
          {children}

          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT_ENV.ADSENSE_PUBLISHER_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        </Providers>
      </body>
    </html>
  );
}
