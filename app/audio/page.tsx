import { Metadata } from 'next';
import AudioStudioClient from './AudioStudioClient';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
  studioToolsJsonLd,
} from '@/components/seo/JsonLd';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/audio',
  title: 'Free Online Audio Tools - Convert, Trim & Merge',
  description:
    'Convert, trim, merge, compress and change the volume of audio files free in your browser. MP3, WAV, FLAC, AAC, M4A, OGG and more. No upload, no sign-up.',
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
  ],
});

export default function AudioStudioPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Audio Studio', path: '/audio' },
          ]),
          studioToolsJsonLd('audio'),
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
