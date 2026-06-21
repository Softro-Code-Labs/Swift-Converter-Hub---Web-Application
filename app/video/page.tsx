import { Metadata } from 'next';
import VideoStudioClient from './VideoStudioClient';

export const metadata: Metadata = {
  title: 'Video Studio - Free Online Video Tools (Coming Soon)',
  description:
    'Convert, trim, and compress video files entirely in your browser using a high-performance WebAssembly engine. MP4, WebM, and GIF export - no uploads, completely private.',
  keywords: [
    'video converter',
    'video converter online',
    'video converter online free',
    'trim video online no upload',
    'compress video file size online',
    'video to gif converter free',
    'mp4 webm converter browser',
    'browser based video editor',
    'private video conversion tool',
    'no upload video compressor',
  ],
  alternates: { canonical: 'https://swiftconverterhub.com/video' },
  openGraph: {
    title: 'Video Studio - Free Online Video Tools',
    description:
      'Convert and edit video entirely in your browser with a professional WebAssembly engine.',
    url: 'https://swiftconverterhub.com/video',
    type: 'website',
  },
};

export default function VideoStudioPage() {
  return <VideoStudioClient />;
}
