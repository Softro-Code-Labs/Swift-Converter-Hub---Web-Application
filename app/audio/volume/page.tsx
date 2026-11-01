import { Metadata } from 'next';
import { Volume2, Shield, Zap, Wand2 } from 'lucide-react';
import VolumeTool from '@/features/audio/volume/components';
import {
  StepList,
  TechnicalNote,
  FaqAccordion,
  ToolPageHeader,
} from '@/features/shared/components/page-sections';
import {
  JsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
  softwareApplicationJsonLd,
} from '@/components/seo/JsonLd';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/audio/volume',
  title: 'Change Audio Volume Online - Boost or Normalize',
  description:
    'Make audio louder or quieter, or normalize loudness to a consistent level. Works with MP3, WAV, M4A and more. Free, in your browser, nothing uploaded.',
  keywords: [
    'audio volume adjuster online',
    'increase mp3 volume free',
    'normalize audio online browser',
    'boost audio volume online',
    'batch volume adjustment tool',
    'loudness normalization online free',
    'audio gain adjuster browser',
    'private volume booster no upload',
    'audio normalizer online free',
    'fix quiet audio online',
    'increase volume of audio file',
    'audio loudness fixer browser',
  ],
});

const FEATURES = [
  { icon: Wand2, label: 'Auto-normalize', desc: 'EBU R128 loudness standard' },
  { icon: Volume2, label: 'Manual gain', desc: '0% to 300% control' },
  { icon: Zap, label: 'Batch processing', desc: 'Adjust up to 20 at once' },
  {
    icon: Shield,
    label: '100% private',
    desc: 'Files never leave your browser',
  },
];

const VOLUME_FAQS = [
  {
    q: 'What does "Normalize" actually do?',
    a: 'It analyzes the loudness of your audio and automatically adjusts gain to bring it to a consistent, broadcast-standard level (EBU R128) - useful for recordings with inconsistent volume, or preparing audio to match other tracks.',
  },
  {
    q: 'What happens if I set manual gain above 100%?',
    a: 'The audio gets louder, but pushing gain too high can introduce clipping (distortion) if the source is already near its maximum level. If your output sounds distorted, try a lower percentage or use Normalize instead.',
  },
  {
    q: 'Will this change the audio format?',
    a: 'No - the output stays in the same format as your input (an MP3 in, MP3 out, and so on). This tool only adjusts loudness, not format or bitrate.',
  },
  {
    q: 'Can I mute a file entirely?',
    a: 'Yes - set the manual gain slider to 0%. This is mostly useful for testing or replacing audio in a batch workflow rather than a typical end goal.',
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
      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Audio Studio', path: '/audio' },
          { name: 'Adjust Volume', path: '/audio/volume' },
        ]}
        title={'Adjust Audio Volume'}
        description={
          'Boost, lower, or auto-normalize loudness to a consistent level - batch process up to 20 files locally in your browser.'
        }
        features={FEATURES}
      />

      <div className="@container px-5 py-6 sm:px-8 sm:py-8">
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
