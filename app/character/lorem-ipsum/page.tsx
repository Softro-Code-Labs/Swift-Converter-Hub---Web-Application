import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
} from '@/components/seo/JsonLd';
import LoremIpsumTool from '@/features/character/lorem-ipsum/components';

export const metadata: Metadata = {
  title: 'Lorem Ipsum Generator',
  description:
    'Generate classic Lorem Ipsum or random English placeholder text by words, sentences, or paragraphs - instantly in your browser. No server, 100% private.',
  keywords: [
    'lorem ipsum generator',
    'lorem ipsum online',
    'placeholder text generator',
    'dummy text generator',
    'filler text generator online',
    'random text generator free',
    'lorem ipsum paragraphs',
    'lorem ipsum sentences',
    'lorem ipsum by paragraph',
    'sample text generator for design',
    'placeholder copy generator',
    'ipsum text generator free',
  ],
  alternates: {
    canonical: `${SITE_URL}/character/lorem-ipsum`,
  },
  openGraph: {
    title:
      'Lorem Ipsum Generator - Classic & Random Placeholder Text | Character Studio',
    description:
      'Paragraphs, sentences, or words - classic Latin or random English, instant copy and download, no server.',
    url: `${SITE_URL}/character/lorem-ipsum`,
    type: 'website',
  },
};

export default function LoremIpsumPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Character Studio', path: '/character' },
            { name: 'Lorem Ipsum Generator', path: '/character/lorem-ipsum' },
          ]),
          softwareApplicationJsonLd({
            name: 'Lorem Ipsum Generator',
            description:
              'Generate classic Lorem Ipsum or random English placeholder text by words, sentences, or paragraphs - instantly in your browser. No server, 100% private.',
            path: '/character/lorem-ipsum',
            category: 'UtilitiesApplication',
          }),
        ]}
      />
      <LoremIpsumTool />
    </>
  );
}
