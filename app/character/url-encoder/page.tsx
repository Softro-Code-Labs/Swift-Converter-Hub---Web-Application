import { Metadata } from 'next';
import UrlEncoderTool from '@/features/character/url-encoder/components';

export const metadata: Metadata = {
  title: 'URL Encoder / Decoder',
  description:
    'Encode or decode URL components using encodeURIComponent and encodeURI, and parse any URL into protocol, host, path, query params, and hash - instantly in your browser, 100% private.',
  keywords: [
    // Core encode/decode intent
    'url encoder online',
    'url decoder online',
    'url encode decode free',
    'encode url online tool',
    'decode url online free',
    'url encoding tool browser',
    'percent encoding online',
    'url percent decode tool',
    'url escape characters online',
    'unescape url string online',

    // encodeURIComponent specific
    'encodeuricomponent online',
    'encodeuricomponent tool free',
    'javascript encodeuricomponent browser',
    'encode query string online',
    'url component encoder free',
    'encode special characters url',
    'url query param encoder',
    'encode ampersand url online',
    'encode space url percent 20',
    'url safe string encoder',

    // encodeURI specific
    'encodeuri online tool',
    'encode full url online',
    'encode uri browser tool',
    'full url encoder free',
    'encode url path online',

    // Decode specific
    'decode percent encoded url',
    'url decode percent signs',
    'decode encoded url string',
    'decode url query params',
    'url decode special characters',

    // URL parser
    'url parser online',
    'parse url into parts',
    'url components parser',
    'extract query params url',
    'url query string parser',
    'parse url protocol host path',
    'url breakdown tool online',
    'url structure analyser free',
    'extract hash from url online',
    'parse url search params browser',

    // Dev use cases
    'api url encoder developer tool',
    'debug url parameters online',
    'url encoding checker free',
    'test url encoding browser',
    'web developer url utility',
    'url encode for api calls',
    'rest api url encoder online',
    'postman url encoder alternative',
    'browser url encode no install',
    'private url encoder no server',
  ],
  alternates: {
    canonical: 'https://swiftconverterhub.com/character/url-encoder',
  },
  openGraph: {
    title:
      'URL Encoder / Decoder - Encode, Decode & Parse URLs | Character Studio',
    description:
      'encodeURIComponent, encodeURI, decode, and full URL parser with query param table - instant, private, no server.',
    url: 'https://swiftconverterhub.com/character/url-encoder',
    type: 'website',
  },
};

export default function UrlEncoderPage() {
  return <UrlEncoderTool />;
}
