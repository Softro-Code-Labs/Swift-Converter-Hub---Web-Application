import { Metadata } from 'next';
import CharacterStudioClient from './CharacterStudioClient';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
  studioToolsJsonLd,
} from '@/components/seo/JsonLd';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/character',
  title: 'Free Online Text Tools - Word Counter, Case & Regex',
  description:
    'Twelve free text tools: word counter, case converter, text diff, regex tester, find and replace, hash generator and more. Instant and private.',
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
});

export default function CharacterStudioPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Text Studio', path: '/character' },
          ]),
          studioToolsJsonLd('character'),
          softwareApplicationJsonLd({
            name: 'Text Studio',
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
