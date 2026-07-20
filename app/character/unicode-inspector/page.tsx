import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import UnicodeInspectorTool from '@/features/character/unicode-inspector/components';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
} from '@/components/seo/JsonLd';

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
    'unicode codepoint lookup',
    'utf-8 character inspector',
    'emoji unicode inspector',
    'special character analyzer online',
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
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Character Studio', path: '/character' },
            { name: 'Unicode Inspector', path: '/character/unicode-inspector' },
          ]),
          softwareApplicationJsonLd({
            name: 'Unicode Inspector',
            description:
              "Reveal every character's Unicode code point, name, category, and UTF-8 bytes, entirely in your browser.",
            path: '/character/unicode-inspector',
            category: 'UtilitiesApplication',
          }),
        ]}
      />
      <UnicodeInspectorTool />
    </>
  );
}
