import { Metadata } from 'next';
import Link from 'next/link';
import { Minimize2, Shield, Zap, TrendingDown } from 'lucide-react';
import CompressTool from '@/features/image/compress/components';
import {
  StepList,
  InfoCardGrid,
  TechnicalNote,
  FaqAccordion,
} from '@/features/image/shared/components/page-sections';

export const metadata: Metadata = {
  title: 'Compress Images',
  description:
    'Shrink image file size without losing visual quality. Adjustable quality presets, metadata stripping, and batch compression. 100% browser-based, no uploads.',
  keywords: [
    // Original high-volume core keywords
    'compress image online',
    'reduce image file size',
    'jpg compressor online',
    'png compressor free',
    'shrink photo size online',
    'webp compression tool free',

    // Bulk workflow keywords
    'batch image compression tool',
    'bulk image optimizer online',
    'compress multiple images at once',
    'zip compress photos browser',

    // Web performance keywords
    'optimize images for web',
    'image optimizer free',
    'lossless image compressor online',
    'lossy image compression online',
    'strip image metadata online',

    // Privacy & local engine keywords
    'browser image compression',
    'no upload image compressor',
    'completely private photo shrinker',
    'secure local image optimizer',
    'offline image size reducer',

    // Specific asset format optimizations
    'compress jpeg to 100kb',
    'reduce png size without quality loss',
    'heic compression tool browser',
    'svg file size optimizer online',
    'compress avif images free',
    'convert and compress photos online',

    // Core web vitals & site speed intent
    'improve page speed image optimizer',
    'compress images for wordpress',
    'shopify product image compressor',
    'nextjs image optimization alternative',
    'lighthouse page speed image fix',
    'optimize website images for seo',
    'reduce layout shift image compression',

    // Technical utility & stripping variants
    'remove exif data from images online',
    'strip camera metadata from photos',
    'remove image location tracking data',
    'compress image keep resolution',
    'downscale image dimensions and size',
    'change image quality percentage online',

    // Industry and professional use cases
    'compress photos for email attachment',
    'passport photo size reducer online',
    'resume picture compressor free',
    'compress real estate listing photos',
    'graphic designer portfolio optimizer',
    'bulk compression for content creators',

    // Secure edge and performance mechanics
    'wasm client side image compressor',
    'html5 canvas image quality reducer',
    'zero tracking website asset optimizer',
    'instant local image cruncher',
    'browser engine image file shrinker',
  ],
  alternates: { canonical: 'https://swiftconverterhub.com/image/compress' },
  openGraph: {
    title: 'Compress Images Online - Free Image Optimizer | Image Studio',
    description:
      'Reduce file size without losing quality - fully processed in your browser.',
    url: 'https://swiftconverterhub.com/image/compress',
    type: 'website',
  },
};

const FEATURES = [
  {
    icon: Minimize2,
    label: 'Smart compression',
    desc: 'Quality-aware size reduction',
  },
  {
    icon: TrendingDown,
    label: 'Live savings preview',
    desc: 'See size reduction per file',
  },
  { icon: Zap, label: 'Batch processing', desc: 'Compress up to 20 at once' },
  {
    icon: Shield,
    label: '100% private',
    desc: 'Files never leave your browser',
  },
];

const QUALITY_PRESETS = [
  {
    title: 'High Quality',
    meta: '~90% quality',
    desc: 'Photography portfolios, print, archival storage',
    highlight: '~20-40% smaller',
  },
  {
    title: 'Balanced',
    meta: '~75% quality',
    desc: 'Websites, blogs, social media, general use',
    highlight: '~50-65% smaller',
  },
  {
    title: 'Aggressive',
    meta: '~50% quality',
    desc: 'Thumbnails, email attachments, fast-loading pages',
    highlight: '~70-85% smaller',
  },
];

const COMPRESS_FAQS = [
  {
    q: "What's the difference between compression and resizing?",
    a: 'Compression reduces file size by changing how pixel data is encoded, keeping the same dimensions. Resizing changes the actual pixel dimensions. This tool only compresses - use the Crop & Resize tool if you also want to change dimensions.',
  },
  {
    q: 'Will compressing a PNG actually reduce its size?',
    a: 'Yes, though PNG compression is lossless by default so savings are more modest (10-30%) compared to JPEG/WebP. For maximum size reduction on photos, consider converting to WebP using the Format Converter first.',
  },
  {
    q: 'Can I compress the same image multiple times?',
    a: 'You can, but each round of lossy compression (JPEG, WebP) introduces additional quality loss. For best results, always compress from the original source file rather than re-compressing an already-compressed output.',
  },
  {
    q: 'What does "strip metadata" actually remove?',
    a: "It removes EXIF camera data, GPS coordinates, ICC color profiles, and any embedded thumbnails - data that adds file size but isn't visible in the image itself. The visual pixels are completely unaffected.",
  },
  {
    q: 'Why is my compressed file barely smaller?',
    a: "If the image was already heavily compressed (e.g. a JPEG re-saved from a low-quality source), there isn't much redundant data left to remove. Try the Aggressive preset, or convert to WebP for better compression efficiency.",
  },
];

export default function CompressPage() {
  return (
    <div className="space-y-0">
      <div className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-800">
        <nav className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 mb-5">
          <Link
            href="/"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Home
          </Link>
          <span>›</span>
          <Link
            href="/image"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Image Studio
          </Link>
          <span>›</span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            Compress & Optimize
          </span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-black">
              COMPRESS
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Compress & Optimize Images
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Reduce image file size with adjustable quality presets, metadata
              stripping, and live before/after savings - all processed locally
              in your browser.
            </p>
          </div>

          <div className="hidden sm:grid grid-cols-2 gap-2 shrink-0">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400"
              >
                <Icon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <CompressTool />
      </div>

      <StepList
        title="How it works"
        accentColor="bg-blue-500"
        steps={[
          {
            step: '01',
            title: 'Upload images',
            desc: 'Drop up to 20 images at once.',
          },
          {
            step: '02',
            title: 'Choose quality',
            desc: 'Pick a preset or set a custom quality level.',
          },
          {
            step: '03',
            title: 'Download savings',
            desc: 'Get individually compressed files or a ZIP bundle.',
          },
        ]}
      />

      <InfoCardGrid
        title="Choosing a quality preset"
        accentColor="bg-amber-500"
        columns="grid-cols-1 sm:grid-cols-3"
        cards={QUALITY_PRESETS}
      />

      <TechnicalNote
        title="How the compression works"
        accentColor="bg-emerald-500"
        paragraphs={[
          'Compression happens in two steps. First, metadata stripping removes EXIF data, GPS tags, and embedded color profiles - this alone often saves 5-15% with zero visual impact. Second, the quality slider controls the level of lossy compression applied during re-encoding, using the same JPEG/WebP quantization algorithms found in desktop editors like Photoshop.',
          "Because everything runs through a professional-grade image engine compiled to WebAssembly, the compression engine is identical to what you'd get running premium editing software locally on a desktop - it just runs inside your browser tab instead.",
        ]}
      />

      <FaqAccordion
        title="Frequently asked questions"
        accentColor="bg-blue-500"
        items={COMPRESS_FAQS}
      />
    </div>
  );
}
