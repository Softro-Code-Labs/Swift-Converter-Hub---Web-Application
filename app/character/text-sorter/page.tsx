import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import { ArrowDownAZ, Zap, Shield, Layers3 } from 'lucide-react';
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
import TextSorterTool from '@/features/character/text-sorter/components';

export const metadata: Metadata = {
  title: 'Text Sorter & Deduplicator',
  description:
    'Sort lines A-Z, Z-A, by length, or numerically. Shuffle, reverse, remove duplicates, strip blank lines, and trim whitespace - instantly in your browser. No server, 100% private.',
  keywords: [
    'text sorter online',
    'sort lines online',
    'sort text alphabetically',
    'sort lines a to z',
    'sort text z to a',
    'online line sorter free',
    'text line organiser tool',
    'sort list online free',
    'remove duplicate lines online',
    'shuffle text lines online',
    'reverse line order tool',
    'trim whitespace from text online',
  ],
  alternates: {
    canonical: `${SITE_URL}/character/text-sorter`,
  },
  openGraph: {
    title:
      'Text Sorter & Deduplicator - Sort, Filter & Transform Lines | Character Studio',
    description:
      'Sort A–Z, by length, numerically, shuffle, deduplicate, remove blanks - stack operations and see results instantly, no server.',
    url: `${SITE_URL}/character/text-sorter`,
    type: 'website',
  },
};

const STEPS = [
  {
    step: '01',
    title: 'Paste your list',
    desc: 'One item per line - a list of names, values, or anything else.',
  },
  {
    step: '02',
    title: 'Stack operations',
    desc: 'Chain sort, dedupe, trim, and filter operations in any order.',
  },
  {
    step: '03',
    title: 'Copy the result',
    desc: 'Each operation applies instantly to the current output.',
  },
];

const OPERATION_CARDS = [
  { title: 'Sort A-Z / Z-A', desc: 'Locale-aware alphabetical sort' },
  { title: 'Sort by length', desc: 'Shortest or longest line first' },
  { title: 'Sort numerically', desc: 'Reads the number in each line' },
  { title: 'Shuffle', desc: 'Fisher-Yates random reorder' },
  { title: 'Reverse', desc: 'Flips the current line order' },
  { title: 'Deduplicate', desc: 'Removes repeated lines, keeps first' },
  { title: 'Remove blank lines', desc: 'Drops empty or whitespace-only lines' },
  { title: 'Trim whitespace', desc: 'Strips leading/trailing spaces per line' },
];

const FAQS = [
  {
    q: 'Can I combine multiple operations, like sorting and then deduplicating?',
    a: 'Yes - operations stack. Each one you apply runs on the current output of the last, so you can, for example, trim whitespace, remove blank lines, deduplicate, and then sort A-Z, all in that order, and see the list update after each step.',
  },
  {
    q: 'How does alphabetical sorting handle accented letters and different alphabets?',
    a: "It uses JavaScript's locale-aware string comparison rather than raw character codes, so accented letters (like é or ü) sort into a sensible position relative to their unaccented equivalents instead of being pushed to the end.",
  },
  {
    q: 'How does numeric sort handle lines that aren\'t plain numbers?',
    a: 'It extracts the first number it finds in each line (ignoring surrounding text and currency symbols, for example) and sorts by that. Lines with no number at all are treated as sorting last, so they don\'t end up scattered throughout a numerically sorted list.',
  },
  {
    q: 'Is deduplication case-sensitive?',
    a: 'You can toggle it either way - with case-sensitivity off, "Apple" and "apple" are treated as duplicates and only the first occurrence is kept; with it on, they are treated as distinct lines.',
  },
  {
    q: 'Is my list sent anywhere?',
    a: 'No. Every operation runs locally in your browser as plain JavaScript array operations - nothing is uploaded.',
  },
];

export default function TextSorterPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Character Studio', path: '/character' },
            { name: 'Text Sorter & Deduplicator', path: '/character/text-sorter' },
          ]),
          softwareApplicationJsonLd({
            name: 'Text Sorter & Deduplicator',
            description:
              'Sort lines A-Z, Z-A, by length, or numerically. Shuffle, reverse, remove duplicates, strip blank lines, and trim whitespace - instantly in your browser. No server, 100% private.',
            path: '/character/text-sorter',
            category: 'UtilitiesApplication',
          }),
          howToJsonLd({
            name: 'How to sort and clean up a list of lines online',
            description:
              'Sort, deduplicate, and filter a list of lines by stacking operations.',
            steps: STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(FAQS),
        ]}
      />

      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Character Studio', path: '/character' },
          { name: 'Text Sorter & Deduplicator', path: '/character/text-sorter' },
        ]}
        badges={[{ label: 'SORT & CLEAN', color: 'emerald' }]}
        title="Sort & Deduplicate Lines of Text"
        description="Sort A-Z, Z-A, by length, or numerically. Shuffle, reverse, remove duplicates, strip blank lines, and trim whitespace - stack as many operations as you need."
        features={[
          { icon: Shield, label: '100% private' },
          { icon: Zap, label: 'Instant, stackable' },
          { icon: ArrowDownAZ, label: 'Locale-aware sort' },
          { icon: Layers3, label: '8 operations' },
        ]}
      />

      <div className="px-6 py-6">
        <TextSorterTool />
      </div>

      <StepList title="How it works" accentColor="bg-blue-500" steps={STEPS} />

      <InfoCardGrid
        title="Available operations"
        accentColor="bg-purple-500"
        columns="grid-cols-2 sm:grid-cols-4"
        cards={OPERATION_CARDS}
      />

      <TechnicalNote
        title="How stacking works"
        accentColor="bg-emerald-500"
        paragraphs={[
          "Your text is split into an array of lines, and each operation you apply - sort, shuffle, deduplicate, and so on - runs as a standard JavaScript array transformation on top of whatever the previous operation produced, rather than always starting over from your original input. That's what lets you build up a small pipeline, like trim → remove blanks → deduplicate → sort A-Z, and see the effect of each step in order.",
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
