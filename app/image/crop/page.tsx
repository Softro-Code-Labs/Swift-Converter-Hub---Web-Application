import { Metadata } from 'next';
import { Crop, Shield, Zap, Monitor } from 'lucide-react';
import CropTool from '@/features/image/crop/components';
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
  path: '/image/crop',
  title: 'Crop & Resize Images Online - Exact Pixels or Ratio',
  description:
    'Crop images to 1:1, 16:9, 4:3 or any size, and resize to exact pixel dimensions. Presets for Instagram, YouTube and more. Free and private in your browser.',
  keywords: [
    'crop image online',
    'image cropper online',
    'crop photo online tool',
    'online photo cropper no upload',
    'circular image cropper free',
    'crop image to circle browser',
    'resize image free',
    'image resize tool free',
    'aspect ratio image cropper',
    'square image cropper online',
    'crop photo for social media free',
    'resize image without losing quality',
  ],
});

const FEATURES = [
  {
    icon: Crop,
    label: 'Visual crop editor',
    desc: 'Drag handles with rule-of-thirds grid',
  },
  {
    icon: Monitor,
    label: 'Preset aspect ratios',
    desc: '1:1, 4:3, 16:9, 3:2 and more',
  },
  {
    icon: Zap,
    label: 'Instant processing',
    desc: 'Powered by a professional WebAssembly engine',
  },
  {
    icon: Shield,
    label: '100% private',
    desc: 'Files never leave your browser',
  },
];

const CROP_PRESETS = [
  { title: 'Instagram Post', meta: '1:1 · 1080×1080px', desc: '' },
  { title: 'Instagram Story', meta: '9:16 · 1080×1920px', desc: '' },
  { title: 'YouTube Thumbnail', meta: '16:9 · 1280×720px', desc: '' },
  { title: 'Profile Picture', meta: '1:1 · 512×512px', desc: '' },
  { title: 'Twitter/X Post', meta: '16:9 · 1200×675px', desc: '' },
  { title: 'Facebook Cover', meta: '205:78 · 820×312px', desc: '' },
  { title: 'LinkedIn Banner', meta: '4:1 · 1584×396px', desc: '' },
  { title: 'Print Photo (4×6)', meta: '3:2 · 1800×1200px', desc: '' },
];

const CROP_FAQS = [
  {
    q: 'Will cropping reduce my image quality?',
    a: 'No. Cropping only removes pixels outside your selection - the remaining pixels are untouched. If you also resize to a smaller dimension, some detail is naturally lost, but this is unavoidable with any resizing tool, not specific to ours.',
  },
  {
    q: 'Can I crop to an exact pixel size instead of a ratio?',
    a: 'Yes. Use the X, Y, Width and Height number inputs in the sidebar to enter exact pixel values, or pick one of the Quick Size presets like 1920×1080.',
  },
  {
    q: 'What happens to EXIF data when I crop an image?',
    a: 'Cropping does not preserve EXIF metadata by default, since the image dimensions change. If you need to keep metadata, use the EXIF Metadata Viewer to record it beforehand.',
  },
  {
    q: 'Is there a file size limit?',
    a: "There's no hard limit, but very large images (50MB+) may process more slowly depending on your device's available memory, since everything happens in your browser rather than on a server.",
  },
];

const CROP_STEPS = [
  {
    step: '01',
    title: 'Upload your image',
    desc: 'Drop any image file - PNG, JPG, WebP, HEIC and more.',
  },
  {
    step: '02',
    title: 'Crop or resize',
    desc: 'Drag the crop handles, pick an aspect ratio, or enter exact pixel dimensions.',
  },
  {
    step: '03',
    title: 'Download the result',
    desc: 'Choose your output format and download. Nothing is stored or uploaded.',
  },
];

export default function CropPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Image Studio', path: '/image' },
            { name: 'Crop & Resize', path: '/image/crop' },
          ]),
          softwareApplicationJsonLd({
            name: 'Image Crop & Resize Tool',
            description:
              'Crop and resize images to any dimension or aspect ratio with a visual drag editor, entirely in your browser.',
            path: '/image/crop',
            category: 'MultimediaApplication',
          }),
          howToJsonLd({
            name: 'How to crop and resize an image online',
            description:
              'Visually crop images with drag handles, lock aspect ratios, and resize to any pixel dimension.',
            steps: CROP_STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(CROP_FAQS),
        ]}
      />
      {/* Header */}
      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Image Studio', path: '/image' },
          { name: 'Crop & Resize', path: '/image/crop' },
        ]}
        title={'Crop & Resize Images Online'}
        description={
          'Visually crop images with drag handles, lock aspect ratios, and resize to any pixel dimension - all processed locally in your browser.'
        }
        features={FEATURES}
      />

      {/* Tool */}
      <div className="@container px-5 py-6 sm:px-8 sm:py-8">
        <CropTool />
      </div>

      {/* Info */}
      <StepList
        title="How it works"
        accentColor="bg-blue-500"
        steps={CROP_STEPS}
      />

      <InfoCardGrid
        title="Common crop sizes"
        accentColor="bg-purple-500"
        columns="grid-cols-2 sm:grid-cols-4"
        cards={CROP_PRESETS}
      />

      <TechnicalNote
        title="What happens when you crop"
        accentColor="bg-emerald-500"
        paragraphs={[
          'Your image loads into browser memory and is decoded by a professional-grade image engine compiled to WebAssembly. When you drag the crop handles, the canvas overlay updates in real time without touching the underlying pixels. Only when you click "Apply" does the actual crop operation run - extracting the selected region at full resolution and re-encoding it in your chosen output format.',
          'Resizing uses Lanczos resampling by default, which preserves edge sharpness better than simple bilinear scaling - the same algorithm used by professional desktop image editors.',
        ]}
      />

      <FaqAccordion
        title="Frequently asked questions"
        accentColor="bg-blue-500"
        items={CROP_FAQS}
      />
    </div>
  );
}
