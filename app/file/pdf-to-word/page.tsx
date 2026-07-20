import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
  faqPageJsonLd,
} from '@/components/seo/JsonLd';
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

export default function PdfToWordPage() {
  return (
    <>
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
          faqPageJsonLd(PDF_TO_WORD_FAQS),
        ]}
      />
      <PdfToWordTool />
    </>
  );
}
