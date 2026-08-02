import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import { Search, Zap, Shield, Replace } from 'lucide-react';
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
import FindReplaceTool from '@/features/character/find-replace/components';

export const metadata: Metadata = {
  title: 'Find & Replace',
  description:
    'Find and replace text with live match highlighting. Supports plain text and regular expressions with case-sensitive, whole-word, and regex modes - all in your browser, 100% private.',
  keywords: [
    'find and replace online',
    'text find replace tool',
    'regex find replace browser',
    'bulk text replace online',
    'live match highlighting',
    'regex tester replace',
    'case sensitive find replace',
    'whole word replace tool',
    'multiline find replace tool',
    'batch text replace online',
    'regex substitution tool',
    'search and replace text online',
  ],
  alternates: {
    canonical: `${SITE_URL}/character/find-replace`,
  },
  openGraph: {
    title: 'Find & Replace - Live Regex & Plain Text | Character Studio',
    description:
      'Live match highlighting, plain text or regex, replace one or all - instant, private, no server.',
    url: `${SITE_URL}/character/find-replace`,
    type: 'website',
  },
};

const STEPS = [
  {
    step: '01',
    title: 'Paste your text',
    desc: 'Drop in the text you want to search through.',
  },
  {
    step: '02',
    title: 'Enter find & replace terms',
    desc: 'Toggle case-sensitive, whole-word, or regex mode as needed.',
  },
  {
    step: '03',
    title: 'Review matches and replace',
    desc: 'Matches highlight live - replace all, or copy the result once satisfied.',
  },
];

const FAQS = [
  {
    q: 'What is the difference between plain text and regex mode?',
    a: 'In plain text mode, your search term is matched literally - any regular-expression characters in it (like . or *) are automatically escaped so they are treated as ordinary text. In regex mode, your search term is compiled as a JavaScript regular expression, so patterns like \\d+ or (foo|bar) work as you would expect.',
  },
  {
    q: "What does 'whole word' matching do?",
    a: 'It wraps your search term with word-boundary markers (\\b) so "cat" matches the word "cat" but not "category" or "concatenate". This applies in both plain text and regex mode.',
  },
  {
    q: 'Does case-sensitive matter?',
    a: 'Yes - with case-sensitive off (the default), "Find" and "find" and "FIND" all match. Turn it on when the exact capitalization matters, for example distinguishing a class name from a variable name in code.',
  },
  {
    q: 'Can I replace only the first match instead of all of them?',
    a: 'Yes - the tool supports replacing every match at once or stepping through and replacing individual matches one at a time, so you can skip the ones you want to leave alone.',
  },
  {
    q: 'Is my text sent to a server?',
    a: 'No. Matching and replacing both run locally in your browser using the standard JavaScript regular expression engine - nothing is uploaded or logged.',
  },
];

export default function FindReplacePage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Character Studio', path: '/character' },
            { name: 'Find & Replace', path: '/character/find-replace' },
          ]),
          softwareApplicationJsonLd({
            name: 'Find & Replace',
            description:
              'Find and replace text with live match highlighting. Supports plain text and regular expressions with case-sensitive, whole-word, and regex modes - all in your browser, 100% private.',
            path: '/character/find-replace',
            category: 'UtilitiesApplication',
          }),
          howToJsonLd({
            name: 'How to find and replace text online',
            description:
              'Search text with live highlighting and replace matches using plain text or regex.',
            steps: STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(FAQS),
        ]}
      />

      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Character Studio', path: '/character' },
          { name: 'Find & Replace', path: '/character/find-replace' },
        ]}
        badges={[{ label: 'FIND & REPLACE', color: 'blue' }]}
        title="Find & Replace Text Online"
        description="Search text with live match highlighting, then replace one match or all of them - plain text or full regular expressions, case-sensitive or whole-word."
        features={[
          { icon: Shield, label: '100% private' },
          { icon: Zap, label: 'Live highlighting' },
          { icon: Search, label: 'Plain text or regex' },
          { icon: Replace, label: 'Replace one or all' },
        ]}
      />

      <div className="px-6 py-6">
        <FindReplaceTool />
      </div>

      <StepList title="How it works" accentColor="bg-blue-500" steps={STEPS} />

      <TechnicalNote
        title="How matching works"
        accentColor="bg-emerald-500"
        paragraphs={[
          'Plain text mode escapes every regular-expression special character in your search term before compiling it, so a literal search for "1.5" only matches the exact string "1.5" instead of "1" followed by any character followed by "5". Regex mode skips that escaping step and compiles your input directly, giving full access to groups, character classes, and quantifiers.',
          'Whole-word matching wraps the compiled pattern with \\b boundary anchors, and the global flag ensures every occurrence in the text is found rather than stopping at the first one - all handled by the same RegExp engine built into your browser\'s JavaScript runtime.',
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
