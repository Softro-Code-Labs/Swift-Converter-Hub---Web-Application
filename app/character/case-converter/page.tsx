import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
} from '@/components/seo/JsonLd';
import CaseConverterTool from '@/features/character/case-converter/components';

export const metadata: Metadata = {
  title: 'Case Converter',
  description:
    'Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, PascalCase, and more - instantly in your browser. No server, 100% private.',
  keywords: [
    'case converter online',
    'text case converter',
    'uppercase converter',
    'lowercase converter',
    'title case converter',
    'camelCase converter',
    'snake_case converter',
    'kebab-case converter',
    'pascalcase converter online',
    'sentence case converter',
    'alternating case converter',
    'text transform tool free',
  ],
  alternates: {
    canonical: `${SITE_URL}/character/case-converter`,
  },
  openGraph: {
    title: 'Case Converter - 12 Case Formats Instantly | Character Studio',
    description:
      'UPPERCASE, camelCase, snake_case, Title Case and 8 more - instant, private, no server.',
    url: `${SITE_URL}/character/case-converter`,
    type: 'website',
  },
};

export default function CaseConverterPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Character Studio', path: '/character' },
            { name: 'Case Converter', path: '/character/case-converter' },
          ]),
          softwareApplicationJsonLd({
            name: 'Case Converter',
            description:
              'Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, PascalCase, and more - instantly in your browser. No server, 100% private.',
            path: '/character/case-converter',
            category: 'UtilitiesApplication',
          }),
        ]}
      />
      <CaseConverterTool />
    </>
  );
}
