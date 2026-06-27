import { Metadata } from 'next';
import ImageFormatsClient from './ImageFormatsClient';

export const metadata: Metadata = {
  title: 'Format Converter',
  description:
    'Convert between 120+ image formats including JPG, PNG, WebP, AVIF, HEIC, SVG, TIFF and more - instantly in your browser. No uploads, no account, powered by WebAssembly.',
  keywords: [
    // Core tool identity
    'image format converter online',
    'convert image formats free',
    'online image converter 120 formats',
    'browser image format converter',
    'free image format conversion tool',
    'bulk image format converter',
    'batch convert image formats online',
    'image file format changer',
    'image type converter browser',
    'webassembly image converter free',

    // JPG conversions
    'jpg to png converter online',
    'jpg to webp converter free',
    'jpg to avif converter browser',
    'jpg to tiff converter online',
    'jpg to ico converter free',
    'jpg to bmp converter browser',
    'jpg to svg converter online',
    'jpg to pdf converter free',
    'jpeg to png online free',
    'jpeg to webp converter browser',

    // PNG conversions
    'png to jpg converter online',
    'png to webp converter free',
    'png to avif converter browser',
    'png to ico converter online',
    'png to tiff converter free',
    'png to pdf converter browser',
    'png to bmp converter online',
    'png transparent to jpg converter',
    'png to svg converter free',
    'png to gif converter browser',

    // Modern format conversions
    'webp to jpg converter online',
    'webp to png converter free',
    'avif to jpg converter browser',
    'avif to png converter online',
    'heic to jpg converter free',
    'heic to png converter browser',
    'heif to jpg converter online',
    'jxl converter online free',
    'avif converter online free',
    'webp converter all formats',

    // Specialty formats
    'svg to png converter browser',
    'svg to jpg converter online',
    'eps to png converter free',
    'pdf to png converter browser',
    'tiff to jpg converter online',
    'bmp to jpg converter free',
    'psd to png converter browser',
    'ico to png converter online',
    'gif to png converter free',
    'raw to jpg converter browser',

    // Features & privacy
    'smart conversion compatibility matrix',
    'image converter no upload required',
    'private image converter browser',
    'offline image format converter',
    'instant image format converter',
    'secure image converter no server',
    'no account image converter free',
    'local image converter browser',
    'image converter zero tracking',
    'fast image format converter free',
  ],
  alternates: {
    canonical: 'https://swiftconverterhub.com/image/convert',
  },
  openGraph: {
    title: 'Image Format Converter - 120+ Formats | Image Studio',
    description:
      'Convert between JPG, PNG, WebP, AVIF, HEIC, SVG and 114 more formats - instant, private, no server.',
    url: 'https://swiftconverterhub.com/image/convert',
    type: 'website',
  },
};

export default function ImageFormatsPage() {
  return <ImageFormatsClient />;
}
