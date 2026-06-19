import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from './providers';
import { ADSENSE } from '@/lib/adsense';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
    'ffmpeg web assembly tool',
    'open source browser converter',
    'gdpr compliant file converter',
    'convert files securely',
    'unlimited free file converter',
    'batch converter no server',
    'privacy first file tools',
    'swift converter hub',

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

    // character studi
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
        url: '/og-image.png',
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
    images: ['/og-image.png'],
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

        {/* -- AD-DELIVERY ENGINE INJECTION ------------------------------------------------ */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE.PUBLISHER_ID}`}
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
