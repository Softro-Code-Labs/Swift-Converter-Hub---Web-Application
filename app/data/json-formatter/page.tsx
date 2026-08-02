import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import { Braces, Zap, Shield, BarChart3 } from 'lucide-react';
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
import JsonFormatterTool from '@/features/data/json-formatter/components';

export const metadata: Metadata = {
  title: 'JSON Formatter & Validator',
  description:
    'Beautify, minify, and validate JSON instantly in your browser. Sort keys, escape ASCII, inspect structure stats - no server, no upload, 100% private.',
  keywords: [
    'json formatter online',
    'json beautifier free',
    'json minifier online',
    'json validator browser',
    'pretty print json online',
    'format json free tool',
    'json beautify no upload',
    'json formatter instant',
    'json pretty printer online',
    'json syntax checker free',
    'validate json online free',
    'json key sorter tool',
  ],
  alternates: {
    canonical: `${SITE_URL}/data/json-formatter`,
  },
  openGraph: {
    title:
      'JSON Formatter & Validator - Beautify, Minify, Validate | Data Studio',
    description:
      'Beautify, minify, or validate JSON instantly. Sort keys, ASCII escape, structure stats - no server, no upload.',
    url: `${SITE_URL}/data/json-formatter`,
    type: 'website',
  },
};

const STEPS = [
  {
    step: '01',
    title: 'Paste your JSON',
    desc: 'Any valid JSON - or JSON you\'re not sure is valid yet.',
  },
  {
    step: '02',
    title: 'Choose beautify or minify',
    desc: 'Pick your indent style, optionally sort keys alphabetically or escape non-ASCII characters.',
  },
  {
    step: '03',
    title: 'Review stats and copy',
    desc: 'See key count, value types, nesting depth, and byte size before and after.',
  },
];

const FAQS = [
  {
    q: 'What exactly does "validate" check?',
    a: "It attempts to parse your input with a standard JSON parser and reports the exact syntax error if it fails - a trailing comma, an unquoted key, a missing bracket - rather than just saying 'invalid JSON'. Valid JSON always produces a successfully parsed result with no error.",
  },
  {
    q: 'What does sorting keys change?',
    a: "It recursively reorders every object's keys alphabetically before re-serializing, without altering any values. This is purely cosmetic for JSON itself (key order isn't semantically meaningful in the JSON spec) but can make two versions of similar data much easier to diff or compare visually.",
  },
  {
    q: 'What does "escape ASCII" do?',
    a: 'It replaces any non-ASCII character (accented letters, CJK text, emoji) with its \\uXXXX escape sequence - the same representation JSON.stringify can produce and any compliant JSON parser understands. This is occasionally required by older systems or strict ASCII-only pipelines that choke on raw UTF-8 bytes in a JSON payload.',
  },
  {
    q: 'What do the structure stats tell me?',
    a: "They break your document down by key count, value types (strings, numbers, booleans, nulls), number of arrays and objects, and maximum nesting depth - useful for quickly sanity-checking an unfamiliar API response or spotting an unexpectedly deep structure.",
  },
  {
    q: 'Is my JSON sent anywhere?',
    a: 'No. Parsing, formatting, and validation all happen locally using the standard JSON parser built into your browser - nothing is uploaded, which matters since JSON payloads (API responses, config files) often contain sensitive data.',
  },
];

export default function JsonFormatterPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Data Studio', path: '/data' },
            { name: 'JSON Formatter & Validator', path: '/data/json-formatter' },
          ]),
          softwareApplicationJsonLd({
            name: 'JSON Formatter & Validator',
            description:
              'Beautify, minify, and validate JSON instantly in your browser. Sort keys, escape ASCII, inspect structure stats - no server, no upload, 100% private.',
            path: '/data/json-formatter',
            category: 'DeveloperApplication',
          }),
          howToJsonLd({
            name: 'How to format and validate JSON online',
            description:
              'Beautify, minify, and validate JSON, with key sorting and structure stats.',
            steps: STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(FAQS),
        ]}
      />

      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Data Studio', path: '/data' },
          { name: 'JSON Formatter & Validator', path: '/data/json-formatter' },
        ]}
        badges={[{ label: 'JSON', color: 'amber' }]}
        title="Format & Validate JSON Online"
        description="Beautify, minify, and validate JSON instantly - sort keys alphabetically, escape non-ASCII characters, and see a full structure breakdown."
        features={[
          { icon: Shield, label: '100% private' },
          { icon: Zap, label: 'Instant' },
          { icon: Braces, label: 'Beautify or minify' },
          { icon: BarChart3, label: 'Structure stats' },
        ]}
      />

      <div className="px-6 py-6">
        <JsonFormatterTool />
      </div>

      <StepList title="How it works" accentColor="bg-blue-500" steps={STEPS} />

      <TechnicalNote
        title="How formatting and stats work"
        accentColor="bg-emerald-500"
        paragraphs={[
          "Your input is parsed with JSON.parse, so any syntax error surfaces exactly the way it would in your own code. Beautifying re-serializes the parsed result with your chosen indent (spaces or a tab); minifying serializes with no whitespace at all. Structure stats are computed by walking the parsed object tree once, tallying each value by type and tracking the deepest level of nesting reached, then computing before/after byte sizes with TextEncoder to give an accurate size comparison rather than a character count, since multi-byte Unicode characters take up more than one byte.",
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
