import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import { Hash, Zap, Shield, KeyRound } from 'lucide-react';
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
import HashGeneratorTool from '@/features/character/hash-generator/components';

export const metadata: Metadata = {
  title: 'Hash Generator',
  description:
    'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text or files using the Web Crypto API - with optional HMAC signing. Instant, private, nothing leaves your browser.',
  keywords: [
    'hash generator online',
    'sha256 hash generator',
    'sha512 hash generator',
    'md5 hash generator online',
    'sha1 hash generator free',
    'generate hash from text',
    'text hash calculator online',
    'hash string online free',
    'hmac generator online',
    'checksum generator online',
    'file hash calculator browser',
    'web crypto api hash tool',
  ],
  alternates: {
    canonical: `${SITE_URL}/character/hash-generator`,
  },
  openGraph: {
    title:
      'Hash Generator - MD5, SHA-1, SHA-256, SHA-512 & HMAC | Character Studio',
    description:
      'Hash text or files with MD5, SHA-1, SHA-256, SHA-512 and HMAC - computed locally, nothing sent to any server.',
    url: `${SITE_URL}/character/hash-generator`,
    type: 'website',
  },
};

const STEPS = [
  {
    step: '01',
    title: 'Enter text or choose a file',
    desc: 'Type text directly, or select a file to hash its raw bytes.',
  },
  {
    step: '02',
    title: 'Pick an algorithm',
    desc: 'MD5, SHA-1, SHA-256, or SHA-512 - optionally sign with an HMAC key.',
  },
  {
    step: '03',
    title: 'Copy the digest',
    desc: 'The hex-encoded hash appears instantly and updates as you type.',
  },
];

const ALGORITHM_CARDS = [
  {
    title: 'MD5',
    meta: '128-bit / 32 hex chars',
    desc: 'Fast, but not collision-resistant. Fine for checksums, not for security.',
  },
  {
    title: 'SHA-1',
    meta: '160-bit / 40 hex chars',
    desc: "Deprecated for security use since 2017's SHAttered collision, still seen in legacy systems and Git.",
  },
  {
    title: 'SHA-256',
    meta: '256-bit / 64 hex chars',
    desc: 'Part of the SHA-2 family and the current default for most security use cases.',
  },
  {
    title: 'SHA-512',
    meta: '512-bit / 128 hex chars',
    desc: 'Larger digest than SHA-256, from the same SHA-2 family, often faster on 64-bit CPUs.',
  },
];

const FAQS = [
  {
    q: 'Is this safe to use for passwords?',
    a: "No. None of these algorithms are designed for password storage - they're fast general-purpose hash functions, which makes them easy to brute-force with modern hardware. Password storage needs a slow, salted algorithm like bcrypt, scrypt, or Argon2, which this tool does not provide.",
  },
  {
    q: 'Why does MD5 use a different code path than the others?',
    a: "Because the browser's built-in Web Crypto API (SubtleCrypto) doesn't implement MD5 at all - it was dropped for security reasons. This tool includes a small pure-JavaScript MD5 implementation just for that algorithm, while SHA-1, SHA-256, and SHA-512 use the native, browser-optimized SubtleCrypto implementation.",
  },
  {
    q: 'What does HMAC do differently from a plain hash?',
    a: "A plain hash proves a file or message hasn't been altered. An HMAC (Hash-based Message Authentication Code) additionally mixes in a secret key, so it proves both integrity and that whoever produced it knew the key - useful for verifying webhook payloads or API request signatures.",
  },
  {
    q: 'Can I hash an entire file, not just text?',
    a: "Yes - select a file instead of typing text, and the tool reads its raw bytes and hashes them directly, which is exactly what you'd compare against a published checksum (like a SHA-256 sum listed on a download page) to verify a file wasn't corrupted or tampered with.",
  },
  {
    q: 'Is my text or file uploaded anywhere?',
    a: "No. Every hash is computed locally - SHA-1/256/512 via your browser's native Web Crypto API, MD5 via an in-page JavaScript implementation. Nothing is sent over the network.",
  },
];

export default function HashGeneratorPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Character Studio', path: '/character' },
            { name: 'Hash Generator', path: '/character/hash-generator' },
          ]),
          softwareApplicationJsonLd({
            name: 'Hash Generator',
            description:
              'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text or files using the Web Crypto API - with optional HMAC signing. Instant, private, nothing leaves your browser.',
            path: '/character/hash-generator',
            category: 'UtilitiesApplication',
          }),
          howToJsonLd({
            name: 'How to generate a hash online',
            description:
              'Hash text or files with MD5, SHA-1, SHA-256, or SHA-512, with optional HMAC signing.',
            steps: STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(FAQS),
        ]}
      />

      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Character Studio', path: '/character' },
          { name: 'Hash Generator', path: '/character/hash-generator' },
        ]}
        badges={[{ label: 'HASH', color: 'purple' }]}
        title="Generate MD5, SHA-1, SHA-256 & SHA-512 Hashes"
        description="Hash text or a whole file with MD5, SHA-1, SHA-256, or SHA-512, with optional HMAC signing - computed locally using your browser's Web Crypto API."
        features={[
          { icon: Shield, label: '100% private' },
          { icon: Zap, label: 'Instant, live' },
          { icon: Hash, label: '4 algorithms' },
          { icon: KeyRound, label: 'HMAC signing' },
        ]}
      />

      <div className="px-6 py-6">
        <HashGeneratorTool />
      </div>

      <StepList title="How it works" accentColor="bg-blue-500" steps={STEPS} />

      <InfoCardGrid
        title="Choosing an algorithm"
        accentColor="bg-purple-500"
        columns="grid-cols-1 sm:grid-cols-2"
        cards={ALGORITHM_CARDS}
      />

      <TechnicalNote
        title="How these hashes are computed"
        accentColor="bg-emerald-500"
        paragraphs={[
          "SHA-1, SHA-256, and SHA-512 are computed with SubtleCrypto.digest(), the native cryptographic primitive built into every modern browser - the same implementation used by web apps that verify file integrity or generate content checksums. MD5 is not available in SubtleCrypto (browsers dropped it), so this tool includes a small standalone MD5 implementation purely for compatibility with older checksums you might need to verify.",
          "When HMAC is enabled, your key is imported as a cryptographic key via SubtleCrypto.importKey() and used to sign the input with SubtleCrypto.sign() - a completely different operation from a plain digest, since the output depends on both the input and the secret key.",
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
