import { Metadata } from 'next';
import CaseConverterTool from '@/features/character/case-converter/components';

export const metadata: Metadata = {
  title: 'Case Converter',
  description:
    'Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, PascalCase, and more - instantly in your browser. No server, 100% private.',
  keywords: [
    // Original keywords
    'case converter online',
    'text case converter',
    'uppercase converter',
    'lowercase converter',
    'title case converter',
    'camelCase converter',
    'snake_case converter',
    'kebab-case converter',
    'PascalCase converter',
    'CONSTANT_CASE converter',
    'sentence case tool',
    'alternating case generator',
    'change text case free',
    'string case converter browser',
    'private case converter no upload',

    // Developer utilities
    'programming case converter',
    'convert string to camelcase',
    'convert string to snakecase',
    'kebab case string generator',
    'pascal case text tool',
    'json key case converter',
    'code variable renaming tool',
    'slugify text online free',
    'url friendly slug converter',
    'dot case generator online',
    'path case converter string',

    // Copywriting & editing
    'headline title case checker',
    'apa style capitalization tool',
    'mla title case converter',
    'blog post title capitalizing',
    'sentence capitalization corrector',
    'all caps text converter',
    'remove accidental caps lock',
    'invert text case online',
    'toggle case text utility',

    // Database & Admin
    'sql column case formatter',
    'database naming convention tool',
    'bulk text case changer',
    'excel column lowercase converter',
    'csv headers case clean up',
    'clean variable names online',

    // Privacy & client-side
    'offline case changer tool',
    'client side string formatter',
    'secure text transformation',
    'local data string converter',
    'browser based formatting tool',
    'no server log case changer',
    'developer string utils online',
    'mock data text formatter',
    'regex case converter alternative',
  ],
  alternates: {
    canonical: 'https://swiftconverterhub.com/character/case-converter',
  },
  openGraph: {
    title: 'Case Converter - 12 Case Formats Instantly',
    description:
      'UPPERCASE, camelCase, snake_case, Title Case and 8 more - instant, private, no server.',
    url: 'https://swiftconverterhub.com/character/case-converter',
    type: 'website',
  },
};

export default function CaseConverterPage() {
  return <CaseConverterTool />;
}
