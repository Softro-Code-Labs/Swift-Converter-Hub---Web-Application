import { Metadata } from 'next';
import Link from 'next/link';
import { SlidersHorizontal, Palette, Zap, Shield } from 'lucide-react';
import AdjustTool from '@/features/image/adjust/components';
import {
  StepList,
  InfoCardGrid,
  TechnicalNote,
  FaqAccordion,
} from '@/features/image/shared/components/page-sections';

export const metadata: Metadata = {
  title: 'Adjust & Filter Images',
  description:
    'Adjust brightness, contrast, saturation and apply photo filters like Vivid, Vintage and Noir. Works 100% in your browser - no uploads, no account required.',
  keywords: [
    // Original core editing keywords
    'adjust image online',
    'brightness contrast tool',
    'image saturation editor',
    'online image color correction',
    'image hue adjustment tool',
    'fix dark photos online',

    // Filters & aesthetics
    'photo filter editor online',
    'free photo filter tool',
    'vintage filter photo online',
    'apply noir filter to image',
    'grayscale converter online',
    'sepia filter photo online',
    'vivid color photo editor',

    // Workflow & utilities
    'browser photo editor',
    'quick photo enhancer online',
    'edit photos without app download',
    'lightweight image editor browser',

    // Privacy & safety
    'no upload photo editor',
    'private image filter tool',
    'secure local photo adjustment',

    // Advanced photo adjustments
    'image exposure editor online',
    'photo highlights and shadows tool',
    'adjust image temperature browser',
    'image sharpness tool online',
    'photo tint modifier free',
    'gamma correction tool online',
    'invert colors image converter',

    // Creative effects & styling
    'black and white photo converter',
    'retro photography effect online',
    'cool aesthetic photo filters',
    'cinematic photo look editor',
    'monochrome filter online free',
    'dramatic contrast photo tool',
    'warm tone filter for images',

    // Social media & e-commerce use cases
    'instagram filter editor browser',
    'e-commerce product photo cleaner',
    'optimize product images online',
    'bulk look image editor',
    'social media graphics enhancer',
    'avatar lighting enhancer online',
    'profile picture editor contrast',

    // Frontend developer assets
    'css filter tester online',
    'browser canvas image adjuster',
    'client side image manipulator',
    'web based asset photo optimizer',

    // Privacy & client-side performance
    'offline web photo editor',
    'wasm photo processor browser',
    'zero tracking photo editor',
    'local storage image enhancer',
    'instant client side image tuning',
  ],
  alternates: { canonical: 'https://swiftconverterhub.com/image/adjust' },
  openGraph: {
    title: 'Adjust & Filter Images Online - Free Photo Editor | Image Studio',
    description:
      'Brightness, contrast, saturation and filters - all processed locally in your browser.',
    url: 'https://swiftconverterhub.com/image/adjust',
    type: 'website',
  },
};

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

export default function AdjustPage() {
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
            Adjust & Filter
          </span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-black">
              ADJUST
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Adjust & Filter Images
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Fine-tune brightness, contrast and saturation, or apply ready-made
              filters like Vivid, Vintage and Noir - all with a live preview
              before you commit.
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
        <AdjustTool />
      </div>

      <StepList
        title="How it works"
        accentColor="bg-blue-500"
        steps={[
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
        ]}
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
