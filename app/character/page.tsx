import { Metadata } from 'next';
import CharacterStudioClient from './CharacterStudioClient';

export const metadata: Metadata = {
  title: 'Character Studio - Free Online Text Tools (Coming Soon)',
  description:
    'Word counter, case converter, find & replace, Markdown preview, and regex tester — all running locally in your browser. Zero server uploads, 100% private.',
  keywords: [
    // Case Conversion & Formatting Intent
    'text case converter online',
    'case converter online',
    'change text case free',
    'uppercase lowercase converter',
    'title case generator browser',

    // Word Counting & Analysis Focus
    'word counter free tool',
    'character count online',
    'accurate word tracker browser',
    'sentence counter online free',

    // Manipulation & Search/Replace Utility
    'find and replace text online',
    'string manipulation online',
    'remove extra spaces text online',
    'regex tester browser',
    'client side regex validator',

    // Markdown & Documentation Tools
    'markdown preview tool',
    'live markdown editor browser',

    // Privacy, Security, & General Utilities
    'text tools no upload',
    'completely private text editor',
    'free text utility tools',
    'offline text formatting tool',
  ],
  alternates: { canonical: 'https://swiftconverterhub.com/character' },
  openGraph: {
    title: 'Character Studio - Free Online Text Tools',
    description:
      'Case conversion, word counting, regex testing - all in your browser.',
    url: 'https://swiftconverterhub.com/character',
    type: 'website',
  },
};

export default function CharacterStudioPage() {
  return <CharacterStudioClient />;
}
