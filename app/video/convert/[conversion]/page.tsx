import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight, Shield, Zap, Globe, Package } from 'lucide-react';
import Link from 'next/link';
import BaseVideoConverter from '@/features/video/convert/components';
import {
  getFormatByExtension,
  getConversionRoute,
  isConversionAllowed,
  HIGH_TRAFFIC_PAIRS,
} from '@/features/video/convert/config/formats';
import {
  StepList,
  FeatureGrid,
  FaqAccordion,
} from '@/features/shared/components/page-sections';
import {
  JsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
  howToJsonLd,
} from '@/components/seo/JsonLd';

interface PageProps {
  params: Promise<{ conversion: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return Array.from(HIGH_TRAFFIC_PAIRS).map((conversion) => ({ conversion }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { conversion } = await params;
  const dashToIndex = conversion.indexOf('-to-');
  if (dashToIndex === -1) return {};
  const source = conversion.slice(0, dashToIndex);
  const target = conversion.slice(dashToIndex + 4);
  if (!source || !target) return {};
  const route = getConversionRoute(source, target);
  const isCurated = HIGH_TRAFFIC_PAIRS.has(conversion);
  return {
    title: route.title,
    description: route.description,
    keywords: route.keywords,
    alternates: { canonical: `${SITE_URL}/video/convert/${conversion}` },
    openGraph: {
      title: route.title,
      description: route.description,
      url: `${SITE_URL}/video/convert/${conversion}`,
      type: 'website',
    },
    // Keep only the curated, hand-reviewed pairs indexable; the long tail of
    // auto-generated pairs stays usable but out of the search/ad index.
    robots: isCurated
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };
}

const TRUST_PILLS = [
  { icon: Shield, label: 'No uploads - 100% private' },
  { icon: Zap, label: 'Instant browser processing' },
  { icon: Globe, label: 'Works offline' },
  { icon: Package, label: 'Batch + ZIP download' },
];

export default async function VideoConversionPage({ params }: PageProps) {
  const { conversion } = await params;

  const dashToIndex = conversion.indexOf('-to-');
  if (dashToIndex === -1) notFound();

  const sourceExt = conversion.slice(0, dashToIndex);
  const targetExt = conversion.slice(dashToIndex + 4);

  const sourceFormat = getFormatByExtension(sourceExt);
  const targetFormat = getFormatByExtension(targetExt);
  if (!sourceFormat || !targetFormat) notFound();
  if (!isConversionAllowed(sourceExt, targetExt)) notFound();

  const route = getConversionRoute(sourceExt, targetExt);

  const howToSteps = [
    {
      title: 'Upload your files',
      desc: `Drag & drop or browse up to 5 ${sourceFormat.label} files at once.`,
    },
    {
      title: 'Browser converts locally',
      desc: `FFmpeg (compiled to WebAssembly) converts to ${targetFormat.label} in your browser - nothing is uploaded anywhere.`,
    },
    {
      title: 'Download results',
      desc: 'Save files individually or download everything as a ZIP bundle.',
    },
  ];

  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Video Studio', path: '/video' },
            { name: 'Format Converter', path: '/video/convert' },
            {
              name: `${sourceFormat.label} to ${targetFormat.label}`,
              path: `/video/convert/${conversion}`,
            },
          ]),
          howToJsonLd({
            name: `How to convert ${sourceFormat.label} to ${targetFormat.label}`,
            description: route.description,
            steps: howToSteps,
          }),
          faqPageJsonLd(route.faqs),
        ]}
      />
      {/* Hero */}
      <div className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-800">
        <nav className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 mb-5">
          <Link href="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Home
          </Link>
          <ArrowRight className="w-3 h-3" />
          <Link href="/video" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Video Studio
          </Link>
          <ArrowRight className="w-3 h-3" />
          <Link href="/video/convert" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
            Format Converter
          </Link>
          <ArrowRight className="w-3 h-3" />
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            {sourceFormat.label} to {targetFormat.label}
          </span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold">
                {sourceFormat.label}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                {targetFormat.label}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:inline">
                · Free online converter
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
              Convert {sourceFormat.label} to {targetFormat.label} Online
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {route.description}
            </p>
          </div>

          <div className="hidden sm:flex flex-col gap-1.5 shrink-0">
            {TRUST_PILLS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <Icon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="flex sm:hidden items-center gap-2 mt-4 overflow-x-auto pb-1">
          {TRUST_PILLS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 shrink-0 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-medium text-slate-600 dark:text-slate-400"
            >
              <Icon className="w-3 h-3 text-emerald-500" />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Converter */}
      <div className="px-6 py-6">
        <BaseVideoConverter sourceFormat={sourceFormat} targetFormat={targetFormat} />
      </div>

      {/* Steps */}
      <div className="px-6 pb-6">
        <StepList
          variant="boxed"
          accentColor="bg-purple-500"
          title={`How to convert ${sourceFormat.label} to ${targetFormat.label}`}
          steps={howToSteps.map((step, i) => ({
            step: String(i + 1),
            title: step.title,
            desc: step.desc,
          }))}
        />
      </div>

      {/* Features */}
      <div className="px-6 pb-2 border-t border-slate-100 dark:border-slate-800 pt-6">
        <FeatureGrid
          title="Why use this converter"
          accentColor="bg-emerald-500"
          items={route.features}
        />
      </div>

      <FaqAccordion
        title="Frequently asked questions"
        accentColor="bg-purple-500"
        items={route.faqs}
      />
    </div>
  );
}
