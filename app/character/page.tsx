import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import CharacterStudioClient from './CharacterStudioClient';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
} from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Character Studio - Free Online Text Tools',
  description:
    'Word counter, case converter, find & replace, Markdown preview, and regex tester - all running locally in your browser. Zero server uploads, 100% private.',
  keywords: [
    'text case converter online',
    'case converter online',
    'change text case free',
    'uppercase lowercase converter',
    'title case generator browser',
    'word counter free tool',
    'character count online',
    'accurate word tracker browser',
    'text tools online free',
    'browser text utilities',
    'no signup text tools',
    'developer text tools online',
  ],
  alternates: { canonical: `${SITE_URL}/character` },
  openGraph: {
    title: 'Character Studio - Free Online Text Tools',
    description:
      'Case conversion, word counting, regex testing - all in your browser.',
    url: `${SITE_URL}/character`,
    type: 'website',
  },
};

export default function CharacterStudioPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Character Studio', path: '/character' },
          ]),
          softwareApplicationJsonLd({
            name: 'Character Studio',
            description:
              'Word counter, case converter, find & replace, Markdown preview, and regex tester - all running locally in your browser.',
            path: '/character',
            category: 'UtilitiesApplication',
          }),
        ]}
      />
      <CharacterStudioClient />
    </>
  );
}
