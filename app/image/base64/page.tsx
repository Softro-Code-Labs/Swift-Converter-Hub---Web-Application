import { Metadata } from 'next';
import Link from 'next/link';
import { Binary, Code, Zap, Shield } from 'lucide-react';
import Base64Tool from '@/features/image/base64/components/Base64Tool';
import {
  InfoCardGrid,
  TechnicalNote,
  FaqAccordion,
} from '@/features/image/shared/components/page-sections';

export const metadata: Metadata = {
  title: 'Image to Base64 Converter',
  description:
    'Convert images to Base64 strings or decode Base64 back to images. Get raw text, Data URI, CSS, or HTML output. 100% browser-based, nothing uploaded.',
  keywords: [
    // Core Encoding & Transformation Focus
    'image to base64',
    'convert image to base64 string',
    'base64 encoder online',
    'image string converter free',
    'jpeg to base64 converter',
    'png to base64 online',

    // Decoding & Extraction Focus
    'base64 to image converter',
    'base64 decoder online',
    'convert base64 back to image',
    'render base64 string as image',

    // Web Development Implementation Intent
    'data uri converter',
    'base64 image embed css',
    'html img base64 generator',
    'convert image to data url',
    'inline image generator browser',

    // Privacy, Performance & General Utility
    'free base64 image tool',
    'browser base64 converter',
    'no upload base64 encoder',
    'secure local image encoding',
    'offline base64 data uri tool',
  ],
  alternates: { canonical: 'https://swiftconverterhub.com/image/base64' },
  openGraph: {
    title: 'Image to Base64 Converter - Free Online Tool',
    description:
      'Encode images to Base64 or decode back instantly, entirely in your browser.',
    url: 'https://swiftconverterhub.com/image/base64',
    type: 'website',
  },
};

const FEATURES = [
  { icon: Code, label: 'Multiple formats', desc: 'Raw, Data URI, CSS, HTML' },
  { icon: Binary, label: 'Two-way conversion', desc: 'Encode and decode' },
  { icon: Zap, label: 'Instant results', desc: 'No processing delay' },
  { icon: Shield, label: '100% private', desc: 'Never leaves your browser' },
];

const USE_CASES = [
  {
    title: 'Embed in CSS/HTML',
    desc: 'Inline small icons or backgrounds without extra HTTP requests.',
  },
  {
    title: 'API payloads',
    desc: 'Send images as text within JSON request bodies.',
  },
  { title: 'Email templates', desc: 'Embed images directly in HTML emails.' },
];

const OUTPUT_FORMATS = [
  {
    title: 'Raw Base64',
    desc: 'For passing into custom code, database storage, or APIs that expect a bare encoded string.',
  },
  {
    title: 'Data URI',
    desc: 'A complete data: URL you can paste directly into an <img src> or browser address bar.',
  },
  {
    title: 'CSS',
    desc: 'A ready-to-paste background-image declaration for stylesheets.',
  },
  {
    title: 'HTML <img>',
    desc: 'A full image tag you can drop directly into HTML markup.',
  },
];

const BASE64_FAQS = [
  {
    q: 'Why is my Base64 string so much longer than the original file?',
    a: "Base64 encoding increases file size by about 33% because it represents every 3 bytes of binary data as 4 text characters. This is expected and unavoidable - it's the tradeoff for representing binary data as plain text.",
  },
  {
    q: 'Can I decode a Base64 string without the data: prefix?',
    a: "Yes. If you paste just the raw Base64 characters without a data:image/...;base64, prefix, the decoder automatically detects the image format by reading the file's magic bytes.",
  },
  {
    q: 'Is it safe to embed large images as Base64 in my website?',
    a: "Generally not recommended for large images. Base64 strings can't be cached separately by the browser the way a regular image file can, and the 33% size overhead adds up. Base64 works best for small icons, logos, or images under a few KB.",
  },
  {
    q: 'What image formats can I encode?',
    a: "Any image format your browser can read - JPG, PNG, WebP, GIF, BMP, SVG and more. The encoder doesn't care about format since it just converts raw bytes to text.",
  },
  {
    q: 'Why did decoding fail with "invalid Base64"?',
    a: 'Check that you copied the complete string without truncation, and that there are no extra spaces or line breaks accidentally included. Base64 strings should only contain letters, numbers, +, /, and = padding characters.',
  },
];

export default function Base64Page() {
  return (
    <div className="space-y-0">
      <div className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-800">
        <nav className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 mb-5">
          <Link
            href="/"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Home
          </Link>
          <span>›</span>
          <Link
            href="/image"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Image Studio
          </Link>
          <span>›</span>
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            Image ↔ Base64
          </span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-black">
              BASE64
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Image to Base64 Converter
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Encode images into Base64 strings for embedding in code, or decode
              Base64 back into a downloadable image. Get output as raw text,
              Data URI, CSS, or HTML.
            </p>
          </div>

          <div className="hidden sm:grid grid-cols-2 gap-2 shrink-0">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400"
              >
                <Icon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <Base64Tool />
      </div>

      <InfoCardGrid
        title="When to use Base64 encoding"
        accentColor="bg-blue-500"
        columns="grid-cols-1 sm:grid-cols-3"
        variant="plain"
        cards={USE_CASES}
      />

      <InfoCardGrid
        title="Output formats explained"
        accentColor="bg-rose-500"
        columns="grid-cols-1 sm:grid-cols-2"
        cards={OUTPUT_FORMATS}
      />

      <TechnicalNote
        title="A note on file size"
        accentColor="bg-emerald-500"
        paragraphs={[
          "Base64 encoding converts binary data into text using a 64-character alphabet, which inherently increases size by roughly 33% compared to the original binary file. This is the mathematical cost of representing binary data as text - it's not something any encoder can avoid. For large images, consider whether a regular file upload or URL reference would serve your use case better than inline Base64.",
        ]}
      />

      <FaqAccordion
        title="Frequently asked questions"
        accentColor="bg-blue-500"
        items={BASE64_FAQS}
      />
    </div>
  );
}
