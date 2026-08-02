import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import { Binary, Zap, Shield, KeyRound } from 'lucide-react';
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
  TechnicalNote,
  FaqAccordion,
} from '@/features/shared/components/page-sections';
import Base64TextTool from '@/features/data/base64-text/components';

export const metadata: Metadata = {
  title: 'Base64 Text Encoder / Decoder',
  description:
    'Encode plain text to Base64 or decode Base64 strings instantly in your browser. Supports standard and URL-safe Base64, Unicode, and automatic JWT token inspection - no server, no upload, 100% private.',
  keywords: [
    'base64 encoder online',
    'base64 decoder online',
    'base64 encode decode free',
    'base64 text encoder browser',
    'base64 string decoder online',
    'base64 no upload tool',
    'base64 instant encoder',
    'base64 converter free',
    'jwt decoder online free',
    'url safe base64 encoder',
    'unicode base64 converter',
    'decode jwt token online',
  ],
  alternates: {
    canonical: `${SITE_URL}/data/base64-text`,
  },
  openGraph: {
    title: 'Base64 Text Encoder / Decoder - With JWT Inspector | Data Studio',
    description:
      'Encode text, decode Base64, inspect JWT tokens - URL-safe support, Unicode, expiry detection, instant, no server.',
    url: `${SITE_URL}/data/base64-text`,
    type: 'website',
  },
};

const STEPS = [
  {
    step: '01',
    title: 'Paste text or a Base64 string',
    desc: 'The tool auto-detects a JWT if you paste one for decoding.',
  },
  {
    step: '02',
    title: 'Pick standard or URL-safe',
    desc: 'URL-safe swaps +/ for -_ and drops padding, for use in URLs and filenames.',
  },
  {
    step: '03',
    title: 'Copy the result',
    desc: 'JWTs additionally show a decoded header and payload, plus expiry status.',
  },
];

const FAQS = [
  {
    q: 'What is the difference between standard and URL-safe Base64?',
    a: "Standard Base64 uses + and / in its alphabet and pads the output with = characters. Those symbols have special meaning inside a URL or a filename, so URL-safe Base64 (used in JWTs and many web APIs) replaces + with -, / with _, and drops the trailing = padding entirely.",
  },
  {
    q: 'Does this decode and verify JWT signatures?',
    a: "No - it decodes and displays the header and payload of a JSON Web Token, which are just Base64URL-encoded JSON, and it does check the token's exp/iat timestamps to tell you if it has expired. It does not verify the cryptographic signature, since that requires the issuer's secret or public key, which this tool never has access to.",
  },
  {
    q: 'Can Base64 handle non-English text and emoji?',
    a: 'Yes - text is converted to its UTF-8 byte representation before encoding, so accented letters, CJK characters, and emoji all round-trip correctly through encode and decode.',
  },
  {
    q: 'Why did decoding fail with an error?',
    a: "Base64 decoding fails if the input contains characters outside its alphabet, or has incorrect padding for its length. This usually means the string was truncated when copied, or is actually URL-safe Base64 being decoded in standard mode (or vice versa) - try toggling the URL-safe option.",
  },
  {
    q: 'Is my text or token uploaded anywhere?',
    a: "No. Encoding and decoding both run locally using your browser's built-in btoa/atob functions - nothing is sent to a server, which matters especially for JWTs, since their payload often contains user or session data.",
  },
];

export default function Base64TextPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Data Studio', path: '/data' },
            { name: 'Base64 Text Encoder / Decoder', path: '/data/base64-text' },
          ]),
          softwareApplicationJsonLd({
            name: 'Base64 Text Encoder / Decoder',
            description:
              'Encode plain text to Base64 or decode Base64 strings instantly in your browser. Supports standard and URL-safe Base64, Unicode, and automatic JWT token inspection - no server, no upload, 100% private.',
            path: '/data/base64-text',
            category: 'DeveloperApplication',
          }),
          howToJsonLd({
            name: 'How to encode or decode Base64 text',
            description:
              'Encode text to Base64 or decode Base64 back to text, with JWT inspection.',
            steps: STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(FAQS),
        ]}
      />

      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Data Studio', path: '/data' },
          { name: 'Base64 Text Encoder / Decoder', path: '/data/base64-text' },
        ]}
        badges={[{ label: 'BASE64', color: 'blue' }]}
        title="Encode & Decode Base64 Text"
        description="Encode plain text to Base64 or decode it back, with standard and URL-safe modes, full Unicode support, and automatic JWT header/payload inspection."
        features={[
          { icon: Shield, label: '100% private' },
          { icon: Zap, label: 'Instant' },
          { icon: Binary, label: 'Standard or URL-safe' },
          { icon: KeyRound, label: 'JWT inspector' },
        ]}
      />

      <div className="px-6 py-6">
        <Base64TextTool />
      </div>

      <StepList title="How it works" accentColor="bg-blue-500" steps={STEPS} />

      <TechnicalNote
        title="How encoding and JWT decoding work"
        accentColor="bg-emerald-500"
        paragraphs={[
          "Text is first converted to UTF-8 bytes, then encoded to Base64 using the browser's native btoa function (and reversed with atob for decoding) - the UTF-8 step is what makes non-ASCII characters round-trip correctly, since btoa alone only handles single-byte character codes. URL-safe mode applies a simple character substitution afterward: + becomes -, / becomes _, and trailing = padding is stripped.",
          'A JSON Web Token is just three Base64URL-encoded segments (header, payload, signature) joined by dots. The JWT inspector splits on those dots, Base64URL-decodes the first two segments back to JSON, and separately checks the exp and iat numeric timestamps against the current time to report whether the token has expired - all without touching the signature segment.',
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
