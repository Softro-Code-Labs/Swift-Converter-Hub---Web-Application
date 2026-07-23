import { SITE_URL, SITE_NAME } from '@/config/site';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from './providers';
import { ADSENSE } from '@/lib/adsense';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  JsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from '@/components/seo/JsonLd';
import './globals.css';

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

export const viewport: Viewport = {
  themeColor: '#2563EB',
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
  keywords: [
    'swift converter hub',
    'swift image converter',
    'swift video converter',
    'swift audio converter',
    'swift document converter',
    'swift file converter',
    'swift file converter free',
    'swift file converter online',
    'swift file converter no upload',
    'swift file converter no server',

    // general platform
    'converter hub',
    'image converter',
    'video converter',
    'audio converter',
    'document converter',
    'file converter',
    'file converter free',
    'file converter online',
    'file converter no upload',
    'file converter no server',

    // core platform
    'client side file converter',
    'browser based converter',
    'private file conversion',
    'secure file converter online',
    'no upload file converter',
    'local file conversion tool',
    'offline file converter free',
    'safe document converter',
    '100 percent private image converter',
    'zero upload image compressor',
    'in browser image processing',
    'free online file converter',
    'fast local conversion utility',
    'wasm file converter',
    'web assembly tool',
    'open source browser converter',
    'gdpr compliant file converter',
    'convert files securely',
    'unlimited free file converter',
    'batch converter no server',
    'privacy first file tools',

    // images studio
    'webp to png converter',
    'png to jpg online',
    'heic to jpg converter free',
    'jpg to webp conversion',
    'svg to png converter',
    'png to ico maker',
    'gif to mp4 converter',
    'compress jpeg without upload',
    'resize image in browser',
    'bulk image converter free',
    'crop images locally',
    'convert image to pdf',
    'avif to png converter',
    'transparent png converter',
    'high quality photo compressor',
    'convert bmp to jpeg',

    // audio studio
    'mp3 to wav converter',
    'wav to mp3 online',
    'flac to mp3 converter free',
    'm4a to mp3 converter',
    'audio transcoder browser',
    'extract audio from video',
    'ogg to mp3 online free',
    'aac converter online',
    'compress mp3 files online',
    'convert audio to wav',
    'webm to mp3 converter',
    'local audio files converter',
    'reduce audio file size',
    'free batch audio converter',

    // video studio
    'mp4 to webm converter',
    'webm to mp4 online free',
    'convert video to gif',
    'compress mp4 in browser',
    'mov to mp4 converter free',
    'video cropper online local',
    'mkv to mp4 file converter',
    'reduce video size no upload',
    'fast browser video converter',
    'convert avi to mp4',
    'extract video clips online',
    'free client side video editor',

    // documents suite
    'pdf to word converter free',
    'word to pdf tool online',
    'excel to pdf converter',
    'convert pdf to png',
    'merge pdf files locally',
    'split pdf pages free',
    'compress pdf file size',
    'txt to pdf online converter',
    'epub to pdf ebook converter',
    'html to pdf tool free',
    'secure document converter',
    'convert csv to pdf',

    // data studio
    'json to csv converter',
    'csv to json online free',
    'xml to json tool',
    'json to xml converter',
    'yaml to json online',
    'format json file online',
    'csv to excel formatting tool',
    'parse xml file to csv',
    'base64 encoder decoder',
    'url encoder decoder online',
    'sql insert statement builder',
    'minify json data free',

    // character studio
    'case converter online',
    'convert upper to lowercase',
    'regex tester and builder',
    'text to binary converter',
    'binary to string tool',
    'word counter online free',
    'remove line breaks from text',
    'slug generator for seo',
    'markdown to html converter',
    'html entity encoder decoder',
    'remove text duplicates online',
    'hex to string converter',
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

  // Favicon and touch icons
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },

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
      <body className="font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-500 selection:text-white">
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
            `,
          }}
        />

        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <Providers>
          <Navbar />
          <div className="flex flex-col min-h-screen">{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
