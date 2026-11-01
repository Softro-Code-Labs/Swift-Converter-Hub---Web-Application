import { Metadata } from 'next';
import { Scissors, Shield, Zap, Gauge } from 'lucide-react';
import TrimTool from '@/features/video/trim/components';
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
  path: '/video/trim',
  title: 'Trim Video Online - Cut MP4 Clips Free',
  description:
    'Cut a clip from MP4, MOV, WebM or any video. Set start and end points, preview, and download. Free, no watermark - your video never leaves your device.',
  keywords: [
    'trim video online free',
    'cut mp4 online browser',
    'video clip cutter free',
    'crop video file online',
    'mp4 trimmer no upload',
    'cut video clip browser',
    'trim mov file online',
    'video cutter private',
    'video trimmer no signup',
    'cut video clip free online',
    'shorten video file online',
    'extract video segment online',
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
  { icon: Zap, label: 'Live preview', desc: 'Scrub to find your moments' },
  {
    icon: Shield,
    label: '100% private',
    desc: 'Files never leave your browser',
  },
];

const TRIM_FAQS = [
  {
    q: 'Does trimming reduce video quality?',
    a: 'Barely. The video is re-encoded at high quality so the cut lands exactly on the frame you picked - a plain stream copy can only cut at keyframes, which often leaves a frozen or broken first second. The audio is copied untouched.',
  },
  {
    q: 'Can I preview my selection before trimming?',
    a: 'Yes - use the video player to find the moments you want, then use the "Use current position" buttons to set the start and end points from wherever playback currently is.',
  },
  {
    q: 'Is there a limit on file length or size?',
    a: "No hard limit is imposed by this tool, since files never leave your device - very large files are bounded only by your browser's available memory.",
  },
  {
    q: 'What format will my trimmed file be?',
    a: 'The same format as your original file - trimming an MP4 produces an MP4, trimming a MOV produces a MOV, and so on. Use the Format Converter first if you also want to change formats.',
  },
];

export default function VideoTrimPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Video Studio', path: '/video' },
            { name: 'Trim Video', path: '/video/trim' },
          ]),
          softwareApplicationJsonLd({
            name: 'Video Trimmer',
            description:
              'Cut a clip from a video file by setting a start and end point, entirely in your browser.',
            path: '/video/trim',
            category: 'MultimediaApplication',
          }),
          faqPageJsonLd(TRIM_FAQS),
        ]}
      />
      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Video Studio', path: '/video' },
          { name: 'Trim Video', path: '/video/trim' },
        ]}
        title={'Trim Video Online'}
        description={
          'Cut a clip out of any video file - set a start and end point, preview it, and download. Fully processed in your browser.'
        }
        features={FEATURES}
      />

      <div className="@container px-5 py-6 sm:px-8 sm:py-8">
        <TrimTool />
      </div>

      <StepList
        title="How it works"
        accentColor="bg-purple-500"
        steps={[
          {
            step: '01',
            title: 'Upload a video file',
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
          "For MP4, MOV, MKV and WebM, the cut is made with your device's hardware video engine (the GPU's encoder, via the browser's WebCodecs API) - usually several times faster than a software encoder. Other formats, and browsers without WebCodecs, use FFmpeg compiled to WebAssembly. Either way the video is re-encoded from the exact start frame, so playback starts cleanly, and the audio is copied as-is.",
        ]}
      />

      <FaqAccordion
        title="Frequently asked questions"
        accentColor="bg-purple-500"
        items={TRIM_FAQS}
      />
    </div>
  );
}
