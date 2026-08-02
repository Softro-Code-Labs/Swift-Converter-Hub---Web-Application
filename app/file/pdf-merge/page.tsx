import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import { FilesIcon, Zap, Shield, GripVertical } from 'lucide-react';
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
import PdfMergeTool from '@/features/file/pdf-merge/components';

export const metadata: Metadata = {
  title: 'Merge PDF Files',
  description:
    'Combine multiple PDF files into a single document in your browser. Drag to reorder pages before merging - no server, no upload, 100% private. Powered by pdf-lib.',
  keywords: [
    'merge pdf online free',
    'combine pdf files browser',
    'join pdf documents online',
    'pdf merger no upload',
    'pdf merge tool free',
    'combine multiple pdfs browser',
    'pdf joiner online free',
    'merge pdf files instantly',
    'combine pdf documents free',
    'pdf lib merge tool',
    'reorder pdf pages before merge',
    'append pdf files online',
  ],
  alternates: {
    canonical: `${SITE_URL}/file/pdf-merge`,
  },
  openGraph: {
    title: 'Merge PDF Files - Drag to Reorder & Combine | Document Suite',
    description:
      'Combine multiple PDFs into one. Drag to reorder, see page counts and thumbnails - processed in your browser, nothing uploaded.',
    url: `${SITE_URL}/file/pdf-merge`,
    type: 'website',
  },
};

const STEPS = [
  {
    step: '01',
    title: 'Add your PDF files',
    desc: 'Drag & drop or browse for as many files as you need to combine.',
  },
  {
    step: '02',
    title: 'Drag to reorder',
    desc: 'Each file shows a thumbnail and page count - rearrange them into the order you want.',
  },
  {
    step: '03',
    title: 'Merge and download',
    desc: 'Get a single combined PDF with every page in the order you set.',
  },
];

const FAQS = [
  {
    q: 'Does merging preserve the quality of the original PDFs?',
    a: "Yes - pages are copied directly from each source document into a new one at the byte level, rather than being rasterized or re-rendered as images. Text stays selectable, embedded fonts and images stay at full resolution, and vector graphics stay sharp.",
  },
  {
    q: 'Is there a limit on how many files I can merge?',
    a: "No hard limit is imposed by this tool - since everything happens in your browser's memory, the practical limit is how much memory your device has available for very large or numerous files, not a server-side restriction.",
  },
  {
    q: 'Can I merge password-protected PDFs?',
    a: "Not directly - an encrypted PDF needs to be unlocked first (in a PDF reader that supports removing its password) before this tool can read and copy its pages.",
  },
  {
    q: 'What order will the merged pages be in?',
    a: 'Exactly the order you arrange the file cards in before merging - drag a file up or down in the list, and its pages move with it. Within each file, the original page order is always preserved.',
  },
  {
    q: 'Are my PDFs uploaded to a server?',
    a: 'No. Every file is read, combined, and reassembled locally in your browser using pdf-lib - none of your documents are ever transmitted anywhere.',
  },
];

export default function PdfMergePage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Document Suite', path: '/file' },
            { name: 'Merge PDF Files', path: '/file/pdf-merge' },
          ]),
          softwareApplicationJsonLd({
            name: 'Merge PDF Files',
            description:
              'Combine multiple PDF files into a single document in your browser. Drag to reorder pages before merging - no server, no upload, 100% private. Powered by pdf-lib.',
            path: '/file/pdf-merge',
            category: 'BusinessApplication',
          }),
          howToJsonLd({
            name: 'How to merge PDF files online',
            description:
              'Combine multiple PDFs into one document, in a custom order.',
            steps: STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(FAQS),
        ]}
      />

      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Document Suite', path: '/file' },
          { name: 'Merge PDF Files', path: '/file/pdf-merge' },
        ]}
        badges={[{ label: 'MERGE', color: 'blue' }]}
        title="Merge PDF Files Online"
        description="Combine multiple PDF files into a single document - drag to reorder before merging, with thumbnails and page counts for every file."
        features={[
          { icon: Shield, label: '100% private' },
          { icon: Zap, label: 'No file limit' },
          { icon: FilesIcon, label: 'Any number of PDFs' },
          { icon: GripVertical, label: 'Drag to reorder' },
        ]}
      />

      <div className="px-6 py-6">
        <PdfMergeTool />
      </div>

      <StepList title="How it works" accentColor="bg-blue-500" steps={STEPS} />

      <TechnicalNote
        title="How the merge works"
        accentColor="bg-emerald-500"
        paragraphs={[
          "This tool uses pdf-lib, a JavaScript PDF library, to create a brand-new empty document and then copy every page from each of your source files directly into it in the order you specify. Because copyPages transfers the underlying page content (text, fonts, images, and vector graphics) rather than rendering pages to flat images, the merged file keeps the same quality and selectable text as the originals.",
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
