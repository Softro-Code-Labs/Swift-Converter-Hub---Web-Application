import { Metadata } from 'next';
import { Clapperboard, Shield, Zap, Sparkles } from 'lucide-react';
import ToGifTool from '@/features/video/to-gif/components';
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
  path: '/video/to-gif',
  title: 'Video to GIF Converter - Make GIFs from MP4',
  description:
    'Turn a video clip into an animated GIF. Pick the start, length, frame rate and size, then download. Free, no watermark, made in your browser.',
  keywords: [
    'video to gif converter online',
    'mp4 to gif free',
    'make a gif from video browser',
    'convert video to gif no upload',
    'high quality gif maker online',
    'create gif from clip free',
    'gif maker private browser',
    'video clip to animated gif',
    'mp4 clip to gif maker',
    'looping gif maker online',
    'video snippet to gif free',
    'convert clip to gif no watermark',
  ],
});

const FEATURES = [
  {
    icon: Sparkles,
    label: 'Optimized palette',
    desc: 'Sharper colors than a naive GIF encode',
  },
  {
    icon: Clapperboard,
    label: 'Trim while you convert',
    desc: 'Pick the exact moment',
  },
  { icon: Zap, label: 'FPS & size control', desc: '10-20fps, 320-640px wide' },
  {
    icon: Shield,
    label: '100% private',
    desc: 'Files never leave your browser',
  },
];

const GIF_FAQS = [
  {
    q: 'Why does this look better than other GIF converters?',
    a: 'This tool generates a custom color palette for your specific clip first, then encodes the GIF using that palette - a two-pass technique that avoids the muddy, banded colors you get from a naive single-pass GIF conversion using a generic palette.',
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
    a: 'Yes - use the start/end sliders (or the "Use current position" buttons while previewing) to select exactly the moment you want before creating the GIF.',
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
      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Video Studio', path: '/video' },
          { name: 'Video to GIF', path: '/video/to-gif' },
        ]}
        title={'Video to GIF Converter'}
        description={
          'Turn a clip from any video file into a high-quality animated GIF - pick the range, frame rate, and size, all in your browser.'
        }
        features={FEATURES}
      />

      <div className="@container px-5 py-6 sm:px-8 sm:py-8">
        <ToGifTool />
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
            title: 'Set the range and options',
            desc: 'Start/end time, frame rate, and width.',
          },
          {
            step: '03',
            title: 'Create and download',
            desc: 'Preview the GIF, then save it.',
          },
        ]}
      />

      <TechnicalNote
        title="How this works"
        accentColor="bg-emerald-500"
        paragraphs={[
          'This tool runs FFmpeg compiled to WebAssembly twice: once to generate an optimized color palette for your selected clip, then again to encode the GIF using that palette - the standard technique for high-quality GIF output, all happening directly in your browser tab.',
        ]}
      />

      <FaqAccordion
        title="Frequently asked questions"
        accentColor="bg-purple-500"
        items={GIF_FAQS}
      />
    </div>
  );
}
