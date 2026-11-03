import { Metadata } from 'next';
import { ClipboardPaste, Languages, ScanText, ShieldCheck } from 'lucide-react';
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
  InfoCardGrid,
  TechnicalNote,
  FaqAccordion,
} from '@/features/shared/components/page-sections';
import OcrTool from '@/features/image/ocr/components';
import { LANGUAGES } from '@/features/image/ocr/lib/languages';
import { pageMetadata } from '@/lib/seo';

const PATH = '/image/to-text';

const LANGUAGE_LIST = LANGUAGES.map((l) => l.label).join(', ');

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: 'Image to Text (OCR) - Free, No Upload',
  ogTitle: 'Image to Text Converter (OCR)',
  description:
    'Extract text from images, screenshots and scanned documents with OCR that runs on your device. 15 languages including Sinhala and Tamil. No upload, no sign-up.',
  keywords: [
    'image to text',
    'ocr online',
    'extract text from image',
    'picture to text',
    'screenshot to text',
    'jpg to text',
    'photo to text converter',
    'copy text from image',
    'ocr without upload',
    'sinhala ocr',
    'tamil ocr',
    'scan document to text',
  ],
});

const STEPS = [
  {
    step: '01',
    title: 'Add your images',
    desc: 'Drop up to 20 photos, scans or screenshots - or paste one with Ctrl+V. The first time, the engine downloads once (about 7 MB).',
  },
  {
    step: '02',
    title: 'Choose the language',
    desc: 'Pick the language of the text. Lines the engine is unsure of are highlighted in amber so you know what to check.',
  },
  {
    step: '03',
    title: 'Copy or download',
    desc: 'Fix anything that needs it right in the text box, then copy it or save it as a .txt file - one per image or all together.',
  },
];

const CARDS = [
  {
    title: 'Screenshots',
    meta: 'Error messages, chats, slides',
    desc: 'Paste straight from the clipboard. Small text is enlarged automatically before reading.',
  },
  {
    title: 'Scanned documents',
    meta: 'Letters, forms, book pages',
    desc: '"Paragraphs" layout joins wrapped lines and mends words split by a hyphen.',
  },
  {
    title: 'Receipts and lists',
    meta: 'Expenses, menus, labels',
    desc: '"Keep lines" layout keeps every line exactly where it was in the image.',
  },
  {
    title: 'Phone photos',
    meta: 'Whiteboards, notices, signs',
    desc: 'JPG and iPhone HEIC photos are turned upright before reading.',
  },
];

const FAQS = [
  {
    q: 'Are my images uploaded to a server?',
    a: 'No. The text-recognition engine runs inside your browser tab, so your images never leave your device. The only downloads are the engine and the language data, both from this website, fetched once and then kept in your browser.',
  },
  {
    q: 'Which languages can it read?',
    a: `${LANGUAGE_LIST}. Languages that don’t use the Latin alphabet are read together with English, because mixed text - like a Sinhala form with English headings - is so common.`,
  },
  {
    q: 'How accurate is it?',
    a: 'On clear printed text, such as screenshots and good scans, it is usually close to perfect. Accuracy drops with blur, glare, heavy shadows, stylised fonts and text at an angle. Lines the engine is unsure of are highlighted in amber, and you can correct the text before copying it.',
  },
  {
    q: 'Can it read handwriting?',
    a: 'Not reliably. The engine is trained on printed text. Very neat block capitals sometimes work, but joined-up handwriting usually doesn’t.',
  },
  {
    q: 'Can it read a scanned PDF?',
    a: 'Not directly yet. Take a screenshot of the page, or export the page as an image, and add that here.',
  },
  {
    q: 'Which engine is used?',
    a: 'Tesseract, the open-source OCR engine originally developed at HP and later by Google, released under the Apache 2.0 licence. It runs as WebAssembly through tesseract.js, using its LSTM neural-network recogniser.',
  },
];

export default function ImageToTextPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Image Studio', path: '/image' },
            { name: 'Image to Text', path: PATH },
          ]),
          softwareApplicationJsonLd({
            name: 'Image to Text (OCR)',
            description:
              'Extract text from images and screenshots with OCR that runs on your device. 15 languages. No upload.',
            path: PATH,
            category: 'UtilitiesApplication',
          }),
          howToJsonLd({
            name: 'How to extract text from an image',
            description:
              'Read the text in a photo, scan or screenshot in your browser and copy it or save it as a text file.',
            steps: STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(FAQS),
        ]}
      />

      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Image Studio', path: '/image' },
          { name: 'Image to Text', path: PATH },
        ]}
        badges={[{ label: 'OCR', color: 'purple' }]}
        title="Image to Text (OCR)"
        description="Pull the text out of photos, scans and screenshots, then copy it or save it. The text is read on your device, so your images are never uploaded."
        features={[
          { icon: ScanText, label: 'Printed text recognition' },
          { icon: Languages, label: '15 languages' },
          { icon: ClipboardPaste, label: 'Paste screenshots' },
          { icon: ShieldCheck, label: 'No upload' },
        ]}
      />

      <div className="@container px-5 py-6 sm:px-8 sm:py-8">
        <OcrTool />
      </div>

      <StepList title="How it works" accentColor="bg-blue-500" steps={STEPS} />

      <InfoCardGrid
        title="Good for"
        accentColor="bg-purple-500"
        columns="grid-cols-1 sm:grid-cols-2"
        cards={CARDS}
      />

      <TechnicalNote
        title="How it works without uploading"
        accentColor="bg-emerald-500"
        paragraphs={[
          'Tesseract, compiled to WebAssembly, runs in a background thread of this tab. Each image is first turned upright and resized so letters are a size the engine reads well - small screenshots are enlarged, very large photos reduced. Tesseract then finds the blocks, lines and words on the page and reads each line with a neural network trained for the language you chose.',
          'Along with the text, it reports how sure it is of every line. That is what the blue and amber boxes on your image show. Your image is never sent anywhere.',
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
