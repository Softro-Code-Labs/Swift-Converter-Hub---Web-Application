import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import { Scissors, Zap, Shield, ListOrdered } from 'lucide-react';
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
import PdfSplitTool from '@/features/file/pdf-split/components';

export const metadata: Metadata = {
  title: 'Split PDF Pages',
  description:
    'Extract specific pages, split by custom ranges, or divide a PDF into equal parts - all in your browser. No server, no upload, 100% private. Powered by pdf-lib.',
  keywords: [
    'split pdf online free',
    'extract pdf pages browser',
    'pdf page extractor free',
    'split pdf no upload',
    'pdf splitter browser tool',
    'extract pages from pdf online',
    'pdf split by range',
    'pdf split every n pages',
    'divide pdf into parts online',
    'pdf page extractor tool',
    'separate pdf pages free',
    'pdf splitter no signup',
  ],
  alternates: {
    canonical: `${SITE_URL}/file/pdf-split`,
  },
  openGraph: {
    title:
      'Split PDF Pages - Extract, Range Split & Equal Parts | Document Suite',
    description:
      'Click pages to extract, define named ranges, or split every N pages - all in your browser, nothing uploaded.',
    url: `${SITE_URL}/file/pdf-split`,
    type: 'website',
  },
};

const STEPS = [
  {
    step: '01',
    title: 'Upload a PDF',
    desc: 'Every page renders as a thumbnail you can click through.',
  },
  {
    step: '02',
    title: 'Choose a split mode',
    desc: 'Click pages to extract, define named ranges, or split every N pages.',
  },
  {
    step: '03',
    title: 'Download the result',
    desc: 'Each part downloads as its own separate PDF file.',
  },
];

const MODE_CARDS = [
  {
    title: 'Extract pages',
    desc: 'Click individual page thumbnails to pull out just the ones you need into a single new PDF.',
  },
  {
    title: 'Custom ranges',
    desc: 'Define named parts like "1-3" and "5, 7-9" - each range becomes its own downloadable PDF.',
  },
  {
    title: 'Every N pages',
    desc: 'Automatically divide the document into equal chunks of N pages each.',
  },
];

const FAQS = [
  {
    q: 'What is the difference between "extract" and "ranges" mode?',
    a: 'Extract mode produces one new PDF containing only the pages you click on, in the order the original document has them. Ranges mode lets you define several named groups at once (like "Part 1: pages 1-3" and "Part 2: pages 5-9") and produces a separate downloadable PDF for each group in a single pass.',
  },
  {
    q: 'Can I select non-consecutive pages?',
    a: 'Yes - both the range syntax (e.g. "1-3, 5, 7-9") and clicking individual thumbnails support picking any combination of pages, consecutive or not.',
  },
  {
    q: 'Does splitting affect the quality of the pages?',
    a: "No - pages are copied directly from the source document at the byte level using pdf-lib's page-copying, not re-rendered as images, so text stays selectable and image quality is unchanged.",
  },
  {
    q: 'What happens if my range includes an invalid page number?',
    a: 'The tool validates your range string before splitting and flags an invalid or out-of-bounds page number rather than silently ignoring or misinterpreting it.',
  },
  {
    q: 'Is my PDF uploaded anywhere?',
    a: 'No. Reading the file, rendering thumbnails, and extracting pages all happen locally in your browser - nothing is transmitted to a server.',
  },
];

export default function PdfSplitPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Document Suite', path: '/file' },
            { name: 'Split PDF Pages', path: '/file/pdf-split' },
          ]),
          softwareApplicationJsonLd({
            name: 'Split PDF Pages',
            description:
              'Extract specific pages, split by custom ranges, or divide a PDF into equal parts - all in your browser. No server, no upload, 100% private. Powered by pdf-lib.',
            path: '/file/pdf-split',
            category: 'BusinessApplication',
          }),
          howToJsonLd({
            name: 'How to split a PDF online',
            description:
              'Extract pages, split by range, or divide a PDF into equal parts.',
            steps: STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(FAQS),
        ]}
      />

      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Document Suite', path: '/file' },
          { name: 'Split PDF Pages', path: '/file/pdf-split' },
        ]}
        badges={[{ label: 'SPLIT', color: 'blue' }]}
        title="Split & Extract PDF Pages"
        description="Extract specific pages by clicking them, split by custom named ranges, or divide a PDF into equal parts of N pages each."
        features={[
          { icon: Shield, label: '100% private' },
          { icon: Zap, label: 'No quality loss' },
          { icon: Scissors, label: '3 split modes' },
          { icon: ListOrdered, label: 'Custom page ranges' },
        ]}
      />

      <div className="px-6 py-6">
        <PdfSplitTool />
      </div>

      <StepList title="How it works" accentColor="bg-blue-500" steps={STEPS} />

      <InfoCardGrid
        title="Split modes"
        accentColor="bg-purple-500"
        columns="grid-cols-1 sm:grid-cols-3"
        cards={MODE_CARDS}
      />

      <TechnicalNote
        title="How splitting works"
        accentColor="bg-emerald-500"
        paragraphs={[
          "For each part you define - whether from clicking pages, a named range, or an automatic every-N-pages split - this tool creates a brand-new PDF document with pdf-lib and copies only the selected pages into it directly from the source file's underlying content. Because it copies rather than re-renders, text, embedded fonts, and images keep their original quality in every resulting file.",
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
