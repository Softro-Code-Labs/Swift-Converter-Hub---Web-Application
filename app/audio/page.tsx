import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import AudioStudioClient from './AudioStudioClient';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
} from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Audio Studio - Free Browser-Based Audio Tools',
  description:
    'Convert, trim, merge, compress, and adjust the volume of audio files entirely in your browser. MP3, WAV, OGG, FLAC, AAC, M4A, OPUS, WMA, AIFF and more - no uploads, no account required.',
  keywords: [
    'audio converter online',
    'free audio converter',
    'mp3 converter browser',
    'wav to mp3 converter free',
    'flac to mp3 high quality',
    'trim audio online free',
    'merge audio files online',
    'compress audio files online',
    'normalize audio volume online',
    'no upload audio converter',
    'private audio tools browser',
    'batch audio converter online',
    'online audio editor free',
    'audio studio no install',
    'audio tools no signup',
    'convert and edit audio browser',
  ],
  alternates: { canonical: `${SITE_URL}/audio` },
  openGraph: {
    title: 'Audio Studio - Free Browser-Based Audio Tools',
    description:
      'Convert, trim, merge, compress, and adjust audio files entirely in your browser. No uploads, no account.',
    url: `${SITE_URL}/audio`,
    type: 'website',
  },
};

export default function AudioStudioPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Audio Studio', path: '/audio' },
          ]),
          softwareApplicationJsonLd({
            name: 'Audio Studio',
            description:
              'Convert, trim, merge, compress, and adjust the volume of audio files entirely in your browser - no uploads, no account required.',
            path: '/audio',
            category: 'MultimediaApplication',
          }),
        ]}
      />
      <AudioStudioClient />
    </>
  );
}
