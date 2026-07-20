import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
} from '@/components/seo/JsonLd';
import FindReplaceTool from '@/features/character/find-replace/components';

export const metadata: Metadata = {
  title: 'Find & Replace',
  description:
    'Find and replace text with live match highlighting. Supports plain text and regular expressions with case-sensitive, whole-word, and regex modes - all in your browser, 100% private.',
  keywords: [
    'find and replace online',
    'text find replace tool',
    'regex find replace browser',
    'bulk text replace online',
    'live match highlighting',
    'regex tester replace',
    'case sensitive find replace',
    'whole word replace tool',
    'multiline find replace tool',
    'batch text replace online',
    'regex substitution tool',
    'search and replace text online',
  ],
  alternates: {
    canonical: `${SITE_URL}/character/find-replace`,
  },
  openGraph: {
    title: 'Find & Replace - Live Regex & Plain Text | Character Studio',
    description:
      'Live match highlighting, plain text or regex, replace one or all - instant, private, no server.',
    url: `${SITE_URL}/character/find-replace`,
    type: 'website',
  },
};

export default function FindReplacePage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Character Studio', path: '/character' },
            { name: 'Find & Replace', path: '/character/find-replace' },
          ]),
          softwareApplicationJsonLd({
            name: 'Find & Replace',
            description:
              'Find and replace text with live match highlighting. Supports plain text and regular expressions with case-sensitive, whole-word, and regex modes - all in your browser, 100% private.',
            path: '/character/find-replace',
            category: 'UtilitiesApplication',
          }),
        ]}
      />
      <FindReplaceTool />
    </>
  );
}
