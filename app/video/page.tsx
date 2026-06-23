import { Metadata } from 'next';
import VideoStudioClient from './VideoStudioClient';

export const metadata: Metadata = {
  title: 'Video Studio - Free Online Video Tools',
  description:
    'Convert, trim, and compress video files entirely in your browser using a high-performance WebAssembly engine. MP4, WebM, and GIF export - no uploads, completely private.',
  keywords: [
    // High-Volume Core & Format Transformations
    'video converter online free',
    'video converter online',
    'free browser video converter',
    'convert video files free',
    'mp4 webm converter browser',
    'convert mov to mp4 free',

    // Video Trimming & Cutting Intent
    'trim video online no upload',
    'online video cutter free',
    'crop and trim video browser',
    'instant video splitter online',

    // Optimization & Compression Focus
    'compress video file size online',
    'no upload video compressor',
    'reduce mp4 size free browser',
    'shrink video dimensions online',

    // Animated Export Utilities (High Search Volume)
    'video to gif converter free',
    'convert mp4 to animated gif',
    'make transparent gif browser',

    // WebAssembly & Privacy Advantages
    'webassembly video editor free',
    'private video conversion tool',
    'offline video converter online',
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
