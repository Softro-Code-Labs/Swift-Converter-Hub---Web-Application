import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import Link from 'next/link';
import { Volume2, Shield, Zap, Wand2 } from 'lucide-react';
import VolumeTool from '@/features/audio/volume/components';
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
  title: 'Adjust Audio Volume',
  description:
    'Boost, lower, or auto-normalize audio volume to a consistent loudness level. Batch process MP3, WAV, OGG, FLAC, AAC, M4A, OPUS and more - 100% browser-based, no uploads.',
  keywords: [
    'audio volume adjuster online',
    'increase mp3 volume free',
    'normalize audio online browser',
    'boost audio volume online',
    'batch volume adjustment tool',
    'loudness normalization online free',
    'audio gain adjuster browser',
    'private volume booster no upload',
  ],
  alternates: { canonical: `${SITE_URL}/audio/volume` },
  openGraph: {
    title: 'Adjust Audio Volume Online | Audio Studio',
    description:
      'Boost, lower, or auto-normalize audio loudness - fully processed in your browser.',
    url: `${SITE_URL}/audio/volume`,
    type: 'website',
  },
};

const FEATURES = [
  { icon: Wand2, label: 'Auto-normalize', desc: 'EBU R128 loudness standard' },
  { icon: Volume2, label: 'Manual gain', desc: '0% to 300% control' },
  { icon: Zap, label: 'Batch processing', desc: 'Adjust up to 20 at once' },
  { icon: Shield, label: '100% private', desc: 'Files never leave your browser' },
];

const VOLUME_FAQS = [
  {
    q: 'What does "Normalize" actually do?',
    a: 'It analyzes the loudness of your audio and automatically adjusts gain to bring it to a consistent, broadcast-standard level (EBU R128) - useful for recordings with inconsistent volume, or preparing audio to match other tracks.',
  },
  {
    q: 'What happens if I set manual gain above 100%?',
    a: "The audio gets louder, but pushing gain too high can introduce clipping (distortion) if the source is already near its maximum level. If your output sounds distorted, try a lower percentage or use Normalize instead.",
  },
  {
    q: 'Will this change the audio format?',
    a: "No - the output stays in the same format as your input (an MP3 in, MP3 out, and so on). This tool only adjusts loudness, not format or bitrate.",
  },
  {
    q: 'Can I mute a file entirely?',
    a: "Yes - set the manual gain slider to 0%. This is mostly useful for testing or replacing audio in a batch workflow rather than a typical end goal.",
  },
];

export default function AudioVolumePage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Audio Studio', path: '/audio' },
            { name: 'Adjust Volume', path: '/audio/volume' },
          ]),
          softwareApplicationJsonLd({
            name: 'Audio Volume Adjuster',
            description:
              'Boost, lower, or auto-normalize audio loudness entirely in your browser.',
            path: '/audio/volume',
            category: 'MultimediaApplication',
          }),
          faqPageJsonLd(VOLUME_FAQS),
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
            Adjust Volume
          </span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-black">
              VOLUME
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Adjust Audio Volume
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Boost, lower, or auto-normalize loudness to a consistent
              level - batch process up to 20 files locally in your browser.
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
        <VolumeTool />
      </div>

      <StepList
        title="How it works"
        accentColor="bg-blue-500"
        steps={[
          {
            step: '01',
            title: 'Choose a mode',
            desc: 'Auto-normalize, or set a manual gain percentage.',
          },
          {
            step: '02',
            title: 'Upload audio files',
            desc: 'Drop up to 20 files at once.',
          },
          {
            step: '03',
            title: 'Download the result',
            desc: 'Individually, or as a ZIP bundle.',
          },
        ]}
      />

      <TechnicalNote
        title="How this works"
        accentColor="bg-emerald-500"
        paragraphs={[
          "Manual gain applies FFmpeg's volume filter, scaling the audio signal by the percentage you choose. Normalize uses the loudnorm filter, which measures perceived loudness and dynamically adjusts gain to reach a consistent target level - both run through FFmpeg compiled to WebAssembly, directly in your browser.",
        ]}
      />

      <FaqAccordion
        title="Frequently asked questions"
        accentColor="bg-blue-500"
        items={VOLUME_FAQS}
      />
    </div>
  );
}
