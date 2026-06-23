import { Metadata } from 'next';
import AudioStudioClient from './AudioStudioClient';

export const metadata: Metadata = {
  title: 'Audio Studio - Free Browser-Based Audio Tools',
  description:
    'Convert, trim, and adjust audio files entirely in your browser. MP3, WAV, FLAC support coming soon - no uploads, no account required.',
  keywords: [
    // Core Tool & Conversion Intent
    'audio converter online',
    'free audio converter',
    'mp3 converter browser',
    'wav to mp3 converter free',
    'flac to mp3 high quality',
    'convert audio to m4a',

    // Privacy & Browser Architecture Specifics
    'no upload audio converter',
    'completely private audio converter',
    'local audio processing online',
    'secure browser audio editor',

    // Editing & Modification Focus
    'trim audio online free',
    'mp3 cutter no upload',
    'compress audio files online',
    'adjust audio bitrate online',
    'change audio volume browser',

    // Batch & Advanced Feature Intent
    'bulk audio converter online',
    'convert multiple mp3 files',
    'extract audio from video free',
    'free audio tools browser',
    'ogg to mp3 converter online',
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
