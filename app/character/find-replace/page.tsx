import { Metadata } from 'next';
import FindReplaceTool from '@/features/character/find-replace/components';

export const metadata: Metadata = {
  title: 'Find & Replace',
  description:
    'Find and replace text with live match highlighting. Supports plain text and regular expressions with case-sensitive, whole-word, and regex modes - all in your browser, 100% private.',
  keywords: [
    // Original core keywords
    'find and replace online',
    'text find replace tool',
    'regex find replace browser',
    'bulk text replace online',
    'live match highlighting',
    'regex tester replace',
    'case sensitive find replace',
    'whole word replace tool',
    'string replace online free',
    'text substitution tool',
    'replace all occurrences online',
    'private find replace no upload',

    // Developer regex & pattern tools
    'regular expression replacement utility',
    'regex substitute strings online',
    'test regular expressions replace matches',
    'javascript regex replacement checker',
    'global search and replace modifier',
    'match text capture groups tool',
    'regex backreference replacement tool',
    'strip characters with regex browser',

    // Advanced code & data sanitation
    'clean source code variables tool',
    'sql script word replacement online',
    'json property key rename helper',
    'html tag text replacement browser',
    'csv column bulk word changer',
    'sanitize log file paths utility',
    'bulk remove line prefixes online',
    'batch strip special characters text',

    // Editorial, copywriting, & document cleaning
    'batch substitute words in article',
    'remove double spaces from text',
    'fix smart quotes straight quotes online',
    'replace placeholder text utility free',
    'bulk change names in document tool',
    'clean copied clipboard text formatting',
    'script outline text editor utility',
    'find and replace formatting corrections',

    // Multi-line and structured string processing
    'multi line text replacer free',
    'batch paragraph line swapping tool',
    'sort and swap sub strings online',
    'strip empty lines from code block',
    'append prefix suffix to text lines',
    'insert text at specific character positions',

    // Privacy-first local sandbox positioning
    'offline search and replace utility',
    'secure data cleaning text sandboxing',
    'zero tracking code text manipulation',
    'local browser block text transformer',
    'client side document sanitizer html5',
    'private log file reader tool',
    'wasm text parsing replacement system',
    'no server log data cleaner string',
  ],
  alternates: {
    canonical: 'https://swiftconverterhub.com/character/find-replace',
  },
  openGraph: {
    title: 'Find & Replace - Live Regex & Plain Text | Character Studio',
    description:
      'Live match highlighting, plain text or regex, replace one or all - instant, private, no server.',
    url: 'https://swiftconverterhub.com/character/find-replace',
    type: 'website',
  },
};

export default function FindReplacePage() {
  return <FindReplaceTool />;
}
