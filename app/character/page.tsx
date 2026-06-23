import { Metadata } from 'next';
import CharacterStudioClient from './CharacterStudioClient';

export const metadata: Metadata = {
  title: 'Character Studio - Free Online Text Tools',
  description:
    'Word counter, case converter, find & replace, Markdown preview, and regex tester - all running locally in your browser. Zero server uploads, 100% private.',
  keywords: [
    // Original case conversion & formatting
    'text case converter online',
    'case converter online',
    'change text case free',
    'uppercase lowercase converter',
    'title case generator browser',

    // Original word counting & analysis
    'word counter free tool',
    'character count online',
    'accurate word tracker browser',
    'sentence counter online free',

    // Manipulation & search/replace
    'find and replace text online',
    'string manipulation online',
    'remove extra spaces text online',
    'regex tester browser',
    'client side regex validator',

    // Markdown & documentation
    'markdown preview tool',
    'live markdown editor browser',

    // Privacy, security, & utilities
    'text tools no upload',
    'completely private text editor',
    'free text utility tools',
    'offline text formatting tool',

    // Extended text analysis & tracking metrics
    'readability score calculator online',
    'estimated reading time tool',
    'paragraph counter free browser',
    'keyword density analyzer online',
    'unique words counter text',
    'letter count tracking tool',

    // Advanced cleaning & sanitation utilities
    'strip html tags from text online',
    'remove line breaks tool free',
    'url encoder decoder browser',
    'json formatter lint utility',
    'base64 text decoder online',
    'remove duplicate lines from list',
    'sort text lines alphabetically',

    // Developer & programmer string tools
    'developer text utilities dashboard',
    'regex expression generator tool',
    'diff text checker online',
    'compare two strings for differences',
    'escape string characters tool',
    'binary to text converter free',
    'hex string decoder online',

    // Content writing & editorial workflows
    'blog post character checker',
    'twitter character limit tracker',
    'seo meta description length tool',
    'essay drafting markdown utilities',
    'copywriter text cleanup workbench',

    // Privacy-first and performance flags
    'offline text workshop browser',
    'zero logging string processor',
    'secure copy paste text cleaner',
    'client side document formatting suite',
    'wasm accelerated text parser',
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
