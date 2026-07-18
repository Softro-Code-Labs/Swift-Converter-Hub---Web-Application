import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
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
