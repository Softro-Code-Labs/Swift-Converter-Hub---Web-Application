import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import { FileOutput, Zap, Shield, Printer } from 'lucide-react';
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
import OfficeToPdfTool from '@/features/file/office-to-pdf/components';

export const metadata: Metadata = {
  title: 'Word / Excel to PDF Converter',
  description:
    'Convert .docx and .xlsx files to PDF in your browser using the built-in print dialog. No server, no upload, 100% private - powered by Mammoth.js and SheetJS.',
  keywords: [
    'word to pdf converter online',
    'excel to pdf converter free',
    'docx to pdf browser',
    'xlsx to pdf online free',
    'convert word to pdf no upload',
    'convert excel to pdf browser',
    'word pdf converter private',
    'excel pdf converter no server',
    'mammoth js docx converter',
    'sheetjs excel converter',
    'convert word document online free',
    'save docx as pdf browser',
  ],
  alternates: {
    canonical: `${SITE_URL}/file/office-to-pdf`,
  },
  openGraph: {
    title: 'Word / Excel to PDF - Browser Print Conversion | Document Suite',
    description:
      'Convert .docx and .xlsx to PDF via browser print dialog - preview, then save as PDF. Nothing uploaded.',
    url: `${SITE_URL}/file/office-to-pdf`,
    type: 'website',
  },
};

const STEPS = [
  {
    step: '01',
    title: 'Upload a .docx or .xlsx file',
    desc: 'Word documents and Excel workbooks are both supported.',
  },
  {
    step: '02',
    title: 'Preview the rendered document',
    desc: 'Headings, formatting, and spreadsheet tables render as they would print.',
  },
  {
    step: '03',
    title: 'Print to PDF',
    desc: "Use your browser's print dialog and choose \"Save as PDF\" as the destination.",
  },
];

const FAQS = [
  {
    q: 'Why does this use the print dialog instead of directly generating a PDF file?',
    a: "Generating a pixel-perfect PDF from a Word or Excel file normally needs the actual Word or Excel rendering engine, which isn't available in a browser. Instead, this tool converts your file into styled HTML and hands the job of producing the final PDF to your browser's own print engine - which every modern browser already does reliably via its \"Save as PDF\" print destination.",
  },
  {
    q: 'Will my document look exactly like it does in Word or Excel?',
    a: "Close, but not pixel-identical. Word documents keep headings, bold/italic, underline, strikethrough, and tables, since these map directly to HTML. Complex layouts - things like precise text boxes, custom page margins, or advanced Excel cell formatting - may render slightly differently than the original application would show them.",
  },
  {
    q: 'How are multiple Excel sheets handled?',
    a: 'Every sheet in the workbook is converted to its own HTML table and included in the preview and print output, in the same order as in the original file, so a multi-sheet workbook doesn\'t lose any of its tabs.',
  },
  {
    q: 'Why do I sometimes see a conversion warning?',
    a: 'Word documents can use structures that don\'t have a clean HTML equivalent - certain nested tables, unusual field codes, or embedded objects, for example. When that happens, the tool surfaces a short warning describing what was simplified, rather than silently dropping content without telling you.',
  },
  {
    q: 'Is my document uploaded to a server?',
    a: 'No. The .docx is parsed with Mammoth.js and the .xlsx with SheetJS, both running entirely in your browser - the file is never uploaded, and the final PDF is produced by your own browser\'s print function, not a remote service.',
  },
];

export default function OfficeToPdfPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Document Suite', path: '/file' },
            { name: 'Word / Excel to PDF Converter', path: '/file/office-to-pdf' },
          ]),
          softwareApplicationJsonLd({
            name: 'Word / Excel to PDF Converter',
            description:
              'Convert .docx and .xlsx files to PDF in your browser using the built-in print dialog. No server, no upload, 100% private - powered by Mammoth.js and SheetJS.',
            path: '/file/office-to-pdf',
            category: 'BusinessApplication',
          }),
          howToJsonLd({
            name: 'How to convert Word or Excel to PDF online',
            description:
              'Convert a .docx or .xlsx file to PDF using the browser print dialog.',
            steps: STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(FAQS),
        ]}
      />

      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Document Suite', path: '/file' },
          { name: 'Word / Excel to PDF Converter', path: '/file/office-to-pdf' },
        ]}
        badges={[{ label: 'DOCX / XLSX → PDF', color: 'blue' }]}
        title="Convert Word or Excel to PDF"
        description="Preview a .docx or .xlsx file rendered as it would print, then save it as a PDF using your browser's own print dialog - no uploads, no server."
        features={[
          { icon: Shield, label: '100% private' },
          { icon: Zap, label: 'Instant preview' },
          { icon: FileOutput, label: '.docx and .xlsx' },
          { icon: Printer, label: 'Browser print to PDF' },
        ]}
      />

      <div className="px-6 py-6">
        <OfficeToPdfTool />
      </div>

      <StepList title="How it works" accentColor="bg-blue-500" steps={STEPS} />

      <TechnicalNote
        title="How the conversion works"
        accentColor="bg-emerald-500"
        paragraphs={[
          "Word documents are converted with Mammoth.js, which reads the .docx file's internal XML and maps its styles - headings, bold, italic, underline, strikethrough, and tables - to equivalent HTML elements. Excel workbooks are read with SheetJS, which converts each sheet into an HTML table in its original tab order. Either result is rendered in a print-optimized layout, and the actual PDF file is produced by your browser's native print-to-PDF function rather than by this tool directly - which is what keeps the whole process running locally without needing a PDF-generation service.",
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
