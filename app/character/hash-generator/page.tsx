import { Metadata } from 'next';
import HashGeneratorTool from '@/features/character/hash-generator/components';

export const metadata: Metadata = {
  title: 'Hash Generator',
  description:
    'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from text or files using the Web Crypto API - with optional HMAC signing. Instant, private, nothing leaves your browser.',
  keywords: [
    // Core intent
    'hash generator online',
    'sha256 hash generator',
    'sha512 hash generator',
    'md5 hash generator online',
    'sha1 hash generator free',
    'generate hash from text',
    'text hash calculator online',
    'hash string online free',
    'cryptographic hash tool',
    'online hash function tool',

    // Algorithm specific
    'sha-256 hash online',
    'sha-512 hash calculator',
    'sha-1 checksum generator',
    'md5 checksum calculator',
    'sha256 checksum tool',
    'sha512 text hasher free',
    'compute md5 hash browser',
    'generate sha hash online',
    'sha hash all algorithms',
    'compare hash algorithms online',

    // File hashing
    'file hash generator online',
    'hash file browser tool',
    'file checksum calculator',
    'sha256 file hash checker',
    'md5 file hash online',
    'verify file integrity hash',
    'file hash no upload server',
    'browser file hasher free',
    'local file checksum tool',
    'drag drop file hash generator',

    // HMAC
    'hmac generator online',
    'hmac sha256 online tool',
    'hmac sha512 calculator',
    'generate hmac signature',
    'hmac key hash browser',
    'message authentication code tool',
    'hmac sha1 online free',
    'api signature hmac tool',
    'hmac secret key generator',
    'jwt hmac verifier tool',

    // Privacy & security
    'private hash generator no server',
    'client side hash tool',
    'offline hash calculator browser',
    'web crypto api hash tool',
    'secure hash generator browser',
    'no upload hash generator',
    'hash text locally browser',
    'password hash checker tool',
    'data integrity hash checker',
    'developer hash utility free',
  ],
  alternates: {
    canonical: 'https://swiftconverterhub.com/character/hash-generator',
  },
  openGraph: {
    title:
      'Hash Generator - MD5, SHA-1, SHA-256, SHA-512 & HMAC | Character Studio',
    description:
      'Hash text or files with MD5, SHA-1, SHA-256, SHA-512 and HMAC - computed locally, nothing sent to any server.',
    url: 'https://swiftconverterhub.com/character/hash-generator',
    type: 'website',
  },
};

export default function HashGeneratorPage() {
  return <HashGeneratorTool />;
}
