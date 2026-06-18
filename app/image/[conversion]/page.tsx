import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowRight, Shield, Zap, Globe, Package } from 'lucide-react';
import Link from 'next/link';
import BaseImageConverter from '@/features/image/converter/components';
import ConverterStepper from '@/features/image/converter/shared/ConverterStepper';
import ConverterMarketingZone from '@/features/image/converter/shared/ConverterMarketingZone';
import {
  getFormatByExtension,
  getConversionRoute,
  ALL_CONVERSION_PAIRS,
} from '@/features/image/converter/config/formats';

interface PageProps {
  params: Promise<{ conversion: string }>;
}

export async function generateStaticParams() {
  return ALL_CONVERSION_PAIRS.map(({ source, target }) => ({
    conversion: `${source}-to-${target}`,
  }));
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
  return {
    title: route.title,
    description: route.description,
    keywords: route.keywords,
    alternates: {
      canonical: `https://swiftconverterhub.com/image/${conversion}`,
    },
    openGraph: {
      title: route.title,
      description: route.description,
      url: `https://swiftconverterhub.com/image/${conversion}`,
      type: 'website',
    },
  };
}

const TRUST_PILLS = [
  { icon: Shield, label: 'No uploads — 100% private' },
  { icon: Zap, label: 'Instant browser processing' },
  { icon: Globe, label: 'Works offline' },
  { icon: Package, label: 'Batch + ZIP download' },
];

export default async function ConversionPage({ params }: PageProps) {
  const { conversion } = await params;

  const dashToIndex = conversion.indexOf('-to-');
  if (dashToIndex === -1) notFound();

  const sourceExt = conversion.slice(0, dashToIndex);
  const targetExt = conversion.slice(dashToIndex + 4);

  const sourceFormat = getFormatByExtension(sourceExt);
  const targetFormat = getFormatByExtension(targetExt);
  if (!sourceFormat || !targetFormat) notFound();

  const route = getConversionRoute(sourceExt, targetExt);

  return (
    <div className="space-y-0">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-800">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 mb-5">
          <Link
            href="/"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Home
          </Link>
          <ArrowRight className="w-3 h-3" />
          <Link
            href="/image"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Image Studio
          </Link>
          <ArrowRight className="w-3 h-3" />
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            {sourceFormat.label} to {targetFormat.label}
          </span>
        </nav>

        {/* Title + format pills */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            {/* Format badge row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold">
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

          {/* Trust pills — desktop */}
          <div className="hidden sm:flex flex-col gap-1.5 shrink-0">
            {TRUST_PILLS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400"
              >
                <Icon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Trust pills — mobile horizontal scroll */}
        <div className="flex sm:hidden items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
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

      {/* ── Converter ─────────────────────────────────────────────────────── */}
      <div className="px-6 py-6">
        <BaseImageConverter
          sourceFormat={sourceFormat}
          targetFormat={targetFormat}
        />
      </div>

      {/* ── Steps ─────────────────────────────────────────────────────────── */}
      <div className="px-6 pb-6">
        <ConverterStepper
          headingTitle={`How to convert ${sourceFormat.label} to ${targetFormat.label}`}
          stepOne={{
            title: 'Upload your files',
            desc: `Drag & drop or browse up to 20 ${sourceFormat.label} files at once.`,
          }}
          stepTwo={{
            title: 'Browser converts locally',
            desc: `Files convert to ${targetFormat.label} in your browser - nothing is uploaded anywhere.`,
          }}
          stepThree={{
            title: 'Download results',
            desc: 'Save files individually or download everything as a ZIP bundle.',
          }}
        />
      </div>

      {/* ── Marketing zone ────────────────────────────────────────────────── */}
      <div className="px-6 pb-8 border-t border-slate-100 dark:border-slate-800 pt-6">
        <ConverterMarketingZone features={route.features} faqs={route.faqs} />
      </div>
    </div>
  );
}
