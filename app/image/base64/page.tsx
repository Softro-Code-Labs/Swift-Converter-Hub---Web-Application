import { Metadata } from 'next';
import { Binary, Code, Zap, Shield } from 'lucide-react';
import Base64Tool from '@/features/image/base64/components/Tool';
import {
  InfoCardGrid,
  TechnicalNote,
  FaqAccordion,
  ToolPageHeader,
} from '@/features/image/shared/components/page-sections';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
  faqPageJsonLd,
} from '@/components/seo/JsonLd';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/image/base64',
  title: 'Image to Base64 Converter - Encode & Decode Online',
  description:
    'Convert images to Base64 data URIs for HTML and CSS, or decode Base64 back to an image file. Raw, Data URI, CSS and <img> output. Free, runs in your browser.',
  keywords: [
    'image to base64',
    'convert image to base64 string',
    'base64 encoder online',
    'image string converter free',
    'jpeg to base64 converter',
    'png to base64 online',
    'base64 to image converter',
    'base64 decoder online',
    'data uri image converter',
    'css background image base64',
    'html embed image base64',
    'svg to base64 converter',
  ],
});

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
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Image Studio', path: '/image' },
            { name: 'Image to Base64 Converter', path: '/image/base64' },
          ]),
          softwareApplicationJsonLd({
            name: 'Image to Base64 Converter',
            description:
              'Convert images to Base64 strings or decode Base64 back to images, entirely in your browser.',
            path: '/image/base64',
            category: 'MultimediaApplication',
          }),
          faqPageJsonLd(BASE64_FAQS),
        ]}
      />
      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Image Studio', path: '/image' },
          { name: 'Image to Base64 Converter', path: '/image/base64' },
        ]}
        title={'Image to Base64 Converter'}
        description={
          'Encode images into Base64 strings for embedding in code, or decode Base64 back into a downloadable image. Get output as raw text, Data URI, CSS, or HTML.'
        }
        features={FEATURES}
      />

      <div className="@container px-5 py-6 sm:px-8 sm:py-8">
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
