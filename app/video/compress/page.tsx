import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import Link from 'next/link';
import { Minimize2, Shield, Zap, TrendingDown } from 'lucide-react';
import CompressTool from '@/features/video/compress/components';
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
  title: 'Compress Video Files',
  description:
    'Shrink video file size by re-encoding with a resolution cap and quality preset - MP4, WEBM, MOV, AVI, MKV and more. Batch compress, 100% browser-based, no uploads.',
  keywords: [
    'compress video online',
    'reduce video file size',
    'mp4 compressor online free',
    'shrink video file browser',
    'batch video compression tool',
    'lower video resolution online',
    'browser video compressor no upload',
    'compress video for email free',
  ],
  alternates: { canonical: `${SITE_URL}/video/compress` },
  openGraph: {
    title: 'Compress Video Files Online | Video Studio',
    description:
      'Reduce video file size without a big quality hit - fully processed in your browser.',
    url: `${SITE_URL}/video/compress`,
    type: 'website',
  },
};

const FEATURES = [
  { icon: Minimize2, label: 'Quality presets', desc: 'Small, balanced, or high quality' },
  { icon: TrendingDown, label: 'Never upscales', desc: "Smaller videos aren't stretched" },
  { icon: Zap, label: 'Batch processing', desc: 'Compress up to 5 at once' },
  { icon: Shield, label: '100% private', desc: 'Files never leave your browser' },
];

const COMPRESS_FAQS = [
  {
    q: 'Why does the output always come out as MP4?',
    a: "MP4 (H.264) is the most universally playable format across devices and platforms, so compression always targets it regardless of your source format - this keeps the size/quality trade-off predictable rather than also changing the container.",
  },
  {
    q: 'How much smaller will my file get?',
    a: "It depends heavily on your source video's resolution and bitrate. Capping a 4K video to 720p typically saves 70-90%; a video already at or below the target resolution will only shrink from the quality/bitrate change, which is more modest.",
  },
  {
    q: 'Will my video get scaled up if it\u2019s smaller than the preset?',
    a: "No - the resolution cap only ever scales down. A 480p video selected with the 'High quality' (no cap) or 'Balanced' (720p cap) preset stays at 480p; it's never stretched to fill the target.",
  },
  {
    q: 'Why is compression slower than conversion?',
    a: 'Compression re-encodes both the resolution-scaling filter and the video codec, which is more computationally intensive than a straightforward format conversion at the original resolution - this is inherent to video encoding, not specific to this tool.',
  },
];

export default function VideoCompressPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Video Studio', path: '/video' },
            { name: 'Compress Video', path: '/video/compress' },
          ]),
          softwareApplicationJsonLd({
            name: 'Video Compressor',
            description:
              'Reduce video file size with a resolution cap and quality preset, entirely in your browser.',
            path: '/video/compress',
            category: 'MultimediaApplication',
          }),
          faqPageJsonLd(COMPRESS_FAQS),
        ]}
      />
      <div className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-800">
        <nav className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 mb-5">
          <Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Home
          </Link>
          <span>›</span>
          <Link href="/video" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Video Studio
          </Link>
          <span>›</span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">Compress Video</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-black">
              COMPRESS
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Compress Video Files
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Shrink video file size with a resolution cap and quality
              preset - batch process up to 5 files, all processed locally
              in your browser.
            </p>
          </div>

          <div className="hidden sm:grid grid-cols-2 gap-2 shrink-0">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <Icon className="w-3.5 h-3.5 text-purple-500 shrink-0" />
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
        accentColor="bg-purple-500"
        steps={[
          { step: '01', title: 'Upload video files', desc: 'Drop up to 5 files at once.' },
          { step: '02', title: 'Choose a quality preset', desc: 'Small, balanced, or high quality.' },
          { step: '03', title: 'Download savings', desc: 'Get individually compressed files or a ZIP bundle.' },
        ]}
      />

      <TechnicalNote
        title="How the compression works"
        accentColor="bg-emerald-500"
        paragraphs={[
          "Compression re-encodes video using FFmpeg compiled to WebAssembly - the same H.264 encoder used by desktop tools, just running inside your browser tab. The resolution cap uses a \"scale down, never up\" filter, so smaller source videos aren't artificially stretched to match the target.",
        ]}
      />

      <FaqAccordion title="Frequently asked questions" accentColor="bg-purple-500" items={COMPRESS_FAQS} />
    </div>
  );
}
