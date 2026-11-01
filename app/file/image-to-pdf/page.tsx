import { Metadata } from 'next';
import { Layers, RotateCw, Ruler, Smartphone } from 'lucide-react';
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
import ImageToPdfTool from '@/features/file/image-to-pdf/components';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/file/image-to-pdf',
  title: 'JPG to PDF - Convert Images to PDF Online Free',
  description:
    'Turn JPG, PNG, HEIC and WebP images into one PDF. Reorder and rotate pages, pick A4, Letter or fit-to-image. Free, no upload, no watermark.',
  keywords: [
    'image to pdf',
    'jpg to pdf',
    'png to pdf',
    'heic to pdf',
    'photos to pdf',
    'convert images to pdf online free',
    'combine images into one pdf',
    'jpg to pdf no upload',
    'scan photos to pdf',
    'iphone photo to pdf',
    'webp to pdf',
    'multiple images to pdf',
  ],
});

const FEATURES = [
  { icon: Layers, label: 'Up to 50 images' },
  { icon: RotateCw, label: 'Reorder and rotate' },
  { icon: Ruler, label: 'A4, Letter or fit' },
  { icon: Smartphone, label: 'iPhone HEIC photos' },
];

const STEPS = [
  {
    step: '01',
    title: 'Add your images',
    desc: 'Drop JPG, PNG, HEIC, WebP, GIF, BMP or AVIF files - up to 50 at once.',
  },
  {
    step: '02',
    title: 'Arrange the pages',
    desc: 'Drag to reorder, rotate any page, and pick page size, orientation and margins.',
  },
  {
    step: '03',
    title: 'Create and download',
    desc: 'Your PDF is built in this tab and saved straight to your device.',
  },
];

const PAGE_SIZE_CARDS = [
  {
    title: 'A4',
    meta: '210 × 297 mm',
    desc: 'The standard paper size almost everywhere outside North America. Best for documents you will print or submit.',
  },
  {
    title: 'Letter',
    meta: '8.5 × 11 in',
    desc: 'The standard in the US and Canada. Pick this if the PDF will be printed there.',
  },
  {
    title: 'Fit image',
    meta: 'One page per image, same size',
    desc: 'No white borders and no scaling - ideal for sharing photos, screenshots or slides.',
  },
];

const FAQS = [
  {
    q: 'Which image formats can I use?',
    a: 'JPG, PNG, HEIC/HEIF (iPhone photos), WebP, GIF, BMP and AVIF. You can mix formats in one PDF. Animated GIFs use their first frame.',
  },
  {
    q: 'Will my photos lose quality?',
    a: 'Not with "Original" quality. JPG and PNG files are placed into the PDF exactly as they are, without re-compressing. Images that need converting or rotating are redrawn at full resolution. Choose "Smaller file" only if you want to trade some quality for a much smaller PDF.',
  },
  {
    q: 'Why are some of my phone photos sideways in other tools but not here?',
    a: 'Phones often save photos sideways and store a note (EXIF orientation) saying which way is up. PDF viewers ignore that note, so this tool reads it and turns the photo upright before adding it.',
  },
  {
    q: 'Is there a limit on how many images I can add?',
    a: 'You can add up to 50 images per PDF. Because everything happens on your device, very large batches of high-resolution photos depend on how much memory your browser has.',
  },
  {
    q: 'Are my images uploaded anywhere?',
    a: 'No. The PDF is assembled inside this browser tab using the pdf-lib library. Your images are never sent to a server.',
  },
];

export default function ImageToPdfPage() {
  return (
    <div>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Document Suite', path: '/file' },
            { name: 'Image to PDF', path: '/file/image-to-pdf' },
          ]),
          softwareApplicationJsonLd({
            name: 'Image to PDF Converter',
            description:
              'Combine JPG, PNG, HEIC and other images into a single PDF, entirely in your browser.',
            path: '/file/image-to-pdf',
            category: 'BusinessApplication',
          }),
          howToJsonLd({
            name: 'How to convert images to a PDF',
            description:
              'Add images, arrange the pages and download a PDF - processed locally in your browser.',
            steps: STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(FAQS),
        ]}
      />
      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Document Suite', path: '/file' },
          { name: 'Image to PDF', path: '/file/image-to-pdf' },
        ]}
        title="Image to PDF"
        description="Turn photos, scans and screenshots into a single PDF. Put the pages in order, rotate any that are sideways, and choose the page size."
        features={FEATURES}
      />

      <div className="@container px-5 py-6 sm:px-8 sm:py-8">
        <ImageToPdfTool />
      </div>

      <StepList title="How it works" steps={STEPS} />

      <InfoCardGrid title="Choosing a page size" cards={PAGE_SIZE_CARDS} />

      <TechnicalNote
        title="How the PDF is built"
        paragraphs={[
          'When an image is already a JPG or PNG and needs no changes, its original bytes are placed straight into the PDF, so there is no quality loss and no re-compression. Other formats (HEIC, WebP, GIF, BMP, AVIF), rotated pages, and photos with an EXIF orientation flag are first drawn onto a canvas at full resolution and saved as PNG or high-quality JPG.',
          'Each page is then sized and the image centred inside your chosen margins. On A4 or Letter pages, large images are scaled down to fit, but small images are never enlarged beyond their natural size, so they stay sharp. Everything runs with pdf-lib inside this tab.',
        ]}
      />

      <FaqAccordion title="Frequently asked questions" items={FAQS} />
    </div>
  );
}
