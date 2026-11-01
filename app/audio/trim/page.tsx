import { Metadata } from 'next';
import { Scissors, Shield, Zap, Gauge } from 'lucide-react';
import TrimTool from '@/features/audio/trim/components';
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
  path: '/audio/trim',
  title: 'Trim Audio Online - Cut MP3 & WAV Files',
  description:
    'Cut a clip from MP3, WAV, M4A, FLAC or any audio file. Set start and end points, preview, and download without re-encoding. Free, in your browser.',
  keywords: [
    'trim audio online free',
    'cut mp3 online browser',
    'audio clip cutter free',
    'crop audio file online',
    'mp3 trimmer no upload',
    'cut audio clip browser',
    'trim wav file online',
    'audio cutter private',
    'audio trimmer no signup',
    'cut audio clip free online',
    'shorten audio file online',
    'extract audio segment online',
  ],
});

const FEATURES = [
  {
    icon: Scissors,
    label: 'Precise trimming',
    desc: 'Set exact start/end points',
  },
  {
    icon: Gauge,
    label: 'Fast, no re-encode',
    desc: 'Stream copy, not re-compression',
  },
  { icon: Zap, label: 'Live preview', desc: 'Listen before and after' },
  {
    icon: Shield,
    label: '100% private',
    desc: 'Files never leave your browser',
  },
];

const TRIM_FAQS = [
  {
    q: 'Does trimming reduce audio quality?',
    a: "No - trimming uses a fast stream copy rather than re-encoding, so the audio inside your selected range is untouched. For compressed formats like MP3, the exact cut point can land up to one frame (a few milliseconds) off due to how those formats are structured; for WAV it's sample-accurate.",
  },
  {
    q: 'Can I preview my selection before trimming?',
    a: 'Yes - use the audio player to find the moments you want, then use the "Use current position" buttons to set the start and end points from where playback currently is.',
  },
  {
    q: 'Is there a limit on file length?',
    a: "No hard limit is imposed by this tool, since files never leave your device - very long files are bounded only by your browser's available memory.",
  },
  {
    q: 'What format will my trimmed file be?',
    a: 'The same format as your original file - trimming a WAV produces a WAV, trimming an MP3 produces an MP3, and so on. Use the Format Converter first if you also want to change formats.',
  },
];

export default function AudioTrimPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Audio Studio', path: '/audio' },
            { name: 'Trim Audio', path: '/audio/trim' },
          ]),
          softwareApplicationJsonLd({
            name: 'Audio Trimmer',
            description:
              'Cut a clip from an audio file by setting a start and end point, entirely in your browser.',
            path: '/audio/trim',
            category: 'MultimediaApplication',
          }),
          faqPageJsonLd(TRIM_FAQS),
        ]}
      />
      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Audio Studio', path: '/audio' },
          { name: 'Trim Audio', path: '/audio/trim' },
        ]}
        title={'Trim Audio Online'}
        description={
          'Cut a clip out of any audio file - set a start and end point, preview it, and download. Fully processed in your browser.'
        }
        features={FEATURES}
      />

      <div className="@container px-5 py-6 sm:px-8 sm:py-8">
        <TrimTool />
      </div>

      <StepList
        title="How it works"
        accentColor="bg-blue-500"
        steps={[
          {
            step: '01',
            title: 'Upload an audio file',
            desc: 'Drag & drop or browse for one file.',
          },
          {
            step: '02',
            title: 'Set start and end points',
            desc: 'Use the sliders, or grab them from the current playback position.',
          },
          {
            step: '03',
            title: 'Trim and download',
            desc: 'Preview the result, then save it.',
          },
        ]}
      />

      <TechnicalNote
        title="How the trimming works"
        accentColor="bg-emerald-500"
        paragraphs={[
          "This tool uses FFmpeg compiled to WebAssembly to cut the selected range without re-encoding the audio - a 'stream copy' operation that's both fast and lossless within the cut region, since no audio data in your selection is touched.",
        ]}
      />

      <FaqAccordion
        title="Frequently asked questions"
        accentColor="bg-blue-500"
        items={TRIM_FAQS}
      />
    </div>
  );
}
