import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import Base64TextTool from '@/features/data/base64-text/components';

export const metadata: Metadata = {
  title: 'Base64 Text Encoder / Decoder',
  description:
    'Encode plain text to Base64 or decode Base64 strings instantly in your browser. Supports standard and URL-safe Base64, Unicode, and automatic JWT token inspection - no server, no upload, 100% private.',
  keywords: [
    // Core intent
    'base64 encoder online',
    'base64 decoder online',
    'base64 encode decode free',
    'base64 text encoder browser',
    'base64 string decoder online',
    'base64 no upload tool',
    'base64 instant encoder',
    'base64 converter free',
    'encode text base64 browser',
    'decode base64 text online',

    // Encoding features
    'base64 unicode encoder',
    'base64 utf8 encoder online',
    'base64 emoji encoder browser',
    'base64 multiline encoder',
    'base64 json encoder online',
    'text to base64 converter',
    'string to base64 online',
    'base64 encode textarea',
    'base64 output copy paste',
    'base64 instant no server',

    // Decoding features
    'base64 decode to text',
    'base64 string reader online',
    'decode base64 payload',
    'base64 to plain text free',
    'base64 decode utf8 browser',
    'base64 decode json online',
    'base64 decode download',
    'base64 decode clipboard',
    'base64 invalid string error',
    'base64 padding decoder',

    // URL-safe
    'url safe base64 encoder',
    'base64url encoder online',
    'url safe base64 decoder',
    'base64 minus underscore',
    'base64url no padding encoder',
    'base64 url encoding tool',
    'url safe base64 converter',
    'base64url decode browser',
    'rfc 4648 base64url encoder',
    'base64 url safe free tool',

    // JWT
    'jwt decoder online',
    'jwt inspector browser',
    'jwt token decoder free',
    'decode jwt payload online',
    'jwt header decoder browser',
    'jwt expiry checker online',
    'jwt base64 decode tool',
    'jwt expired checker free',
    'jwt claims viewer browser',
    'decode jwt no server upload',
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

export default function Base64TextPage() {
  return <Base64TextTool />;
}
