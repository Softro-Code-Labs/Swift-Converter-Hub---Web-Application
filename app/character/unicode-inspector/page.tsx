import { Metadata } from 'next';
import UnicodeInspectorTool from '@/features/character/unicode-inspector/components';

export const metadata: Metadata = {
  title: 'Unicode Inspector',
  description:
    "Reveal every character's Unicode code point, name, category, and UTF-8 bytes. Detect invisible characters, zero-width spaces, smart quotes, and byte-order marks — instantly in your browser, 100% private.",
  keywords: [
    // Core intent
    'unicode inspector online',
    'unicode character inspector',
    'inspect unicode characters',
    'view unicode code points',
    'unicode character viewer',
    'text character analyser',
    'character code point tool',
    'unicode decoder online',
    'unicode character lookup',
    'inspect text encoding online',

    // Invisible characters
    'find invisible characters text',
    'detect zero width space online',
    'remove zero width space tool',
    'hidden characters text finder',
    'invisible character detector',
    'zero width joiner finder',
    'find hidden unicode chars',
    'detect bom byte order mark',
    'unicode control character finder',
    'expose hidden text characters',

    // Smart quotes / typography
    'smart quotes detector online',
    'find smart quotes in text',
    'curly quotes finder tool',
    'replace smart quotes online',
    'unicode quotation mark finder',
    'em dash en dash detector',
    'typography character inspector',
    'find special punctuation text',
    'unicode punctuation checker',
    'dumb quotes smart quotes tool',

    // PDF / Word doc issues
    'pdf hidden characters remover',
    'word doc special characters',
    'copy paste character issues',
    'clean text from pdf online',
    'fix encoding issues text',
    'remove formatting characters',
    'find weird characters in text',
    'debug text encoding browser',
    'clean pasted text characters',
    'text cleaning unicode tool',

    // Technical / dev
    'utf8 bytes calculator online',
    'html entity code point',
    'decimal unicode code point',
    'hex unicode value online',
    'javascript charcodeat online',
    'codePointAt browser tool',
    'unicode category checker',
    'unicode block identifier',
    'surrogate pair inspector',
    'grapheme cluster analyser',
  ],
  alternates: {
    canonical: 'https://swiftconverterhub.com/character/unicode-inspector',
  },
  openGraph: {
    title:
      'Unicode Inspector - Reveal Hidden Characters & Code Points | Character Studio',
    description:
      "Every character's code point, name, category and UTF-8 bytes — invisible chars, smart quotes and BOM detected instantly, nothing sent to any server.",
    url: 'https://swiftconverterhub.com/character/unicode-inspector',
    type: 'website',
  },
};

export default function UnicodeInspectorPage() {
  return <UnicodeInspectorTool />;
}
