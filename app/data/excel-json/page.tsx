import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import { FileSpreadsheet, Zap, Shield, Layers } from 'lucide-react';
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
import ExcelJsonTool from '@/features/data/excel-json/components';

export const metadata: Metadata = {
  title: 'Excel to JSON Converter',
  description:
    'Convert Excel .xlsx, .xls, and .ods spreadsheets to JSON in your browser. Multi-sheet support, header row detection, date formatting, and empty cell control - no server, no upload, 100% private.',
  keywords: [
    'excel to json converter',
    'xlsx to json converter',
    'xls to json online free',
    'convert excel to json browser',
    'spreadsheet to json converter',
    'excel json no upload',
    'xlsx json online tool',
    'excel to json instant',
    'xlsx parser online free',
    'multi sheet excel converter',
    'spreadsheet to json online',
    'convert ods to json',
  ],
  alternates: {
    canonical: `${SITE_URL}/data/excel-json`,
  },
  openGraph: {
    title: 'Excel to JSON Converter - Multi-Sheet .xlsx Parser | Data Studio',
    description:
      'Convert .xlsx workbooks to JSON with sheet picker, header detection, date formatting - parsed in your browser, nothing uploaded.',
    url: `${SITE_URL}/data/excel-json`,
    type: 'website',
  },
};

const STEPS = [
  {
    step: '01',
    title: 'Upload a spreadsheet',
    desc: '.xlsx, .xls, or .ods - the workbook is read entirely in your browser.',
  },
  {
    step: '02',
    title: 'Pick a sheet and options',
    desc: 'Choose which sheet to convert, whether the first row is a header, and how dates should be formatted.',
  },
  {
    step: '03',
    title: 'Copy or download JSON',
    desc: 'Get a clean JSON array of row objects.',
  },
];

const DATE_CARDS = [
  {
    title: 'ISO string',
    meta: '2024-03-15',
    desc: 'Human-readable, sortable, works directly with most databases and APIs.',
  },
  {
    title: 'Serial number',
    meta: '45366',
    desc: "Excel's internal date representation - days since a fixed epoch.",
  },
  {
    title: 'Formatted string',
    meta: '3/15/2024',
    desc: "Keeps the cell's original display format, as set in the spreadsheet.",
  },
];

const FAQS = [
  {
    q: 'Can it read multi-sheet workbooks?',
    a: "Yes - every sheet in the uploaded workbook is listed, and you can pick which one to convert. Sheets are read independently, so a workbook with a data sheet and a separate notes or summary sheet won't have them mixed together.",
  },
  {
    q: 'Why do dates need a format option?',
    a: "Internally, Excel stores dates as a serial number (days since a fixed reference date), not as a calendar date. This tool reads that underlying value and converts it properly, but since 'correct' can mean different things depending on where the JSON is going, you can choose between a readable ISO date string, the raw serial number, or the exact text as it was displayed in the spreadsheet cell.",
  },
  {
    q: 'What happens to empty cells?',
    a: 'Empty cells convert to JSON null by default, keeping the same object shape (same keys) across every row, which is usually easier to work with than rows with missing keys - useful when the JSON feeds into a schema or a typed language.',
  },
  {
    q: 'Does it support formulas?',
    a: "It reads a formula cell's last calculated value (the number or text Excel displayed), not the formula expression itself - the same value you'd see just by looking at the spreadsheet without clicking into the cell.",
  },
  {
    q: 'Is my spreadsheet uploaded to a server?',
    a: 'No. The file is parsed entirely in your browser using the SheetJS library - it never leaves your device.',
  },
];

export default function ExcelJsonPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Data Studio', path: '/data' },
            { name: 'Excel to JSON Converter', path: '/data/excel-json' },
          ]),
          softwareApplicationJsonLd({
            name: 'Excel to JSON Converter',
            description:
              'Convert Excel .xlsx, .xls, and .ods spreadsheets to JSON in your browser. Multi-sheet support, header row detection, date formatting, and empty cell control - no server, no upload, 100% private.',
            path: '/data/excel-json',
            category: 'DeveloperApplication',
          }),
          howToJsonLd({
            name: 'How to convert Excel to JSON online',
            description:
              'Convert an Excel or ODS spreadsheet to JSON, with sheet and date-format options.',
            steps: STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(FAQS),
        ]}
      />

      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Data Studio', path: '/data' },
          { name: 'Excel to JSON Converter', path: '/data/excel-json' },
        ]}
        badges={[{ label: 'XLSX / XLS / ODS', color: 'emerald' }]}
        title="Convert Excel to JSON"
        description="Convert .xlsx, .xls, and .ods spreadsheets to JSON - with multi-sheet support, header-row detection, and control over how dates and empty cells convert."
        features={[
          { icon: Shield, label: '100% private' },
          { icon: Zap, label: 'Instant' },
          { icon: FileSpreadsheet, label: '.xlsx, .xls, .ods' },
          { icon: Layers, label: 'Multi-sheet' },
        ]}
      />

      <div className="px-6 py-6">
        <ExcelJsonTool />
      </div>

      <StepList title="How it works" accentColor="bg-blue-500" steps={STEPS} />

      <InfoCardGrid
        title="Date format options"
        accentColor="bg-purple-500"
        columns="grid-cols-1 sm:grid-cols-3"
        cards={DATE_CARDS}
      />

      <TechnicalNote
        title="How the spreadsheet is parsed"
        accentColor="bg-emerald-500"
        paragraphs={[
          "The uploaded file is read with SheetJS, a JavaScript spreadsheet library that understands the .xlsx, .xls, and .ods binary and XML formats without needing a server round-trip. Each sheet's used range is decoded cell by cell - checking each cell's stored type to distinguish numbers, text, booleans, dates, and formula results - and reassembled into a row-by-row structure using your chosen header row as the object keys.",
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
