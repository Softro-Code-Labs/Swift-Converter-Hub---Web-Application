import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import { Stamp, Zap, Shield, Eye } from 'lucide-react';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
  faqPageJsonLd,
  howToJsonLd,
} from '@/components/seo/JsonLd';
import {
  ToolPageHeader,
  StepList,
  TechnicalNote,
  FaqAccordion,
} from '@/features/shared/components/page-sections';
import PdfWatermarkTool from '@/features/file/pdf-watermark/components';

export const metadata: Metadata = {
  title: 'PDF Watermark',
  description:
    'Add text or image watermarks to every page of a PDF - set opacity, angle, position, and size. Live preview before applying. No server, no upload, 100% private. Powered by pdf-lib.',
  keywords: [
    'pdf watermark online free',
    'add watermark to pdf browser',
    'pdf text watermark tool',
    'pdf image watermark online',
    'watermark pdf no upload',
    'pdf watermark no server',
    'pdf stamp tool browser',
    'confidential watermark pdf',
    'add logo to pdf online',
    'pdf stamp watermark tool',
    'confidential stamp pdf free',
    'watermark opacity pdf tool',
  ],
  alternates: {
    canonical: `${SITE_URL}/file/pdf-watermark`,
  },
  openGraph: {
    title: 'PDF Watermark - Text & Image with Live Preview | Document Suite',
    description:
      'Add CONFIDENTIAL, DRAFT, or custom text/image watermarks to every PDF page. Live canvas preview, tiled pattern, angle control - nothing uploaded.',
    url: `${SITE_URL}/file/pdf-watermark`,
    type: 'website',
  },
};

const STEPS = [
  {
    step: '01',
    title: 'Upload a PDF',
    desc: 'The watermark applies to every page of the document.',
  },
  {
    step: '02',
    title: 'Set up your watermark',
    desc: 'Text or an image logo - adjust color, size, opacity, angle, and position.',
  },
  {
    step: '03',
    title: 'Preview and apply',
    desc: 'Check the live preview, then download the watermarked PDF.',
  },
];

const FAQS = [
  {
    q: 'Can I use my own logo instead of text?',
    a: "Yes - upload a PNG or JPG image and it's embedded directly into the PDF as the watermark, positioned and sized the same way a text watermark would be.",
  },
  {
    q: 'What does the "tiled" position do?',
    a: 'It repeats the watermark in a grid pattern across the entire page rather than placing it once - the same look used on many confidential or draft documents, which makes the watermark harder to crop out of a scanned or photographed copy.',
  },
  {
    q: 'Can the watermark be removed later by the person I send it to?',
    a: "Not easily, but it isn't cryptographically tamper-proof either - it's drawn as a normal graphical element on each page, similar to how most watermarking tools work. For a legal or high-security guarantee against removal, you'd want a different mechanism, such as a certified digital signature.",
  },
  {
    q: 'Does watermarking affect the original page content?',
    a: 'No - the watermark is drawn as an additional layer on top of each existing page using pdf-lib; the original text, images, and layout underneath are left completely unchanged.',
  },
  {
    q: 'Is my PDF or logo uploaded to a server?',
    a: 'No. The watermark is composed and applied locally in your browser, including the live preview - nothing is uploaded.',
  },
];

export default function PdfWatermarkPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Document Suite', path: '/file' },
            { name: 'PDF Watermark', path: '/file/pdf-watermark' },
          ]),
          softwareApplicationJsonLd({
            name: 'PDF Watermark',
            description:
              'Add text or image watermarks to every page of a PDF - set opacity, angle, position, and size. Live preview before applying. No server, no upload, 100% private. Powered by pdf-lib.',
            path: '/file/pdf-watermark',
            category: 'BusinessApplication',
          }),
          howToJsonLd({
            name: 'How to add a watermark to a PDF online',
            description:
              'Add a text or image watermark to every page of a PDF.',
            steps: STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(FAQS),
        ]}
      />

      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Document Suite', path: '/file' },
          { name: 'PDF Watermark', path: '/file/pdf-watermark' },
        ]}
        badges={[{ label: 'WATERMARK', color: 'blue' }]}
        title="Add a Watermark to a PDF"
        description="Stamp text or an image watermark onto every page - control opacity, angle, color, size, and position, from a single centered mark to a tiled repeating pattern."
        features={[
          { icon: Shield, label: '100% private' },
          { icon: Zap, label: 'Applies to every page' },
          { icon: Stamp, label: 'Text or image' },
          { icon: Eye, label: 'Live preview' },
        ]}
      />

      <div className="px-6 py-6">
        <PdfWatermarkTool />
      </div>

      <StepList title="How it works" accentColor="bg-blue-500" steps={STEPS} />

      <TechnicalNote
        title="How the watermark is applied"
        accentColor="bg-emerald-500"
        paragraphs={[
          "For a text watermark, pdf-lib measures the rendered width of your text at the chosen font size and color, then draws it onto every page at the position and rotation angle you've set - centered, in a corner, or repeated in a tiled grid. An image watermark works the same way, but embeds your uploaded PNG or JPG directly into the PDF first and draws that instead of rendered text. In both cases, the watermark is composited as a new layer on top of the existing page content, which is never altered.",
        ]}
      />

      <FaqAccordion
        title="Frequently asked questions"
        accentColor="bg-blue-500"
        items={FAQS}
      />
    </div>
  );
}
