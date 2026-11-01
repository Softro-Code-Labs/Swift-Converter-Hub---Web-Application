import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { pageMetadata } from '@/lib/seo';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import {
  ToolPageHeader,
  RelatedConversions,
} from '@/features/shared/components/page-sections';
import BaseVideoConverter from '@/features/video/convert/components';
import {
  getFormatByExtension,
  getConversionRoute,
  isConversionAllowed,
  HIGH_TRAFFIC_PAIRS,
  MEDIUM_TRAFFIC_PAIRS,
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
  const priorityPairs = new Set([
    ...HIGH_TRAFFIC_PAIRS,
    ...MEDIUM_TRAFFIC_PAIRS,
  ]);
  return Array.from(priorityPairs).map((conversion) => ({ conversion }));
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
  const isCurated =
    HIGH_TRAFFIC_PAIRS.has(conversion) || MEDIUM_TRAFFIC_PAIRS.has(conversion);
  const S = source.toUpperCase();
  const T = target.toUpperCase();
  // Curated pairs keep their hand-written description; templated pairs get
  // one that says what the page does and why it is different.
  const description =
    route.description &&
    route.description.length >= 110 &&
    route.description.length <= 160
      ? route.description
      : `Convert ${S} videos to ${T} free in your browser. Batch convert several files and download as a ZIP. No upload, no watermark, no sign-up.`;
  return pageMetadata({
    path: `/video/convert/${conversion}`,
    title: `Convert ${S} to ${T} Online - Free, No Upload`,
    description,
    keywords: route.keywords.slice(0, 14),
    ogTitle: `${S} to ${T} Converter`,
    // Keep only the curated, hand-reviewed pairs indexable; the long tail
    // stays usable and crawlable but out of the search index.
    noindex: !isCurated,
  });
}

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

  const isCurated =
    HIGH_TRAFFIC_PAIRS.has(conversion) || MEDIUM_TRAFFIC_PAIRS.has(conversion);

  const route = getConversionRoute(sourceExt, targetExt);

  const howToSteps = [
    {
      title: 'Upload your files',
      desc: `Drag & drop or browse up to 5 ${sourceFormat.label} files at once.`,
    },
    {
      title: 'Browser converts locally',
      desc: `Your device's hardware video engine (or FFmpeg, as a fallback) converts to ${targetFormat.label} in your browser - nothing is uploaded anywhere.`,
    },
    {
      title: 'Download results',
      desc: 'Save files individually or download everything as a ZIP bundle.',
    },
  ];

  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Video Studio', path: '/video' },
    { name: 'Format Converter', path: '/video/convert' },
    {
      name: `${sourceFormat.label} to ${targetFormat.label}`,
      path: `/video/convert/${conversion}`,
    },
  ];

  // Long tail of format pairs gets a minimal view - breadcrumb + hero + the
  // working tool only. No templated copy/steps/features/FAQ. See the image
  // converter's equivalent page for the full rationale.
  if (!isCurated) {
    return (
      <div className="space-y-0">
        <JsonLd data={[breadcrumbJsonLd(breadcrumbItems)]} />
        <ToolPageHeader
          breadcrumbs={breadcrumbItems}
          title={`${sourceFormat.label} to ${targetFormat.label} Converter`}
          description={`Turn ${sourceFormat.label} files into ${targetFormat.label}. Add one file or a whole batch.`}
        >
          <p className="mt-4 flex items-center gap-2 text-sm font-semibold">
            <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {sourceFormat.label}
            </span>
            <ArrowRight className="h-4 w-4 text-slate-400" aria-hidden />
            <span className="rounded-md bg-blue-100 px-2 py-1 text-blue-800 dark:bg-blue-500/15 dark:text-blue-200">
              {targetFormat.label}
            </span>
          </p>
        </ToolPageHeader>

        <div className="@container px-5 py-6 sm:px-8 sm:py-8">
          <BaseVideoConverter
            sourceFormat={sourceFormat}
            targetFormat={targetFormat}
          />
        </div>

        <div className="px-5 pb-8 sm:px-8">
          <Link
            href="/video/convert"
            className="text-sm font-semibold text-blue-700 underline-offset-4 hover:underline dark:text-blue-300"
          >
            See all video conversions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <JsonLd
        data={[
          breadcrumbJsonLd(breadcrumbItems),
          howToJsonLd({
            name: `How to convert ${sourceFormat.label} to ${targetFormat.label}`,
            description: route.description,
            steps: howToSteps,
          }),
          faqPageJsonLd(route.faqs),
        ]}
      />
      {/* Hero */}
      <ToolPageHeader
        breadcrumbs={breadcrumbItems}
        title={`Convert ${sourceFormat.label} to ${targetFormat.label} Online`}
        description={route.description}
      >
        <p className="mt-4 flex items-center gap-2 text-sm font-semibold">
          <span className="rounded-md bg-slate-100 px-2 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {sourceFormat.label}
          </span>
          <ArrowRight className="h-4 w-4 text-slate-400" aria-hidden />
          <span className="rounded-md bg-blue-100 px-2 py-1 text-blue-800 dark:bg-blue-500/15 dark:text-blue-200">
            {targetFormat.label}
          </span>
        </p>
      </ToolPageHeader>

      {/* Converter */}
      <div className="@container px-5 py-6 sm:px-8 sm:py-8">
        <BaseVideoConverter
          sourceFormat={sourceFormat}
          targetFormat={targetFormat}
        />
      </div>

      {/* Steps */}
      <div className="border-t border-slate-200 px-5 py-8 sm:px-8 dark:border-slate-800">
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
      <div className="border-t border-slate-200 px-5 py-8 sm:px-8 dark:border-slate-800">
        <FeatureGrid
          title="Why use this converter"
          accentColor="bg-emerald-500"
          items={route.features}
        />
      </div>

      <RelatedConversions
        base="/video/convert"
        source={sourceExt}
        target={targetExt}
        curated={new Set([...HIGH_TRAFFIC_PAIRS, ...MEDIUM_TRAFFIC_PAIRS])}
        label={(ext) => getFormatByExtension(ext)?.label ?? ext.toUpperCase()}
      />

      <FaqAccordion
        title="Frequently asked questions"
        accentColor="bg-purple-500"
        items={route.faqs}
      />
    </div>
  );
}
