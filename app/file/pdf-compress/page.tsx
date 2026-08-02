import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import { FileArchive, Zap, Shield, Image as ImageIcon } from 'lucide-react';
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
import PdfCompressTool from '@/features/file/pdf-compress/components';

export const metadata: Metadata = {
  title: 'Compress PDF',
  description:
    'Reduce PDF file size by recompressing embedded photos and scans, plus stripping metadata, annotations, and bookmarks - three compression levels, all in your browser. No server, no upload, 100% private.',
  keywords: [
    'compress pdf online free',
    'reduce pdf size browser',
    'pdf compressor no upload',
    'pdf size reducer online',
    'compress pdf file free',
    'pdf optimizer browser',
    'pdf compression tool online',
    'reduce pdf file size free',
    'shrink pdf file online',
    'reduce pdf for email free',
    'pdf metadata remover online',
    'pdf size optimizer free',
    'compress pdf with images',
    'compress scanned pdf online',
    'reduce pdf photo size',
  ],
  alternates: {
    canonical: `${SITE_URL}/file/pdf-compress`,
  },
  openGraph: {
    title:
      'Compress PDF - Recompresses Images, Three Levels | Document Suite',
    description:
      'Light, balanced, or maximum compression - recompresses embedded JPEG photos/scans and strips metadata. Instant size comparison, nothing uploaded.',
    url: `${SITE_URL}/file/pdf-compress`,
    type: 'website',
  },
};

const STEPS = [
  {
    step: '01',
    title: 'Upload a PDF',
    desc: 'Works best on PDFs containing photos or scanned pages.',
  },
  {
    step: '02',
    title: 'Pick a compression level',
    desc: 'Light, Balanced, or Maximum - each trades off quality against file size differently.',
  },
  {
    step: '03',
    title: 'Compare and download',
    desc: 'See the original vs. compressed size before saving.',
  },
];

const LEVEL_CARDS = [
  {
    title: 'Light',
    meta: '85% quality · 2000px max',
    desc: 'Visually lossless re-encode - safest for photos and scans, keeps all metadata.',
  },
  {
    title: 'Balanced',
    meta: '72% quality · 1600px max',
    desc: 'Recompresses images and strips metadata - good default for most documents.',
  },
  {
    title: 'Maximum',
    meta: '50% quality · 1200px max',
    desc: 'Smallest file size - strips metadata, annotations, bookmarks, and attachments too.',
  },
];

const FAQS = [
  {
    q: 'Why did my PDF barely shrink at all?',
    a: "Compression here works by recompressing embedded raster images (photos and scanned pages) - if your PDF is mostly text and vector graphics with few or no images, there's little for this tool to reduce, since text content is already extremely compact and isn't touched.",
  },
  {
    q: "What's the actual difference between the three levels?",
    a: 'Light re-encodes images at 85% JPEG quality with a 2000px maximum dimension and keeps all metadata - safest for preserving visual quality. Balanced drops to 72% quality, a 1600px cap, and strips metadata. Maximum drops to 50% quality, a 1200px cap, and also strips annotations, bookmarks, and file attachments - producing the smallest file at the most visible quality cost.',
  },
  {
    q: 'What does "strip metadata" actually remove?',
    a: "Document properties like author name, creation software, and edit history embedded in the PDF's info dictionary - things that don't affect how the document looks or reads, but do add a small amount of file size and can leak information you may not want to share externally.",
  },
  {
    q: 'Will this affect text quality or selectability?',
    a: 'No - text, fonts, and vector graphics are left completely untouched. Only embedded raster images (photos, scanned pages) are recompressed; nothing about the text layer changes.',
  },
  {
    q: 'Is my PDF uploaded to a server to be compressed?',
    a: 'No. Every step - reading the file, recompressing images on an in-memory canvas, and rebuilding the PDF - happens locally in your browser using pdf-lib. Nothing is uploaded.',
  },
];

export default function PdfCompressPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Document Suite', path: '/file' },
            { name: 'Compress PDF', path: '/file/pdf-compress' },
          ]),
          softwareApplicationJsonLd({
            name: 'Compress PDF',
            description:
              'Reduce PDF file size by recompressing embedded photos and scans, plus stripping metadata, annotations, bookmarks, and attachments - three compression levels, all in your browser. No server, no upload, 100% private.',
            path: '/file/pdf-compress',
            category: 'BusinessApplication',
          }),
          howToJsonLd({
            name: 'How to compress a PDF online',
            description:
              'Reduce PDF file size by recompressing embedded images at three levels.',
            steps: STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(FAQS),
        ]}
      />

      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Document Suite', path: '/file' },
          { name: 'Compress PDF', path: '/file/pdf-compress' },
        ]}
        badges={[{ label: 'COMPRESS', color: 'blue' }]}
        title="Compress a PDF Online"
        description="Reduce PDF file size by recompressing embedded photos and scans, with three levels to choose from - from visually lossless to maximum reduction."
        features={[
          { icon: Shield, label: '100% private' },
          { icon: Zap, label: 'Instant, in-browser' },
          { icon: ImageIcon, label: 'Recompresses images' },
          { icon: FileArchive, label: '3 compression levels' },
        ]}
      />

      <div className="px-6 py-6">
        <PdfCompressTool />
      </div>

      <StepList title="How it works" accentColor="bg-blue-500" steps={STEPS} />

      <InfoCardGrid
        title="Compression levels"
        accentColor="bg-purple-500"
        columns="grid-cols-1 sm:grid-cols-3"
        cards={LEVEL_CARDS}
      />

      <TechnicalNote
        title="How compression works"
        accentColor="bg-emerald-500"
        paragraphs={[
          "This tool finds every embedded raster image inside the PDF, draws each one onto an in-memory canvas, and re-encodes it as a JPEG at the quality and maximum dimension your chosen level specifies - this is where nearly all of the file size reduction comes from for photo-heavy or scanned documents. Depending on the level, it also strips the document's metadata dictionary, annotations, bookmarks, and embedded attachments, and re-saves the PDF using object streams (a more compact way of storing a PDF's internal structure) via pdf-lib.",
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
