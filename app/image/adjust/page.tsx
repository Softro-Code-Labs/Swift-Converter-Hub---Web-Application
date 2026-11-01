import { Metadata } from 'next';
import { SlidersHorizontal, Palette, Zap, Shield } from 'lucide-react';
import AdjustTool from '@/features/image/adjust/components';
import {
  StepList,
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
  howToJsonLd,
} from '@/components/seo/JsonLd';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/image/adjust',
  title: 'Adjust Brightness, Contrast & Filters Online',
  description:
    'Edit photo brightness, contrast, saturation and sharpness, or apply B&W, vintage and other filters with a live preview. Free, in your browser, no upload.',
  keywords: [
    'adjust image online',
    'brightness contrast tool',
    'image saturation editor',
    'online image color correction',
    'image hue adjustment tool',
    'fix dark photos online',
    'photo filter editor online',
    'free photo filter tool',
    'photo brightness fixer online',
    'vintage photo filter online',
    'noir filter online free',
    'image color grading tool',
  ],
});

const FEATURES = [
  {
    icon: SlidersHorizontal,
    label: 'Live preview',
    desc: 'See changes instantly',
  },
  {
    icon: Palette,
    label: '9 filter presets',
    desc: 'Vivid, vintage, noir & more',
  },
  { icon: Zap, label: 'Manual control', desc: 'Fine-tune every parameter' },
  {
    icon: Shield,
    label: '100% private',
    desc: 'Files never leave your browser',
  },
];

const FILTER_GUIDE = [
  {
    title: 'Vivid',
    desc: 'Boosts color punch for landscapes & food photography',
  },
  { title: 'Warm', desc: 'Adds golden-hour tones for portraits' },
  { title: 'Cool', desc: 'Blue-shifted tones for tech & product shots' },
  { title: 'B&W', desc: 'Clean monochrome conversion' },
  { title: 'Vintage', desc: 'Faded, sepia-toned film look' },
  { title: 'Dramatic', desc: 'High contrast, deep shadows' },
  { title: 'Fade', desc: 'Soft, washed-out matte finish' },
  { title: 'Noir', desc: 'High-contrast black and white' },
];

const ADJUST_FAQS = [
  {
    q: 'Can I combine a filter preset with manual adjustments?',
    a: 'Yes. Pick a preset first, then fine-tune any slider - your manual change overrides just that one value while keeping the rest of the preset intact.',
  },
  {
    q: 'Why does the preview look slightly different from my downloaded image?',
    a: 'The live preview uses CSS filters for instant feedback while editing. The actual download is processed through a professional-grade image engine at full pixel precision, which can look subtly sharper or more accurate than the CSS approximation.',
  },
  {
    q: "Is there an undo button if I don't like my changes?",
    a: 'Click "Reset" next to the manual adjustments to return all sliders to zero, or select a different filter preset to start fresh. Since processing only happens when you click Apply, you can experiment freely beforehand.',
  },
  {
    q: 'What does the Sharpen slider actually do?',
    a: 'It applies an unsharp mask, which increases local contrast at edges to make details appear crisper. High values can introduce visible haloing artifacts around edges, so start subtle.',
  },
  {
    q: 'Can I apply adjustments to multiple images at once?',
    a: 'Not currently - this tool processes one image at a time so you can fine-tune each photo individually. For batch operations without per-image adjustment, use the Compress tool instead.',
  },
];

const ADJUST_STEPS = [
  {
    step: '01',
    title: 'Upload an image',
    desc: 'Drop any photo to start editing.',
  },
  {
    step: '02',
    title: 'Adjust or pick a filter',
    desc: 'Use sliders or one-tap presets - preview updates live.',
  },
  {
    step: '03',
    title: 'Apply & download',
    desc: 'Process the final image and save it instantly.',
  },
];

export default function AdjustPage() {
  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Image Studio', path: '/image' },
            { name: 'Adjust & Filter', path: '/image/adjust' },
          ]),
          softwareApplicationJsonLd({
            name: 'Image Adjust & Filter Tool',
            description:
              'Adjust brightness, contrast, saturation and apply photo filters, entirely in your browser.',
            path: '/image/adjust',
            category: 'MultimediaApplication',
          }),
          howToJsonLd({
            name: 'How to adjust and filter an image online',
            description:
              'Fine-tune brightness, contrast and saturation, or apply a filter preset - all with a live preview.',
            steps: ADJUST_STEPS.map((s) => ({ title: s.title, desc: s.desc })),
          }),
          faqPageJsonLd(ADJUST_FAQS),
        ]}
      />
      <ToolPageHeader
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Image Studio', path: '/image' },
          { name: 'Adjust & Filter', path: '/image/adjust' },
        ]}
        title={'Adjust & Filter Images'}
        description={
          'Fine-tune brightness, contrast and saturation, or apply ready-made filters like Vivid, Vintage and Noir - all with a live preview before you commit.'
        }
        features={FEATURES}
      />

      <div className="@container px-5 py-6 sm:px-8 sm:py-8">
        <AdjustTool />
      </div>

      <StepList
        title="How it works"
        accentColor="bg-blue-500"
        steps={ADJUST_STEPS}
      />

      <InfoCardGrid
        title="Filter preset guide"
        accentColor="bg-purple-500"
        columns="grid-cols-2 sm:grid-cols-3"
        cards={FILTER_GUIDE}
      />

      <TechnicalNote
        title="Preview vs. final output"
        accentColor="bg-emerald-500"
        paragraphs={[
          'While you\'re dragging sliders, the preview you see is a CSS filter approximation - this keeps the interface instant and responsive with zero processing lag. When you click "Apply Adjustments," the real pixel-level transformation runs through a professional-grade image engine, which produces a more accurate and higher-fidelity result than a CSS filter can achieve, especially for sharpening and color modulation.',
        ]}
      />

      <FaqAccordion
        title="Frequently asked questions"
        accentColor="bg-blue-500"
        items={ADJUST_FAQS}
      />
    </div>
  );
}
