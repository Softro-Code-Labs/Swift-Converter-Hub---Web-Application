import { Metadata } from 'next';
import AudioStudioClient from './AudioStudioClient';

export const metadata: Metadata = {
  title: 'Audio Studio - Free Browser-Based Audio Tools (Coming Soon)',
  description:
    'Convert, trim, and adjust audio files entirely in your browser. MP3, WAV, FLAC support coming soon - no uploads, no account required.',
  keywords: [
    'audio converter',
    'audio converter free',
    'audio converter online',
    'free audio tools browser',
    'mp3 wav flac converter',
    'trim audio online free',
    'browser based audio editor',
    'no upload audio converter',
    'adjust audio bitrate online',
    'audio format converter free',
  ],
  alternates: { canonical: 'https://swiftconverterhub.com/audio' },
  openGraph: {
    title: 'Audio Studio - Free Browser-Based Audio Tools',
    description:
      'Convert and edit audio files entirely in your browser. No uploads, no account.',
    url: 'https://swiftconverterhub.com/audio',
    type: 'website',
  },
};

export default function AudioStudioPage() {
  return <AudioStudioClient />;
}
