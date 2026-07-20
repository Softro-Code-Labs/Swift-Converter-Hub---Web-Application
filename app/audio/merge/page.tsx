import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import Link from 'next/link';
import { Combine, Shield, Zap, ListOrdered } from 'lucide-react';
import MergeTool from '@/features/audio/merge/components';
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
  title: 'Merge Audio Files Online',
  description:
    'Combine multiple MP3, WAV, OGG, FLAC, AAC, M4A, OPUS or other audio files into one, in any order you choose. No uploads, 100% browser-based.',
  keywords: [
    'merge audio files online',
    'combine mp3 files free',
    'join audio files browser',
    'audio joiner online no upload',
    'concatenate mp3 files online',
    'merge multiple audio tracks',
    'combine wav files free',
    'audio merger private browser',
    'audio concatenator online',
    'combine voice recordings free',
    'stitch audio clips together',
    'merge podcast segments online',
  ],
  alternates: { canonical: `${SITE_URL}/audio/merge` },
  openGraph: {
    title: 'Merge Audio Files Online | Audio Studio',
    description:
      'Combine multiple audio files into one, in any order - fully processed in your browser.',
    url: `${SITE_URL}/audio/merge`,
    type: 'website',
  },
};

const FEATURES = [
  { icon: ListOrdered, label: 'Reorder freely', desc: 'Arrange files before merging' },
  { icon: Combine, label: 'Mixed formats OK', desc: 'MP3 + WAV + M4A together' },
  { icon: Zap, label: 'Up to 15 files', desc: 'Merge into one output' },
  { icon: Shield, label: '100% private', desc: 'Files never leave your browser' },
];

const MERGE_FAQS = [
  {
    q: 'Can I merge files that are in different formats?',
    a: "Yes - you can combine an MP3, a WAV, and an M4A into a single output file. Each input is decoded and re-encoded into your chosen output format so they play back as one continuous, consistent track.",
  },
  {
    q: 'Does merging re-encode my audio?',
    a: 'Yes, unlike the Trim tool, merging always re-encodes (it has to, to combine streams that may have different formats, sample rates, or codecs into one) - so there is some quality trade-off inherent to any lossy re-encode. Choose FLAC or WAV as the output format if you want to avoid that.',
  },
  {
    q: 'How do I control the order of the merged files?',
    a: 'Use the up and down arrows next to each file in the list before merging - the final output plays them back in the order shown, top to bottom.',
  },
  {
    q: 'Is there a limit on how many files I can merge?',
    a: 'Up to 15 files per merge. This is a practical limit for browser memory, not an artificial restriction - all processing happens locally on your device.',
  },
];

export default function AudioMergePage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Audio Studio', path: '/audio' },
            { name: 'Merge Audio', path: '/audio/merge' },
          ]),
          softwareApplicationJsonLd({
            name: 'Audio Merger',
            description:
              'Combine multiple audio files into one, in any order, entirely in your browser.',
            path: '/audio/merge',
            category: 'MultimediaApplication',
          }),
          faqPageJsonLd(MERGE_FAQS),
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
            Merge Audio
          </span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-black">
              MERGE
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Merge Audio Files Online
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Combine multiple audio files into one, in any order you
              choose - even if they started in different formats.
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
        <MergeTool />
      </div>

      <StepList
        title="How it works"
        accentColor="bg-blue-500"
        steps={[
          {
            step: '01',
            title: 'Upload audio files',
            desc: 'Add 2 to 15 files, any supported format.',
          },
          {
            step: '02',
            title: 'Arrange the order',
            desc: 'Reorder with the up/down arrows.',
          },
          {
            step: '03',
            title: 'Merge and download',
            desc: 'Pick an output format, then save the combined file.',
          },
        ]}
      />

      <TechnicalNote
        title="How the merging works"
        accentColor="bg-emerald-500"
        paragraphs={[
          "This tool uses FFmpeg's concat filter (compiled to WebAssembly), which decodes each input file and stitches them into one continuous audio stream before re-encoding to your chosen output format - this is what makes merging files of different formats or sample rates possible, unlike a simple file concatenation.",
        ]}
      />

      <FaqAccordion
        title="Frequently asked questions"
        accentColor="bg-blue-500"
        items={MERGE_FAQS}
      />
    </div>
  );
}
