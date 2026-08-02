import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import { FileText, Zap, Shield, Heading } from 'lucide-react';
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
import PdfToWordTool from '@/features/file/pdf-to-word/components';
import { PDF_TO_WORD_FAQS } from '@/features/file/pdf-to-word/config/faqs';

export const metadata: Metadata = {
  title: 'PDF to Word Converter',
  description:
    'Convert a PDF to an editable Word (.docx) document instantly in your browser. Automatic paragraph and heading detection, no uploads, no account, 100% private.',
  keywords: [
    'pdf to word converter',
    'convert pdf to word online free',
    'pdf to docx converter',
    'pdf to word no upload',
    'editable pdf converter online',
    'pdf to word converter browser',
    'convert pdf to editable word document',
    'pdf to word converter no signup',
    'free pdf to word converter',
    'pdf to word converter private',
    'extract text from pdf to word',
    'pdf to microsoft word converter',
  ],
  alternates: {
    canonical: `${SITE_URL}/file/pdf-to-word`,
  },
  openGraph: {
    title: 'PDF to Word Converter - Editable .docx, No Upload | Document Suite',
    description:
      'Reflow a PDF into an editable Word document with automatic heading and paragraph detection - instant, private, no server.',
    url: `${SITE_URL}/file/pdf-to-word`,
    type: 'website',
  },
};

const STEPS = [
  {
    step: '01',
    title: 'Upload a PDF',
    desc: 'Works on PDFs with a real, selectable text layer.',
  },
  {
    step: '02',
    title: 'Text is analyzed and reflowed',
    desc: 'Font sizes and spacing are used to detect headings and paragraph breaks automatically.',
  },
  {
    step: '03',
    title: 'Download the .docx',
    desc: 'Open it directly in Word, Google Docs, or any compatible editor.',
  },
];

export default function PdfToWordPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Document Suite', path: '/file' },
            { name: 'PDF to Word Converter', path: '/file/pdf-to-word' },
          ]),
          softwareApplicationJsonLd({
            name: 'PDF to Word Converter',
            description:
              'Convert a PDF to an editable Word (.docx) document with automatic paragraph and heading detection, entirely in your browser.',
            path: '/file/pdf-to-word',
            category: 'BusinessApplication',
          }),
          howToJsonLd({
            name: 'How to convert a PDF to Word online',
            description:
              'Convert a PDF into an editable Word document with automatic heading detection.',
            steps: STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(PDF_TO_WORD_FAQS),
        ]}
      />

      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Document Suite', path: '/file' },
          { name: 'PDF to Word Converter', path: '/file/pdf-to-word' },
        ]}
        badges={[{ label: 'PDF → WORD', color: 'blue' }]}
        title="Convert PDF to an Editable Word Document"
        description="Reflow a PDF's text into an editable .docx file with automatic paragraph and heading detection - no uploads, entirely in your browser."
        features={[
          { icon: Shield, label: '100% private' },
          { icon: Zap, label: 'Instant, in-browser' },
          { icon: FileText, label: 'Real .docx output' },
          { icon: Heading, label: 'Auto heading detection' },
        ]}
      />

      <div className="px-6 py-6">
        <PdfToWordTool />
      </div>

      <StepList title="How it works" accentColor="bg-blue-500" steps={STEPS} />

      <TechnicalNote
        title="How the conversion works"
        accentColor="bg-emerald-500"
        paragraphs={[
          "This tool reads your PDF with pdf.js, extracting every text run along with its exact position and font size. It determines the document's most common font size (weighted by how much text uses it) as a baseline for body text, then flags noticeably larger runs as probable headings. Lines are merged into paragraphs based on the vertical gap between them - a small gap means the same paragraph continues, a larger one signals a new paragraph - and bold or italic runs are detected from the font's own style information.",
          'The resulting structure - headings, paragraphs, and basic text formatting - is then built into a real .docx file using the docx library, which generates a valid Word Open XML document you can open directly in Microsoft Word, Google Docs, or any compatible editor.',
        ]}
      />

      <FaqAccordion
        title="Frequently asked questions"
        accentColor="bg-blue-500"
        items={PDF_TO_WORD_FAQS}
      />
    </div>
  );
}
