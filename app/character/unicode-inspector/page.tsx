import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import UnicodeInspectorTool from '@/features/character/unicode-inspector/components';

export const metadata: Metadata = {
  title: 'Unicode Inspector',
  description:
    "Reveal every character's Unicode code point, name, category, and UTF-8 bytes. Detect invisible characters, zero-width spaces, smart quotes, and byte-order marks - instantly in your browser, 100% private.",
  keywords: [
    'unicode inspector online',
    'unicode character inspector',
    'inspect unicode characters',
    'view unicode code points',
    'unicode character viewer',
    'text character analyser',
    'character code point tool',
    'unicode decoder online',
  ],
  alternates: {
    canonical: `${SITE_URL}/character/unicode-inspector`,
  },
  openGraph: {
    title:
      'Unicode Inspector - Reveal Hidden Characters & Code Points | Character Studio',
    description:
      "Every character's code point, name, category and UTF-8 bytes - invisible chars, smart quotes and BOM detected instantly, nothing sent to any server.",
    url: `${SITE_URL}/character/unicode-inspector`,
    type: 'website',
  },
};

export default function UnicodeInspectorPage() {
  return <UnicodeInspectorTool />;
}
