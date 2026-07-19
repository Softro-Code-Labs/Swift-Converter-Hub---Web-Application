import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import AudioFormatsClient from './AudioFormatsClient';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
} from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Audio Format Converter',
  description:
    'Convert between MP3, WAV, OGG, FLAC, AAC, M4A, OPUS, WMA, AIFF, AC3, AU and MP2 instantly in your browser. Batch convert, adjust bitrate, and download - no uploads, no account, powered by WebAssembly.',
  keywords: [
    'audio format converter online',
    'convert audio formats free',
    'browser audio converter',
    'batch audio converter online',
    'audio file format changer',
    'mp3 wav flac converter',
    'wma to mp3 converter',
    'webassembly audio converter',
    'private audio converter no upload',
  ],
  alternates: {
    canonical: `${SITE_URL}/audio/convert`,
  },
  openGraph: {
    title: 'Audio Format Converter | Audio Studio',
    description:
      'Convert between 12 audio formats - MP3, WAV, OGG, FLAC, AAC, M4A, OPUS, WMA, AIFF, AC3, AU, MP2 - instant, private, no server.',
    url: `${SITE_URL}/audio/convert`,
    type: 'website',
  },
};

export default function AudioFormatsPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Audio Studio', path: '/audio' },
            { name: 'Format Converter', path: '/audio/convert' },
          ]),
          softwareApplicationJsonLd({
            name: 'Audio Format Converter',
            description:
              'Convert between 12 audio formats, including MP3, WAV, OGG, FLAC, AAC, M4A, OPUS, WMA, and AIFF, entirely in your browser.',
            path: '/audio/convert',
            category: 'MultimediaApplication',
          }),
        ]}
      />
      <AudioFormatsClient />
    </>
  );
}
