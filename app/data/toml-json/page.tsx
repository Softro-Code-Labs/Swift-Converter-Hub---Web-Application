import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import { Settings2, Zap, Shield, ArrowLeftRight } from 'lucide-react';
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
import TomlJsonTool from '@/features/data/toml-json/components';

export const metadata: Metadata = {
  title: 'TOML to JSON Converter',
  description:
    'Convert TOML to JSON or JSON to TOML instantly in your browser. Supports Cargo.toml, pyproject.toml, config.toml and any TOML config file - no server, no upload, 100% private.',
  keywords: [
    'toml to json converter',
    'json to toml converter',
    'toml json online free',
    'convert toml to json browser',
    'convert json to toml online',
    'toml json bidirectional',
    'toml json no upload',
    'toml converter free',
    'cargo toml to json',
    'pyproject toml converter',
    'toml config converter online',
    'rust config file converter',
  ],
  alternates: {
    canonical: `${SITE_URL}/data/toml-json`,
  },
  openGraph: {
    title:
      'TOML ↔ JSON Converter - Cargo.toml, pyproject.toml & More | Data Studio',
    description:
      'Convert TOML to JSON or JSON to TOML. Cargo.toml, pyproject.toml, config files - instant, private, no server.',
    url: `${SITE_URL}/data/toml-json`,
    type: 'website',
  },
};

const STEPS = [
  {
    step: '01',
    title: 'Paste TOML or JSON',
    desc: 'A Cargo.toml, pyproject.toml, config.toml, or any JSON document.',
  },
  {
    step: '02',
    title: 'Convert instantly',
    desc: 'The tool detects direction and converts as you paste or type.',
  },
  {
    step: '03',
    title: 'Copy or download',
    desc: 'Get valid, correctly-typed TOML or pretty-printed JSON.',
  },
];

const USE_CASE_CARDS = [
  { title: 'Cargo.toml', desc: "Rust's package manifest format" },
  { title: 'pyproject.toml', desc: 'Modern Python project & build config' },
  { title: 'config.toml', desc: 'Used by Hugo, Vault, and many CLI tools' },
];

const FAQS = [
  {
    q: 'Are TOML dates and datetimes preserved correctly?',
    a: "Yes - TOML has native date, time, and datetime types (unlike JSON, which has none), and this tool preserves them through the round trip: a TOML datetime converts to an ISO 8601 string in JSON, and converting that JSON back to TOML restores it as a proper TOML datetime rather than a plain string.",
  },
  {
    q: 'How do TOML tables and arrays of tables map to JSON?',
    a: 'A TOML table ([section]) becomes a nested JSON object, and an array of tables ([[section]]) becomes a JSON array of objects - the same nesting relationship, just expressed with TOML\'s bracket syntax instead of JSON\'s braces.',
  },
  {
    q: 'Can I convert JSON back into a valid TOML config file?',
    a: "Yes - conversion works in both directions, and the JSON to TOML direction produces syntactically valid TOML you can drop straight into a Cargo.toml, pyproject.toml, or similar config file, keys sorted alphabetically if you enable that option.",
  },
  {
    q: 'What TOML version does this support?',
    a: 'It uses the @iarna/toml library, which implements the TOML v1.0.0 specification - the current stable version used by modern tooling like Cargo and recent Python packaging standards.',
  },
  {
    q: 'Is my config file uploaded anywhere?',
    a: 'No. Parsing and conversion both run locally in your browser - nothing is sent to a server, which matters since config files sometimes contain internal paths or settings.',
  },
];

export default function TomlJsonPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Data Studio', path: '/data' },
            { name: 'TOML to JSON Converter', path: '/data/toml-json' },
          ]),
          softwareApplicationJsonLd({
            name: 'TOML to JSON Converter',
            description:
              'Convert TOML to JSON or JSON to TOML instantly in your browser. Supports Cargo.toml, pyproject.toml, config.toml and any TOML config file - no server, no upload, 100% private.',
            path: '/data/toml-json',
            category: 'DeveloperApplication',
          }),
          howToJsonLd({
            name: 'How to convert TOML to JSON online',
            description: 'Convert TOML config files to JSON, or JSON to TOML.',
            steps: STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(FAQS),
        ]}
      />

      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Data Studio', path: '/data' },
          { name: 'TOML to JSON Converter', path: '/data/toml-json' },
        ]}
        badges={[{ label: 'TOML', color: 'purple' }, { label: 'JSON', color: 'amber' }]}
        title="Convert TOML to JSON (and Back)"
        description="Convert TOML config files - Cargo.toml, pyproject.toml, and more - to JSON, or JSON back to valid TOML, entirely in your browser."
        features={[
          { icon: Shield, label: '100% private' },
          { icon: Zap, label: 'Instant' },
          { icon: Settings2, label: 'TOML v1.0.0' },
          { icon: ArrowLeftRight, label: 'Bidirectional' },
        ]}
      />

      <div className="px-6 py-6">
        <TomlJsonTool />
      </div>

      <StepList title="How it works" accentColor="bg-blue-500" steps={STEPS} />

      <InfoCardGrid
        title="Common TOML files this handles"
        accentColor="bg-purple-500"
        columns="grid-cols-1 sm:grid-cols-3"
        cards={USE_CASE_CARDS}
      />

      <TechnicalNote
        title="How the conversion works"
        accentColor="bg-emerald-500"
        paragraphs={[
          'Both directions are powered by @iarna/toml, a spec-compliant TOML v1.0.0 parser and serializer. TOML tables become nested JSON objects, arrays of tables become JSON arrays of objects, and TOML\'s native date/time types are converted to ISO 8601 strings - a small extra step re-detects those ISO strings when converting back to TOML, so a round trip through JSON and back doesn\'t downgrade a real datetime into a plain string.',
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
