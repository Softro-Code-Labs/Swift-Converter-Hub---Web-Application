import { Metadata } from 'next';
import { Minimize2, Shield, Zap, TrendingDown } from 'lucide-react';
import CompressTool from '@/features/video/compress/components';
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
  path: '/video/compress',
  title: 'Compress Video Online - Reduce MP4 File Size',
  description:
    'Make MP4, MOV and other videos smaller with quality presets and a resolution cap. Free, no watermark, no upload - compression runs in your browser.',
  keywords: [
    'compress video online',
    'reduce video file size',
    'mp4 compressor online free',
    'shrink video file browser',
    'batch video compression tool',
    'lower video resolution online',
    'browser video compressor no upload',
    'compress video for email free',
    'shrink mp4 for email free',
    'video compressor no signup',
    'reduce 4k video size online',
    'video bitrate reducer free',
  ],
});

const FEATURES = [
  {
    icon: Minimize2,
    label: 'Quality presets',
    desc: 'Small, balanced, or high quality',
  },
  {
    icon: TrendingDown,
    label: 'Never upscales',
    desc: "Smaller videos aren't stretched",
  },
  { icon: Zap, label: 'Batch processing', desc: 'Compress up to 5 at once' },
  {
    icon: Shield,
    label: '100% private',
    desc: 'Files never leave your browser',
  },
];

const COMPRESS_FAQS = [
  {
    q: 'Why does the output always come out as MP4?',
    a: 'MP4 (H.264) is the most universally playable format across devices and platforms, so compression always targets it regardless of your source format - this keeps the size/quality trade-off predictable rather than also changing the container.',
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
      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Video Studio', path: '/video' },
          { name: 'Compress Video', path: '/video/compress' },
        ]}
        title={'Compress Video Files'}
        description={
          'Shrink video file size with a resolution cap and quality preset - batch process up to 5 files, all processed locally in your browser.'
        }
        features={FEATURES}
      />

      <div className="@container px-5 py-6 sm:px-8 sm:py-8">
        <CompressTool />
      </div>

      <StepList
        title="How it works"
        accentColor="bg-purple-500"
        steps={[
          {
            step: '01',
            title: 'Upload video files',
            desc: 'Drop up to 5 files at once.',
          },
          {
            step: '02',
            title: 'Choose a quality preset',
            desc: 'Small, balanced, or high quality.',
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
          "Compression re-encodes to H.264 MP4. Where your browser supports it, this runs on your device's hardware video encoder (via WebCodecs), which is several times faster; otherwise FFmpeg compiled to WebAssembly does it on the CPU. Both aim at the same size budget, set from the source file's own bitrate so the result is always smaller. The resolution cap uses a \"scale down, never up\" filter, so smaller source videos aren't artificially stretched to match the target.",
        ]}
      />

      <FaqAccordion
        title="Frequently asked questions"
        accentColor="bg-purple-500"
        items={COMPRESS_FAQS}
      />
    </div>
  );
}
