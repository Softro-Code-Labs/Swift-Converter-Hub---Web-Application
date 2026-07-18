import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
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

export default function TextSorterPage() {
  return <TextSorterTool />;
}
