import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
} from '@/components/seo/JsonLd';
import RegexTesterTool from '@/features/character/regex-tester/components';

export const metadata: Metadata = {
  title: 'Regex Tester',
  description:
    'Test regular expressions live with match highlighting, capture group inspection, and flag controls (i, m, s, u). Powered by the JavaScript RegExp engine - instant, private, no server.',
  keywords: [
    'regex tester online',
    'regular expression tester',
    'live regex matcher',
    'regex capture groups',
    'javascript regex tester',
    'regex flags online',
    'regex debugger browser',
    'regex match highlighter',
    'regex pattern tester online',
    'regex online sandbox',
    'test regular expression online free',
    'regex validator browser',
  ],
  alternates: {
    canonical: `${SITE_URL}/character/regex-tester`,
  },
  openGraph: {
    title: 'Regex Tester - Live Matching & Capture Groups | Character Studio',
    description:
      'Live highlights, capture group inspector, flag toggles, quick reference - instant, private, no server.',
    url: `${SITE_URL}/character/regex-tester`,
    type: 'website',
  },
};

export default function RegexTesterPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Character Studio', path: '/character' },
            { name: 'Regex Tester', path: '/character/regex-tester' },
          ]),
          softwareApplicationJsonLd({
            name: 'Regex Tester',
            description:
              'Test regular expressions live with match highlighting, capture group inspection, and flag controls (i, m, s, u). Powered by the JavaScript RegExp engine - instant, private, no server.',
            path: '/character/regex-tester',
            category: 'UtilitiesApplication',
          }),
        ]}
      />
      <RegexTesterTool />
    </>
  );
}
