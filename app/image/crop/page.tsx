import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import Link from 'next/link';
import { Crop, Shield, Zap, Monitor } from 'lucide-react';
import CropTool from '@/features/image/crop/components';
import {
  StepList,
  InfoCardGrid,
  TechnicalNote,
  FaqAccordion,
} from '@/features/image/shared/components/page-sections';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
  faqPageJsonLd,
  howToJsonLd,
} from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Image Crop & Resize',
  description:
    'Crop and resize images to any dimension or aspect ratio with a visual drag editor. Works 100% in your browser - no uploads, no account required.',
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
  alternates: { canonical: `${SITE_URL}/image/crop` },
  openGraph: {
    title: 'Image Crop & Resize - Free Online Tool | Image Studio',
    description:
      'Crop to any ratio or resize to exact pixel dimensions, processed locally.',
    url: `${SITE_URL}/image/crop`,
    type: 'website',
  },
};

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
            href="/image"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Image Studio
          </Link>
          <span>›</span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            Crop & Resize
          </span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-black">
                CROP
              </span>
              <span className="text-slate-300 dark:text-slate-600">+</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-black">
                RESIZE
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Crop & Resize Images Online
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Visually crop images with drag handles, lock aspect ratios, and
              resize to any pixel dimension - all processed locally in your
              browser.
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

        <div className="flex sm:hidden gap-2 mt-4 overflow-x-auto pb-1">
          {FEATURES.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 shrink-0 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-semibold text-slate-600 dark:text-slate-400"
            >
              <Icon className="w-3 h-3 text-blue-500" />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Tool */}
      <div className="px-6 py-6">
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
