import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import Link from 'next/link';
import { Minimize2, Shield, Zap, TrendingDown } from 'lucide-react';
import CompressTool from '@/features/audio/compress/components';
import {
  StepList,
  TechnicalNote,
  FaqAccordion,
} from '@/features/shared/components/page-sections';
import {
  JsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
  softwareApplicationJsonLd,
} from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Compress Audio Files',
  description:
    'Shrink audio file size by re-encoding at a lower bitrate - MP3, WAV, OGG, FLAC, AAC, M4A, OPUS and more. Batch compress up to 20 files, 100% browser-based, no uploads.',
  keywords: [
    'compress audio online',
    'reduce audio file size',
    'mp3 compressor online free',
    'shrink audio file browser',
    'batch audio compression tool',
    'lower audio bitrate online',
    'browser audio compressor no upload',
    'compress podcast audio free',
    'audio bitrate reducer',
    'mp3 file size reducer',
    'compress voice recording online',
    'reduce podcast file size',
    'audio compressor no signup',
  ],
  alternates: { canonical: `${SITE_URL}/audio/compress` },
  openGraph: {
    title: 'Compress Audio Files Online | Audio Studio',
    description:
      'Reduce audio file size without a big quality hit - fully processed in your browser.',
    url: `${SITE_URL}/audio/compress`,
    type: 'website',
  },
};

const FEATURES = [
  { icon: Minimize2, label: 'Adjustable bitrate', desc: 'Low, standard, or high' },
  { icon: TrendingDown, label: 'Live size preview', desc: 'See the new size per file' },
  { icon: Zap, label: 'Batch processing', desc: 'Compress up to 20 at once' },
  { icon: Shield, label: '100% private', desc: 'Files never leave your browser' },
];

const COMPRESS_FAQS = [
  {
    q: 'Why does compressing my WAV file turn it into an MP3?',
    a: "WAV is uncompressed by design, so there's no smaller-but-still-WAV option - shrinking it means encoding to a lossy format. MP3 is the default target since it's the most universally supported.",
  },
  {
    q: 'How much smaller will my file get?',
    a: "It depends on the source. Going from an uncompressed WAV to a 192kbps MP3 typically saves 80-90%. Re-encoding an already-compressed MP3 at a lower bitrate saves less, and re-encoding a lossy file repeatedly compounds quality loss - compress from the original source when you can.",
  },
  {
    q: 'Is there a quality loss?',
    a: "Any re-encode to a lossy bitrate involves some quality trade-off - that's inherent to lossy compression, not specific to this tool. The Standard preset (192kbps) is a reasonable default for most listening; use High (320kbps) if quality matters more than size.",
  },
  {
    q: 'Can I compress a FLAC file and keep it lossless?',
    a: "FLAC has its own lossless compression built in, and this tool always applies FLAC's maximum lossless compression level when the source is already FLAC - so it stays exact, just smaller where possible.",
  },
];

export default function AudioCompressPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Audio Studio', path: '/audio' },
            { name: 'Compress Audio', path: '/audio/compress' },
          ]),
          softwareApplicationJsonLd({
            name: 'Audio Compressor',
            description:
              'Reduce audio file size by re-encoding at a lower bitrate, entirely in your browser.',
            path: '/audio/compress',
            category: 'MultimediaApplication',
          }),
          faqPageJsonLd(COMPRESS_FAQS),
        ]}
      />
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
            href="/audio"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Audio Studio
          </Link>
          <span>›</span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            Compress Audio
          </span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-black">
              COMPRESS
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Compress Audio Files
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Shrink audio file size by re-encoding at a lower bitrate -
              batch process up to 20 files, all processed locally in your
              browser.
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
            title: 'Upload audio files',
            desc: 'Drop up to 20 files at once.',
          },
          {
            step: '02',
            title: 'Choose a bitrate',
            desc: 'Low, standard, or high quality.',
          },
          {
            step: '03',
            title: 'Download savings',
            desc: 'Get individually compressed files or a ZIP bundle.',
          },
        ]}
      />

      <TechnicalNote
        title="How the compression works"
        accentColor="bg-emerald-500"
        paragraphs={[
          "Compression re-encodes the audio at the bitrate you choose, using FFmpeg compiled to WebAssembly - the same encoders (libmp3lame, libopus, etc.) used by desktop tools, just running inside your browser tab instead of on a server.",
          'Lossless sources (WAV, FLAC) are handled differently: WAV is converted to MP3 since there\'s no smaller-but-lossless WAV variant, while FLAC gets its own maximum lossless compression level rather than being converted to a lossy format.',
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
