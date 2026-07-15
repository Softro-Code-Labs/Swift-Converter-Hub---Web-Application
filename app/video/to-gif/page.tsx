import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import Link from 'next/link';
import { Clapperboard, Shield, Zap, Sparkles } from 'lucide-react';
import ToGifTool from '@/features/video/to-gif/components';
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
  title: 'Video to GIF Converter',
  description:
    'Turn a clip from any MP4, WEBM, MOV, AVI or MKV file into a high-quality animated GIF. Set the range, frame rate, and size - no uploads, 100% browser-based.',
  keywords: [
    'video to gif converter online',
    'mp4 to gif free',
    'make a gif from video browser',
    'convert video to gif no upload',
    'high quality gif maker online',
    'create gif from clip free',
    'gif maker private browser',
    'video clip to animated gif',
  ],
  alternates: { canonical: `${SITE_URL}/video/to-gif` },
  openGraph: {
    title: 'Video to GIF Converter | Video Studio',
    description:
      'Turn any video clip into a high-quality animated GIF - fully processed in your browser.',
    url: `${SITE_URL}/video/to-gif`,
    type: 'website',
  },
};

const FEATURES = [
  { icon: Sparkles, label: 'Optimized palette', desc: 'Sharper colors than a naive GIF encode' },
  { icon: Clapperboard, label: 'Trim while you convert', desc: 'Pick the exact moment' },
  { icon: Zap, label: 'FPS & size control', desc: '10-20fps, 320-640px wide' },
  { icon: Shield, label: '100% private', desc: 'Files never leave your browser' },
];

const GIF_FAQS = [
  {
    q: 'Why does this look better than other GIF converters?',
    a: "This tool generates a custom color palette for your specific clip first, then encodes the GIF using that palette - a two-pass technique that avoids the muddy, banded colors you get from a naive single-pass GIF conversion using a generic palette.",
  },
  {
    q: 'Why is there a 15-second limit?',
    a: 'GIF is an inherently inefficient format for longer clips - file size grows quickly with duration, frame rate, and width. Capping at 15 seconds keeps both processing time and the resulting file size reasonable; for longer clips, consider the MP4/WEBM format instead.',
  },
  {
    q: 'What frame rate and width should I pick?',
    a: '15fps at 480px is a good default for most uses (smooth enough motion, reasonable file size). Use 10fps for a smaller file, or 20fps/640px if smoothness or clarity matters more than size - just note both increase the output file size.',
  },
  {
    q: 'Can I trim the source video and make a GIF in one step?',
    a: "Yes - use the start/end sliders (or the \"Use current position\" buttons while previewing) to select exactly the moment you want before creating the GIF.",
  },
];

export default function VideoToGifPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Video Studio', path: '/video' },
            { name: 'Video to GIF', path: '/video/to-gif' },
          ]),
          softwareApplicationJsonLd({
            name: 'Video to GIF Converter',
            description:
              'Turn a video clip into a high-quality animated GIF, entirely in your browser.',
            path: '/video/to-gif',
            category: 'MultimediaApplication',
          }),
          faqPageJsonLd(GIF_FAQS),
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
          <span className="text-slate-600 dark:text-slate-300 font-medium">Video to GIF</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 text-xs font-black">
              TO GIF
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Video to GIF Converter
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Turn a clip from any video file into a high-quality animated
              GIF - pick the range, frame rate, and size, all in your
              browser.
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
        <ToGifTool />
      </div>

      <StepList
        title="How it works"
        accentColor="bg-purple-500"
        steps={[
          { step: '01', title: 'Upload a video file', desc: 'Drag & drop or browse for one file.' },
          { step: '02', title: 'Set the range and options', desc: 'Start/end time, frame rate, and width.' },
          { step: '03', title: 'Create and download', desc: 'Preview the GIF, then save it.' },
        ]}
      />

      <TechnicalNote
        title="How this works"
        accentColor="bg-emerald-500"
        paragraphs={[
          "This tool runs FFmpeg compiled to WebAssembly twice: once to generate an optimized color palette for your selected clip, then again to encode the GIF using that palette - the standard technique for high-quality GIF output, all happening directly in your browser tab.",
        ]}
      />

      <FaqAccordion title="Frequently asked questions" accentColor="bg-purple-500" items={GIF_FAQS} />
    </div>
  );
}
