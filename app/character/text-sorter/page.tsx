import { Metadata } from 'next';
import TextSorterTool from '@/features/character/text-sorter/components';

export const metadata: Metadata = {
  title: 'Text Sorter & Deduplicator',
  description:
    'Sort lines A–Z, Z–A, by length, or numerically. Shuffle, reverse, remove duplicates, strip blank lines, and trim whitespace - instantly in your browser. No server, 100% private.',
  keywords: [
    // Core intent
    'text sorter online',
    'sort lines online',
    'sort text alphabetically',
    'sort lines a to z',
    'sort text z to a',
    'online line sorter free',
    'text line organiser tool',
    'sort list online free',
    'alphabetical sorter browser',
    'text sorting tool no upload',

    // Deduplication
    'remove duplicate lines online',
    'deduplicate text tool',
    'delete duplicate lines free',
    'find remove duplicates text',
    'unique lines extractor online',
    'remove repeated lines browser',
    'text deduplicator free tool',
    'clean duplicate list online',
    'filter unique values text',
    'remove dupes from list',

    // Specific sort modes
    'sort lines by length online',
    'shortest line first sorter',
    'longest line first tool',
    'numeric sort text lines',
    'sort numbers in text online',
    'shuffle lines randomly online',
    'randomise line order tool',
    'reverse line order online',
    'flip text lines browser',
    'reverse list order tool',

    // Filter & transform
    'remove blank lines online',
    'delete empty lines text',
    'strip blank lines free tool',
    'trim whitespace lines online',
    'clean text lines browser',
    'remove leading spaces lines',
    'strip trailing whitespace tool',
    'lowercase all lines online',
    'uppercase text lines free',
    'bulk transform text lines',

    // Pipeline & features
    'text processing pipeline browser',
    'stack text operations online',
    'multi step text cleaner',
    'case insensitive sort tool',
    'copy sorted text clipboard',
    'download sorted text file',
    'before after line count diff',
    'lines removed counter tool',
    'instant text sorter no server',
    'private text sort no upload',
  ],
  alternates: {
    canonical: 'https://swiftconverterhub.com/character/text-sorter',
  },
  openGraph: {
    title:
      'Text Sorter & Deduplicator - Sort, Filter & Transform Lines | Character Studio',
    description:
      'Sort A–Z, by length, numerically, shuffle, deduplicate, remove blanks - stack operations and see results instantly, no server.',
    url: 'https://swiftconverterhub.com/character/text-sorter',
    type: 'website',
  },
};

export default function TextSorterPage() {
  return <TextSorterTool />;
}
