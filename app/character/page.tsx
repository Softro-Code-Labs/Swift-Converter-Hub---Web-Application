import { Metadata } from 'next';
import CharacterStudioClient from './CharacterStudioClient';

export const metadata: Metadata = {
  title: 'Character Studio - Free Online Text Tools (Coming Soon)',
  description:
    'Transform text case, count words, find & replace, and validate regex - all client-side in your browser. No uploads, completely private.',
  keywords: [
    'text case converter',
    'case converter online',
    'text case converter online',
    'word counter free tool',
    'find and replace text online',
    'regex tester browser',
    'markdown preview tool',
    'text tools no upload',
    'string manipulation online',
    'free text utility tools',
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
