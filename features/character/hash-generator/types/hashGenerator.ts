export type HashAlgorithm = 'MD5' | 'SHA-1' | 'SHA-256' | 'SHA-512';

export type InputMode = 'text' | 'file';

export interface HashResult {
  algorithm: HashAlgorithm;
  hex: string;
  length: number; // bits
  status: 'idle' | 'computing' | 'done' | 'error';
  error: string | null;
}

export interface HashOptions {
  hmac: boolean;
  hmacKey: string;
  uppercase: boolean;
}

export const HASH_META: Record<
  HashAlgorithm,
  { bits: number; desc: string; warning?: string }
> = {
  MD5: {
    bits: 128,
    desc: '32 hex chars',
    warning: 'Cryptographically broken - use for checksums only',
  },
  'SHA-1': {
    bits: 160,
    desc: '40 hex chars',
    warning: 'Deprecated for security use - legacy only',
  },
  'SHA-256': {
    bits: 256,
    desc: '64 hex chars',
  },
  'SHA-512': {
    bits: 512,
    desc: '128 hex chars',
  },
};
