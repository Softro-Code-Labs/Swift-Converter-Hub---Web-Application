import { Metadata } from 'next';
import { Minimize2, Shield, Zap, TrendingDown } from 'lucide-react';
import CompressTool from '@/features/image/compress/components';
import {
  StepList,
  InfoCardGrid,
  TechnicalNote,
  FaqAccordion,
  ToolPageHeader,
} from '@/features/image/shared/components/page-sections';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
  faqPageJsonLd,
  howToJsonLd,
} from '@/components/seo/JsonLd';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/image/compress',
  title: 'Compress Images Online - Reduce JPG, PNG & WebP Size',
  description:
    'Make JPG, PNG and WebP images smaller without visible quality loss. Batch compress up to 20 images and see the savings. Free, no upload, no watermark.',
  keywords: [
    'compress image online',
    'reduce image file size',
    'jpg compressor online',
    'png compressor free',
    'shrink photo size online',
    'webp compression tool free',
    'batch image compression tool',
    'bulk image optimizer online',
    'compress photo for web online',
    'no watermark image compressor',
    'lossless image compressor free',
    'reduce jpg size online',
  ],
});

const FEATURES = [
  {
    icon: Minimize2,
    label: 'Smart compression',
    desc: 'Quality-aware size reduction',
  },
  {
    icon: TrendingDown,
    label: 'Live savings preview',
    desc: 'See size reduction per file',
  },
  { icon: Zap, label: 'Batch processing', desc: 'Compress up to 20 at once' },
  {
    icon: Shield,
    label: '100% private',
    desc: 'Files never leave your browser',
  },
];

const QUALITY_PRESETS = [
  {
    title: 'High Quality',
    meta: '~90% quality',
    desc: 'Photography portfolios, print, archival storage',
    highlight: '~20-40% smaller',
  },
  {
    title: 'Balanced',
    meta: '~75% quality',
    desc: 'Websites, blogs, social media, general use',
    highlight: '~50-65% smaller',
  },
  {
    title: 'Aggressive',
    meta: '~50% quality',
    desc: 'Thumbnails, email attachments, fast-loading pages',
    highlight: '~70-85% smaller',
  },
];

const COMPRESS_FAQS = [
  {
    q: "What's the difference between compression and resizing?",
    a: 'Compression reduces file size by changing how pixel data is encoded, keeping the same dimensions. Resizing changes the actual pixel dimensions. This tool only compresses - use the Crop & Resize tool if you also want to change dimensions.',
  },
  {
    q: 'Will compressing a PNG actually reduce its size?',
    a: 'Yes, though PNG compression is lossless by default so savings are more modest (10-30%) compared to JPEG/WebP. For maximum size reduction on photos, consider converting to WebP using the Format Converter first.',
  },
  {
    q: 'Can I compress the same image multiple times?',
    a: 'You can, but each round of lossy compression (JPEG, WebP) introduces additional quality loss. For best results, always compress from the original source file rather than re-compressing an already-compressed output.',
  },
  {
    q: 'What does "strip metadata" actually remove?',
    a: "It removes EXIF camera data, GPS coordinates, ICC color profiles, and any embedded thumbnails - data that adds file size but isn't visible in the image itself. The visual pixels are completely unaffected.",
  },
  {
    q: 'Why is my compressed file barely smaller?',
    a: "If the image was already heavily compressed (e.g. a JPEG re-saved from a low-quality source), there isn't much redundant data left to remove. Try the Aggressive preset, or convert to WebP for better compression efficiency.",
  },
];

const COMPRESS_STEPS = [
  {
    step: '01',
    title: 'Upload images',
    desc: 'Drop up to 20 images at once.',
  },
  {
    step: '02',
    title: 'Choose quality',
    desc: 'Pick a preset or set a custom quality level.',
  },
  {
    step: '03',
    title: 'Download savings',
    desc: 'Get individually compressed files or a ZIP bundle.',
  },
];

export default function CompressPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Image Studio', path: '/image' },
            { name: 'Compress & Optimize', path: '/image/compress' },
          ]),
          softwareApplicationJsonLd({
            name: 'Image Compressor',
            description:
              'Shrink image file size without losing visual quality, entirely in your browser.',
            path: '/image/compress',
            category: 'MultimediaApplication',
          }),
          howToJsonLd({
            name: 'How to compress an image online',
            description:
              'Reduce image file size with adjustable quality presets - all processed locally in your browser.',
            steps: COMPRESS_STEPS.map((s) => ({
              title: s.title,
              desc: s.desc,
            })),
          }),
          faqPageJsonLd(COMPRESS_FAQS),
        ]}
      />
      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Image Studio', path: '/image' },
          { name: 'Compress & Optimize', path: '/image/compress' },
        ]}
        title={'Compress & Optimize Images'}
        description={
          'Reduce image file size with adjustable quality presets, metadata stripping, and live before/after savings - all processed locally in your browser.'
        }
        features={FEATURES}
      />

      <div className="@container px-5 py-6 sm:px-8 sm:py-8">
        <CompressTool />
      </div>

      <StepList
        title="How it works"
        accentColor="bg-blue-500"
        steps={COMPRESS_STEPS}
      />

      <InfoCardGrid
        title="Choosing a quality preset"
        accentColor="bg-amber-500"
        columns="grid-cols-1 sm:grid-cols-3"
        cards={QUALITY_PRESETS}
      />

      <TechnicalNote
        title="How the compression works"
        accentColor="bg-emerald-500"
        paragraphs={[
          'Compression happens in two steps. First, metadata stripping removes EXIF data, GPS tags, and embedded color profiles - this alone often saves 5-15% with zero visual impact. Second, the quality slider controls the level of lossy compression applied during re-encoding, using the same JPEG/WebP quantization algorithms found in desktop editors like Photoshop.',
          "Because everything runs through a professional-grade image engine compiled to WebAssembly, the compression engine is identical to what you'd get running premium editing software locally on a desktop - it just runs inside your browser tab instead.",
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
