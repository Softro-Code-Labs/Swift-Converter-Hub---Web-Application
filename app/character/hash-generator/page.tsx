import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
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

export default function HashGeneratorPage() {
  return <HashGeneratorTool />;
}
