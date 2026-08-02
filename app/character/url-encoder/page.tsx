import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import { Link2, Zap, Shield, ListTree } from 'lucide-react';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
  faqPageJsonLd,
  howToJsonLd,
} from '@/components/seo/JsonLd';
import {
  ToolPageHeader,
  StepList,
  InfoCardGrid,
  TechnicalNote,
  FaqAccordion,
} from '@/features/shared/components/page-sections';
import UrlEncoderTool from '@/features/character/url-encoder/components';

export const metadata: Metadata = {
  title: 'URL Encoder / Decoder',
  description:
    'Encode or decode URL components using encodeURIComponent and encodeURI, and parse any URL into protocol, host, path, query params, and hash - instantly in your browser, 100% private.',
  keywords: [
    'url encoder online',
    'url decoder online',
    'url encode decode free',
    'encode url online tool',
    'decode url online free',
    'url encoding tool browser',
    'percent encoding online',
    'url percent decode tool',
    'uri component encoder',
    'parse url online free',
    'query string parser online',
    'url parts breakdown tool',
  ],
  alternates: {
    canonical: `${SITE_URL}/character/url-encoder`,
  },
  openGraph: {
    title:
      'URL Encoder / Decoder - Encode, Decode & Parse URLs | Character Studio',
    description:
      'encodeURIComponent, encodeURI, decode, and full URL parser with query param table - instant, private, no server.',
    url: `${SITE_URL}/character/url-encoder`,
    type: 'website',
  },
};

const STEPS = [
  {
    step: '01',
    title: 'Paste text or a URL',
    desc: 'A single query value, a full URL, or an already-encoded string.',
  },
  {
    step: '02',
    title: 'Choose encode, decode, or parse',
    desc: 'Component encoding, full-URL encoding, decoding, or a full breakdown into parts.',
  },
  {
    step: '03',
    title: 'Copy the result',
    desc: 'The parsed query parameters are also shown as a readable table.',
  },
];

const MODE_CARDS = [
  {
    title: 'Component',
    meta: 'encodeURIComponent',
    desc: 'Escapes everything except letters, digits, and - _ . ! ~ * \' ( ). Use for a single query value.',
  },
  {
    title: 'Full URL',
    meta: 'encodeURI',
    desc: "Leaves URL-structural characters (: / ? # & =) untouched. Use for a complete URL.",
  },
  {
    title: 'Decode',
    meta: 'decodeURIComponent',
    desc: 'Reverses percent-encoding back to the original characters.',
  },
];

const FAQS = [
  {
    q: 'What is the difference between "component" and "full URL" encoding?',
    a: "encodeURIComponent escapes almost every special character, including / and &, which makes it correct for encoding a single value you're about to insert into a query string or path segment. encodeURI leaves structural URL characters like :, /, ?, #, &, and = untouched, because it assumes you're encoding an entire URL and don't want to break its structure. Using encodeURI on a single query value can leave characters like & unescaped, which would incorrectly split your value into multiple parameters.",
  },
  {
    q: 'Why did decoding fail with an error?',
    a: 'decodeURIComponent throws if the input contains a malformed percent-sequence - for example, a lone "%" not followed by two valid hex digits. This usually means the text was double-encoded, truncated, or was never actually percent-encoded in the first place. This tool falls back to decodeURI automatically where possible, and reports the underlying error otherwise.',
  },
  {
    q: 'What does the URL parser show me?',
    a: "It breaks a full URL down using the browser's native URL parser into its protocol, hostname, port, path, query string, and hash fragment, and additionally lists every query parameter as an individual name/value pair for easy scanning.",
  },
  {
    q: 'Are spaces encoded as %20 or as a plus sign (+)?',
    a: "encodeURIComponent and encodeURI both produce %20 for a space, which is correct for a URL path or fragment. The + convention for spaces is specific to the application/x-www-form-urlencoded format used in query strings by HTML forms, not to URL encoding in general - so if you're comparing against form-encoded data, that's why the space representation differs.",
  },
  {
    q: 'Is my URL or text sent anywhere?',
    a: "No. Encoding, decoding, and parsing all use your browser's native, built-in functions - nothing is transmitted or logged.",
  },
];

export default function UrlEncoderPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Character Studio', path: '/character' },
            { name: 'URL Encoder / Decoder', path: '/character/url-encoder' },
          ]),
          softwareApplicationJsonLd({
            name: 'URL Encoder / Decoder',
            description:
              'Encode or decode URL components using encodeURIComponent and encodeURI, and parse any URL into protocol, host, path, query params, and hash - instantly in your browser, 100% private.',
            path: '/character/url-encoder',
            category: 'UtilitiesApplication',
          }),
          howToJsonLd({
            name: 'How to encode, decode, and parse a URL',
            description:
              'Encode or decode URL text, or break a full URL down into its parts.',
            steps: STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(FAQS),
        ]}
      />

      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Character Studio', path: '/character' },
          { name: 'URL Encoder / Decoder', path: '/character/url-encoder' },
        ]}
        badges={[{ label: 'URL', color: 'blue' }]}
        title="Encode, Decode & Parse URLs"
        description="Encode or decode URL text with encodeURIComponent or encodeURI, or break any full URL down into its protocol, host, path, query parameters, and hash."
        features={[
          { icon: Shield, label: '100% private' },
          { icon: Zap, label: 'Instant' },
          { icon: Link2, label: 'Component or full-URL mode' },
          { icon: ListTree, label: 'Query param breakdown' },
        ]}
      />

      <div className="px-6 py-6">
        <UrlEncoderTool />
      </div>

      <StepList title="How it works" accentColor="bg-blue-500" steps={STEPS} />

      <InfoCardGrid
        title="Choosing a mode"
        accentColor="bg-purple-500"
        columns="grid-cols-1 sm:grid-cols-3"
        cards={MODE_CARDS}
      />

      <TechnicalNote
        title="How encoding and parsing work"
        accentColor="bg-emerald-500"
        paragraphs={[
          "Encoding and decoding use the browser's built-in encodeURIComponent, encodeURI, and decodeURIComponent functions directly - the same functions available to any web page's JavaScript - so the output always matches how a browser or standard HTTP client would interpret the same string. URL parsing uses the native URL constructor to break a string into its structural parts, then reads its searchParams to list each query parameter as a separate name/value pair.",
        ]}
      />

      <FaqAccordion
        title="Frequently asked questions"
        accentColor="bg-blue-500"
        items={FAQS}
      />
    </div>
  );
}
