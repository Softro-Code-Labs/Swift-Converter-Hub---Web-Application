import { Metadata } from 'next';
import { Sparkles, Zap, Layers, Crop } from 'lucide-react';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
  faqPageJsonLd,
  howToJsonLd,
} from '@/components/seo/JsonLd';
import {
  ToolPageHeader,
  StepList,
  InfoCardGrid,
  TechnicalNote,
  FaqAccordion,
} from '@/features/shared/components/page-sections';
import RemoveBackgroundTool from '@/features/image/remove-background/components';
import { pageMetadata } from '@/lib/seo';

const PATH = '/image/remove-background';

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: 'Remove Background from Image - Free, No Upload',
  ogTitle: 'Remove Image Background',
  description:
    'Remove the background from photos with AI that runs on your device. Get a transparent PNG, a new colour or a blurred background. No upload, no sign-up.',
  keywords: [
    'remove background from image',
    'background remover',
    'remove bg free',
    'transparent background maker',
    'remove background without upload',
    'ai background remover',
    'cut out image',
    'product photo background remover',
    'make background transparent',
    'remove white background',
    'change photo background colour',
    'blur photo background',
  ],
});

const STEPS = [
  {
    step: '01',
    title: 'Add your photos',
    desc: 'Drop up to 20 JPG, PNG, WebP or AVIF images. The first time, the AI model downloads once (47 MB).',
  },
  {
    step: '02',
    title: 'Let the AI cut them out',
    desc: 'The subject is found automatically - people, pets, products, cars. Drag the slider to compare before and after.',
  },
  {
    step: '03',
    title: 'Pick a background and download',
    desc: 'Keep it transparent, choose a colour, blur the original or use your own image. Save as PNG, WebP or JPG.',
  },
];

const CARDS = [
  {
    title: 'Transparent PNG',
    meta: 'Logos, stickers, design work',
    desc: 'The classic cut-out. Use WebP for a much smaller file that keeps transparency.',
  },
  {
    title: 'Solid colour',
    meta: 'Product shots, ID photos',
    desc: 'White for marketplaces like Amazon and eBay, or any brand colour.',
  },
  {
    title: 'Blurred background',
    meta: 'Portraits, profile photos',
    desc: 'Keeps the original scene but softens it, like a portrait lens.',
  },
  {
    title: 'Your own image',
    meta: 'Composites, thumbnails',
    desc: 'Place the subject on any picture you choose, filled edge to edge.',
  },
];

const FAQS = [
  {
    q: 'Are my photos uploaded to a server?',
    a: "No. The AI model runs inside your browser tab, so your photos never leave your device. The only download is the model itself (about 47 MB, from this website), fetched once and then kept in your browser's cache.",
  },
  {
    q: 'Why does the first image take longer?',
    a: 'The first time, your browser downloads the AI model. After that it starts straight away, even on later visits. Processing takes about a second on computers with WebGPU and around 10-20 seconds on the processor alone, depending on your device.',
  },
  {
    q: 'What kinds of photos work best?',
    a: 'Photos with a clear main subject - a person, animal, product, car or object - in reasonable focus. Very busy scenes, or a subject the same colour as its background, can leave rough edges; the Edges and Feather controls help tidy them.',
  },
  {
    q: 'Is the result full resolution?',
    a: 'Yes, the cut-out is saved at your photo’s original size (very large photos are capped at 16 megapixels so every browser can save them). The preview on screen is a smaller copy for speed.',
  },
  {
    q: 'Can I remove the background from many images at once?',
    a: 'Yes. Add up to 20 images; they are processed one after another, and "Download all" saves them in a ZIP with the same background and format settings.',
  },
  {
    q: 'Which AI model is used?',
    a: 'IS-Net (Dichotomous Image Segmentation), an open model released under the Apache 2.0 licence, running with Microsoft’s ONNX Runtime Web. We store its weights in a compact 8-bit form that produces practically identical cut-outs at a quarter of the size.',
  },
];

export default function RemoveBackgroundPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Image Studio', path: '/image' },
            { name: 'Background Remover', path: PATH },
          ]),
          softwareApplicationJsonLd({
            name: 'Background Remover',
            description:
              'Remove image backgrounds with on-device AI. Transparent PNG, colour, blur or custom backgrounds. No upload.',
            path: PATH,
            category: 'DesignApplication',
          }),
          howToJsonLd({
            name: 'How to remove the background from a photo',
            description:
              'Cut out the subject of a photo in your browser and save it with a transparent or new background.',
            steps: STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(FAQS),
        ]}
      />

      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Image Studio', path: '/image' },
          { name: 'Background Remover', path: PATH },
        ]}
        badges={[{ label: 'AI', color: 'purple' }]}
        title="Remove Background from Image"
        description="Cut out people, pets and products in one click with AI that runs on your device - then keep it transparent or drop in a new background."
        features={[
          { icon: Sparkles, label: 'AI cut-out' },
          { icon: Zap, label: 'WebGPU acceleration' },
          { icon: Layers, label: 'Colour, blur or image background' },
          { icon: Crop, label: 'Crop to subject' },
        ]}
      />

      <div className="@container px-5 py-6 sm:px-8 sm:py-8">
        <RemoveBackgroundTool />
      </div>

      <StepList title="How it works" accentColor="bg-blue-500" steps={STEPS} />

      <InfoCardGrid
        title="Backgrounds for every job"
        accentColor="bg-purple-500"
        columns="grid-cols-1 sm:grid-cols-2"
        cards={CARDS}
      />

      <TechnicalNote
        title="How it works without uploading"
        accentColor="bg-emerald-500"
        paragraphs={[
          'The IS-Net segmentation model runs in a background thread of this tab using ONNX Runtime Web. If your browser supports WebGPU it uses your graphics card; otherwise it runs on the processor with WebAssembly. It looks at a 1024 × 1024 copy of your photo and produces a mask that says, pixel by pixel, how likely each point is to be part of the subject.',
          'That mask is scaled back to your photo’s full resolution and applied with the canvas, where the Edges and Feather controls adjust how hard or soft the boundary is. Your photo is never sent anywhere.',
        ]}
      />

      <FaqAccordion
        title="Frequently asked questions"
        accentColor="bg-blue-500"
        items={FAQS}
      />
    </div>
  );
}
