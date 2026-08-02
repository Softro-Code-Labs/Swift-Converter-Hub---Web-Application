import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import { RotateCw, Zap, Shield, Grid3x3 } from 'lucide-react';
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
  TechnicalNote,
  FaqAccordion,
} from '@/features/shared/components/page-sections';
import PdfRotateTool from '@/features/file/pdf-rotate/components';

export const metadata: Metadata = {
  title: 'PDF Page Rotator',
  description:
    'Rotate individual PDF pages or all pages at once - 90°, 180°, or 270°. Visual page grid with live rotation preview. No server, no upload, 100% private. Powered by pdf-lib.',
  keywords: [
    'rotate pdf pages online',
    'pdf page rotator free',
    'rotate pdf online no upload',
    'pdf rotate 90 degrees',
    'pdf rotate 180 degrees',
    'pdf rotate individual pages',
    'pdf page orientation fix',
    'rotate pdf browser tool',
    'fix pdf orientation online',
    'rotate single pdf page',
    'pdf landscape to portrait',
    'pdf rotate tool free',
  ],
  alternates: {
    canonical: `${SITE_URL}/file/pdf-rotate`,
  },
  openGraph: {
    title: 'PDF Page Rotator - Rotate Individual or All Pages | Document Suite',
    description:
      'Visual page grid - hover to rotate individual pages or rotate all at once. 90°, 180°, 270° support. Nothing uploaded.',
    url: `${SITE_URL}/file/pdf-rotate`,
    type: 'website',
  },
};

const STEPS = [
  {
    step: '01',
    title: 'Upload a PDF',
    desc: 'Every page renders as a thumbnail in a visual grid.',
  },
  {
    step: '02',
    title: 'Rotate pages',
    desc: 'Click a single page to rotate just that one, or rotate every page at once.',
  },
  {
    step: '03',
    title: 'Save the result',
    desc: 'Download the PDF with the new page orientations applied.',
  },
];

const FAQS = [
  {
    q: 'Can I rotate just one page, or does it apply to the whole document?',
    a: 'Both - click an individual page thumbnail to rotate only that page (useful for a document with one page scanned sideways), or use the rotate-all control to turn every page at once.',
  },
  {
    q: 'Does rotating a page re-render its content?',
    a: "No - this tool sets each page's rotation attribute in the PDF's page metadata, the same field PDF viewers already read to decide how to display a page. The underlying content (text, images, vectors) is never re-rendered, redrawn, or recompressed, so there's no quality loss.",
  },
  {
    q: 'What rotation angles are supported?',
    a: '90° and 270° (which is the same as -90°, i.e. a quarter turn the other way), and 180°. You can rotate a page multiple times to reach any of these four orientations.',
  },
  {
    q: 'Will this fix a page that was scanned upside down?',
    a: 'Yes - a 180° rotation on that specific page turns it right-side up without affecting the rest of the document.',
  },
  {
    q: 'Is my PDF uploaded to a server?',
    a: 'No. Rendering the preview thumbnails and applying rotations both happen locally in your browser using pdf-lib - nothing is transmitted anywhere.',
  },
];

export default function PdfRotatePage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Document Suite', path: '/file' },
            { name: 'PDF Page Rotator', path: '/file/pdf-rotate' },
          ]),
          softwareApplicationJsonLd({
            name: 'PDF Page Rotator',
            description:
              'Rotate individual PDF pages or all pages at once - 90°, 180°, or 270°. Visual page grid with live rotation preview. No server, no upload, 100% private. Powered by pdf-lib.',
            path: '/file/pdf-rotate',
            category: 'BusinessApplication',
          }),
          howToJsonLd({
            name: 'How to rotate PDF pages online',
            description:
              'Rotate individual pages or all pages in a PDF by 90, 180, or 270 degrees.',
            steps: STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(FAQS),
        ]}
      />

      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Document Suite', path: '/file' },
          { name: 'PDF Page Rotator', path: '/file/pdf-rotate' },
        ]}
        badges={[{ label: 'ROTATE', color: 'blue' }]}
        title="Rotate PDF Pages Online"
        description="Rotate individual pages or the whole document by 90°, 180°, or 270° - a visual page grid shows every page so you can fix orientation exactly where it's needed."
        features={[
          { icon: Shield, label: '100% private' },
          { icon: Zap, label: 'No quality loss' },
          { icon: RotateCw, label: '90° / 180° / 270°' },
          { icon: Grid3x3, label: 'Visual page grid' },
        ]}
      />

      <div className="px-6 py-6">
        <PdfRotateTool />
      </div>

      <StepList title="How it works" accentColor="bg-blue-500" steps={STEPS} />

      <TechnicalNote
        title="How rotation works"
        accentColor="bg-emerald-500"
        paragraphs={[
          "Each PDF page carries its own rotation attribute as part of its page metadata - the same attribute every PDF viewer already reads to decide how to display that page. This tool reads each page's current rotation with pdf-lib, lets you adjust it in 90° increments per page or across the whole document, and writes the updated value back when you save. Because only that attribute changes, the underlying page content is never re-rendered or recompressed.",
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
