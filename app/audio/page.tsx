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
    'Convert, trim, and adjust audio files entirely in your browser. MP3, WAV, FLAC support coming soon - no uploads, no account required.',
  keywords: [
    'audio converter online',
    'free audio converter',
    'mp3 converter browser',
    'wav to mp3 converter free',
    'flac to mp3 high quality',
    'convert audio to m4a',
    'no upload audio converter',
    'completely private audio converter',
    'local audio processing online',
    'secure browser audio editor',
    'trim audio online free',
    'mp3 cutter no upload',
    'compress audio files online',
    'adjust audio bitrate online',
    'change audio volume browser',
    'bulk audio converter online',
    'convert multiple mp3 files',
    'extract audio from video free',
    'free audio tools browser',
    'ogg to mp3 converter online',
  ],
  alternates: { canonical: `${SITE_URL}/audio` },
  openGraph: {
    title: 'Audio Studio - Free Browser-Based Audio Tools',
    description:
      'Convert and edit audio files entirely in your browser. No uploads, no account.',
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
              'Convert, trim, and adjust audio files entirely in your browser - no uploads, no account required.',
            path: '/audio',
            category: 'MultimediaApplication',
          }),
        ]}
      />
      <AudioStudioClient />
    </>
  );
}
