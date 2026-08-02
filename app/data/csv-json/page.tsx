import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import { Table2, Zap, Shield, ArrowLeftRight } from 'lucide-react';
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
import CsvJsonTool from '@/features/data/csv-json/components';

export const metadata: Metadata = {
  title: 'CSV to JSON Converter',
  description:
    'Convert CSV to JSON or JSON to CSV instantly in your browser. Supports custom delimiters, header rows, pretty printing, and auto type coercion - no server, no upload, 100% private.',
  keywords: [
    'csv to json converter',
    'json to csv converter',
    'csv json online free',
    'convert csv to json browser',
    'convert json to csv online',
    'csv json tool no upload',
    'csv to json instant',
    'json to csv instant',
    'csv parser online free',
    'json to csv download',
    'custom delimiter csv converter',
    'csv to json with headers',
  ],
  alternates: {
    canonical: `${SITE_URL}/data/csv-json`,
  },
  openGraph: {
    title:
      'CSV ↔ JSON Converter - Instant Bidirectional Conversion | Data Studio',
    description:
      'Paste CSV, get JSON. Paste JSON, get CSV. Custom delimiters, header toggle, pretty print - instant, private, no server.',
    url: `${SITE_URL}/data/csv-json`,
    type: 'website',
  },
};

const STEPS = [
  {
    step: '01',
    title: 'Paste CSV or JSON',
    desc: 'The tool converts in whichever direction matches your input.',
  },
  {
    step: '02',
    title: 'Set delimiter and header options',
    desc: 'Comma, semicolon, tab, or a custom delimiter - and whether the first row is a header.',
  },
  {
    step: '03',
    title: 'Copy or download',
    desc: 'Get pretty-printed JSON, or a downloadable .json / .csv file.',
  },
];

const FAQS = [
  {
    q: 'Does it handle values that contain commas or line breaks?',
    a: "Yes - the parser follows standard CSV quoting rules: a field wrapped in double quotes can safely contain commas, line breaks, and even the delimiter itself, and a literal double quote inside a quoted field is written as two consecutive quotes (\"\"), which the parser correctly unescapes.",
  },
  {
    q: 'What does "auto type coercion" mean?',
    a: 'When converting CSV to JSON, values are inspected and converted from plain strings into their likely type: "true"/"false" become JSON booleans, "null" becomes JSON null, and purely numeric values become JSON numbers - so your data doesn\'t come out as an object where every single field is a string.',
  },
  {
    q: 'Can I use a delimiter other than a comma?',
    a: "Yes - semicolon and tab are built in as presets (common for European-locale spreadsheet exports and TSV files respectively), and you can also specify any custom delimiter string.",
  },
  {
    q: 'What happens if my CSV rows have different numbers of columns?',
    a: 'Each row is converted independently using the header row to determine key names, so a short row simply produces an object with fewer keys rather than causing an error - though this usually signals a formatting issue worth double-checking in the source file.',
  },
  {
    q: 'Is my data uploaded anywhere?',
    a: 'No. Parsing and conversion both happen locally in your browser using a custom parser - nothing is sent to a server.',
  },
];

export default function CsvJsonPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Data Studio', path: '/data' },
            { name: 'CSV to JSON Converter', path: '/data/csv-json' },
          ]),
          softwareApplicationJsonLd({
            name: 'CSV to JSON Converter',
            description:
              'Convert CSV to JSON or JSON to CSV instantly in your browser. Supports custom delimiters, header rows, pretty printing, and auto type coercion - no server, no upload, 100% private.',
            path: '/data/csv-json',
            category: 'DeveloperApplication',
          }),
          howToJsonLd({
            name: 'How to convert CSV to JSON online',
            description:
              'Convert CSV to JSON or JSON to CSV with custom delimiters and header detection.',
            steps: STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(FAQS),
        ]}
      />

      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Data Studio', path: '/data' },
          { name: 'CSV to JSON Converter', path: '/data/csv-json' },
        ]}
        badges={[{ label: 'CSV', color: 'blue' }, { label: 'JSON', color: 'amber' }]}
        title="Convert CSV to JSON (and Back)"
        description="Paste CSV, get JSON - or paste JSON, get CSV. Custom delimiters, header-row detection, pretty printing, and automatic type coercion, all in your browser."
        features={[
          { icon: Shield, label: '100% private' },
          { icon: Zap, label: 'Instant' },
          { icon: Table2, label: 'Custom delimiters' },
          { icon: ArrowLeftRight, label: 'Bidirectional' },
        ]}
      />

      <div className="px-6 py-6">
        <CsvJsonTool />
      </div>

      <StepList title="How it works" accentColor="bg-blue-500" steps={STEPS} />

      <TechnicalNote
        title="How the CSV parser works"
        accentColor="bg-emerald-500"
        paragraphs={[
          "CSV parsing is done character by character with a small state machine that tracks whether it's currently inside a quoted field. This is what lets a quoted field safely contain the delimiter, line breaks, or an escaped double quote, rather than a naive split-on-comma approach that would break on real-world spreadsheet exports. Header detection uses the first row as key names for every subsequent row when enabled, and each value is then checked against simple rules - exact matches for true, false, and null, and successful numeric parsing - to decide whether it becomes a JSON boolean, null, number, or stays a string.",
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
