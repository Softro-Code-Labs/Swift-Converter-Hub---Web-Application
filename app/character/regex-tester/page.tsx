import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import { Regex, Zap, Shield, ListTree } from 'lucide-react';
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
import RegexTesterTool from '@/features/character/regex-tester/components';

export const metadata: Metadata = {
  title: 'Regex Tester',
  description:
    'Test regular expressions live with match highlighting, capture group inspection, and flag controls (i, m, s, u). Powered by the JavaScript RegExp engine - instant, private, no server.',
  keywords: [
    'regex tester online',
    'regular expression tester',
    'live regex matcher',
    'regex capture groups',
    'javascript regex tester',
    'regex flags online',
    'regex debugger browser',
    'regex match highlighter',
    'regex pattern tester online',
    'regex online sandbox',
    'test regular expression online free',
    'regex validator browser',
  ],
  alternates: {
    canonical: `${SITE_URL}/character/regex-tester`,
  },
  openGraph: {
    title: 'Regex Tester - Live Matching & Capture Groups | Character Studio',
    description:
      'Live highlights, capture group inspector, flag toggles, quick reference - instant, private, no server.',
    url: `${SITE_URL}/character/regex-tester`,
    type: 'website',
  },
};

const STEPS = [
  {
    step: '01',
    title: 'Write your pattern',
    desc: 'Enter a regular expression and toggle the flags you need.',
  },
  {
    step: '02',
    title: 'Paste test text',
    desc: 'Matches highlight live, right in the text as you type.',
  },
  {
    step: '03',
    title: 'Inspect capture groups',
    desc: 'See each match broken down into its numbered and named groups.',
  },
];

const FLAG_CARDS = [
  { title: 'i', desc: 'Case-insensitive matching' },
  { title: 'm', desc: '^ and $ match at line boundaries, not just string start/end' },
  { title: 's', desc: 'Dot-all - . also matches newline characters' },
  { title: 'u', desc: 'Full Unicode mode - correct handling of surrogate pairs' },
];

const FAQS = [
  {
    q: 'Which regex flavor does this use?',
    a: "The native JavaScript RegExp engine - the same one that runs in Chrome, Firefox, Safari, and Node.js. It's very close to PCRE but has some differences, so a pattern written for Python's re module or PHP's preg functions may need small tweaks (JavaScript's lookbehind support and Unicode property escapes, for instance, depend on the flags you enable).",
  },
  {
    q: 'What is the difference between numbered and named capture groups?',
    a: 'Every parenthesized group (like (\\d+)) is automatically numbered in match order, starting at 1. A named group - written (?<year>\\d{4}) - additionally lets you reference the match by that name instead of its position, which stays readable even after you add or reorder other groups.',
  },
  {
    q: 'Why is the "g" (global) flag always on?',
    a: 'Without it, JavaScript\'s regex engine stops after the first match. This tool always searches globally so you can see every match in your test text at once, while still letting you toggle the other flags (i, m, s, u) that change how matching behaves.',
  },
  {
    q: "What happens if my pattern has a syntax error?",
    a: "The tool attempts to compile your pattern as you type and surfaces the exact error message from the JavaScript engine (for example, an unterminated group or an invalid quantifier) instead of silently failing, so you can see exactly what needs fixing.",
  },
  {
    q: 'Is my test text or pattern sent anywhere?',
    a: "No. Matching runs entirely in your browser using JavaScript's built-in RegExp object - nothing is transmitted or logged.",
  },
];

export default function RegexTesterPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Character Studio', path: '/character' },
            { name: 'Regex Tester', path: '/character/regex-tester' },
          ]),
          softwareApplicationJsonLd({
            name: 'Regex Tester',
            description:
              'Test regular expressions live with match highlighting, capture group inspection, and flag controls (i, m, s, u). Powered by the JavaScript RegExp engine - instant, private, no server.',
            path: '/character/regex-tester',
            category: 'UtilitiesApplication',
          }),
          howToJsonLd({
            name: 'How to test a regular expression online',
            description:
              'Write a pattern, paste test text, and inspect live matches and capture groups.',
            steps: STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(FAQS),
        ]}
      />

      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Character Studio', path: '/character' },
          { name: 'Regex Tester', path: '/character/regex-tester' },
        ]}
        badges={[{ label: 'REGEX', color: 'rose' }]}
        title="Test Regular Expressions Live"
        description="Live match highlighting, capture group inspection, and flag toggles (i, m, s, u) - powered by the JavaScript RegExp engine, right in your browser."
        features={[
          { icon: Shield, label: '100% private' },
          { icon: Zap, label: 'Live matching' },
          { icon: Regex, label: 'i / m / s / u flags' },
          { icon: ListTree, label: 'Capture group inspector' },
        ]}
      />

      <div className="px-6 py-6">
        <RegexTesterTool />
      </div>

      <StepList title="How it works" accentColor="bg-blue-500" steps={STEPS} />

      <InfoCardGrid
        title="Flag reference"
        accentColor="bg-purple-500"
        columns="grid-cols-2 sm:grid-cols-4"
        cards={FLAG_CARDS}
      />

      <TechnicalNote
        title="How matching and highlighting work"
        accentColor="bg-emerald-500"
        paragraphs={[
          "Your pattern is compiled into a native JavaScript RegExp object with the global flag always enabled, so every match in the text is found rather than just the first. For each match, the tool reads both the numbered capture groups (matches[1], matches[2], and so on) and any named groups from the match's .groups property, and renders them in a structured list alongside the highlighted match in your text.",
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
