import { Metadata } from 'next';
import ImageStudioClient from './ImageStudioClient';

export const metadata: Metadata = {
  title: 'Image Studio - Free Online Image Tools',
  description:
    'Convert, crop, compress, adjust, and inspect images entirely in your browser. 120+ formats supported, zero uploads, no account required - a complete free image toolkit powered by WebAssembly.',
  keywords: [
    // Core suite identity
    'image studio online free',
    'free online image tools',
    'browser based image editor',
    'all in one image toolkit',
    'complete image editing suite',
    'online image workshop free',
    'web image processing tools',
    'image utility suite browser',
    'free creative cloud alternative',
    'lightweight image editor no download',

    // Format conversion
    'image format converter online',
    'convert image formats browser',
    'bulk image converter free',
    'batch image format converter',
    '120 image formats supported',
    'convert heic to jpg browser',
    'webp image converter online',
    'avif image converter free',
    'svg to png converter browser',
    'raw image converter online',

    // Crop & resize
    'crop image online free',
    'resize image browser no upload',
    'image resizer free online',
    'crop image to aspect ratio',
    'pixel perfect image cropper',
    'image dimensions resizer tool',
    'free photo cropper browser',
    'bulk image resizer online',
    'image scale tool no server',
    'custom size image cropper',

    // Compression & optimization
    'compress image online free',
    'reduce image file size browser',
    'lossless image compressor free',
    'image optimizer no upload',
    'shrink image size online',
    'optimize images core web vitals',
    'webp avif image optimizer',
    'bulk image compressor browser',
    'image size reducer free tool',
    'photo compressor no account',

    // Adjust & filter
    'adjust image brightness online',
    'image filter tool browser',
    'grayscale image converter free',
    'contrast saturation adjuster',
    'photo editor no download',
    'image adjustment tool online',
    'blur sharpen image browser',
    'sepia filter image tool',
    'online photo filter free',
    'image effects no upload',

    // Metadata & privacy
    'view exif data online free',
    'exif metadata viewer browser',
    'gps data photo inspector',
    'strip exif data online',
    'private image tool no upload',
    'zero upload image editor',
    'webassembly image processing',
    'offline image tools browser',
    'secure image converter private',
    'local image processing browser',
  ],
  alternates: { canonical: 'https://swiftconverterhub.com/image' },
  openGraph: {
    title: 'Image Studio - Free Browser-Based Image Tools',
    description:
      'Convert, crop, compress, and adjust images entirely in your browser. 120+ formats, zero uploads.',
    url: 'https://swiftconverterhub.com/image',
    type: 'website',
  },
};

export default function ImageStudioPage() {
  return <ImageStudioClient />;
}
