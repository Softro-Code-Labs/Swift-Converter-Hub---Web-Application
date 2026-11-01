import {
  ArrowRight,
  MonitorSmartphone,
  WifiOff,
  Download,
  Gauge,
} from 'lucide-react';
import Link from 'next/link';
import {
  POPULAR_TOOLS,
  STUDIOS,
  TOOL_COUNT,
  getStudioTools,
  getStudio,
} from '@/config/tools';
import { STUDIO_ACCENT } from '@/config/studio-theme';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { SITE_URL } from '@/config/site';
import HeroDropZone from '@/components/home/HeroDropZone';
import HomeTour from '@/components/onboarding/HomeTour';
import {
  JsonLd,
  breadcrumbJsonLd,
  softwareApplicationJsonLd,
} from '@/components/seo/JsonLd';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/',
  title: 'Free Online File Converter - No Upload | Swift Converter Hub',
  description: `Convert, compress and edit images, PDFs, audio, video and data files free in your browser. ${TOOL_COUNT} tools, no upload, no sign-up - files stay on your device.`,
  absoluteTitle: true,
  ogTitle: 'Convert files without uploading them',
  ogImage: '/og-image.png',
  keywords: [
    'swift converter hub',
    'swift converter hub online',
    'swift converter hub free',
    'free online file converter',
    'file converter no upload',
    'browser based file converter',
    'private file converter online',
    'convert files without uploading',
    'client side file conversion tool',
    'webassembly file converter',
    'offline capable file converter',
    'no signup file converter',
    'unlimited free file converter',
    'secure file conversion online',
  ],
});

const STEPS = [
  {
    icon: MonitorSmartphone,
    title: 'The tool loads into your browser',
    desc: 'Opening a tool downloads its engine (ImageMagick, FFmpeg or a PDF library) into this tab, once.',
  },
  {
    icon: Gauge,
    title: 'Your device does the work',
    desc: 'Files are read from your disk straight into the tab’s memory and processed there, at your computer’s speed.',
  },
  {
    icon: Download,
    title: 'The result saves back to your device',
    desc: 'Downloads come from the tab itself. There is no server copy to delete, because there never was one.',
  },
];

export default function HomePage() {
  return (
    <main className="flex-1">
      <HomeTour />
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: 'Home', path: '/' }]),
          softwareApplicationJsonLd({
            name: 'Swift Converter Hub',
            description:
              'Convert images, audio, video, PDFs, and data files entirely in your browser - no uploads, no accounts, no limits.',
            path: '/',
            category: 'MultimediaApplication',
          }),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Swift Converter Hub Studios',
            itemListElement: STUDIOS.map((studio, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: studio.name,
              url: `${SITE_URL}${studio.href}`,
            })),
          },
        ]}
      />

      {/* -- Hero: the drop zone is the product ------------------------------ */}
      <section className="border-b border-slate-200 bg-[radial-gradient(ellipse_at_top_right,var(--color-blue-50),transparent_60%)] dark:border-slate-800 dark:bg-[radial-gradient(ellipse_at_top_right,color-mix(in_oklch,var(--color-blue-950)_55%,transparent),transparent_60%)]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14 lg:px-8 lg:py-20">
          <div className="max-w-xl">
            <h1 className="[text-wrap:pretty] text-[2.6rem] font-bold leading-[1.04] text-slate-900 sm:text-[3.25rem] xl:text-[3.75rem] dark:text-white">
              Convert files without uploading them.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              {TOOL_COUNT} free tools for images, audio, video, PDFs, data and
              text. Everything runs inside this browser tab, so your files never
              leave your device.
            </p>
            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                  aria-hidden
                />
                No sign-up
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                  aria-hidden
                />
                No file-size caps
              </li>
              <li className="flex items-center gap-2">
                <WifiOff
                  className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
                  aria-hidden
                />
                Keeps working offline
              </li>
            </ul>
          </div>
          <HeroDropZone />
        </div>
      </section>

      {/* -- Popular ---------------------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Most used
        </h2>
        <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {POPULAR_TOOLS.slice(0, 8).map((tool) => {
            const accent = STUDIO_ACCENT[tool.studio];
            const Icon = tool.icon;
            return (
              <li key={tool.id}>
                <Link
                  href={tool.href}
                  className={cn(
                    'group flex h-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 transition-colors dark:border-slate-800 dark:bg-slate-900',
                    accent.hoverBorder,
                  )}
                >
                  <span
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                      accent.tile,
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] font-semibold text-slate-900 dark:text-white">
                      {tool.title}
                    </span>
                    <span className="block truncate text-[13px] text-slate-500 dark:text-slate-400">
                      {getStudio(tool.studio).name}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* -- Full directory --------------------------------------------------- */}
      <section
        id="studios"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Every tool, by file type
            </h2>
            <p className="mt-1.5 text-[15px] text-slate-600 dark:text-slate-400">
              Six studios, {TOOL_COUNT} tools. Pick a studio to see what each
              tool does.
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3 dark:border-slate-800 dark:bg-slate-800">
          {STUDIOS.map((studio) => {
            const accent = STUDIO_ACCENT[studio.id];
            const Icon = studio.icon;
            const tools = getStudioTools(studio.id);
            return (
              <div
                key={studio.id}
                className="flex flex-col bg-white p-6 dark:bg-slate-900"
              >
                <Link
                  href={studio.href}
                  className="group flex items-start gap-3.5"
                >
                  <span
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                      accent.tile,
                    )}
                  >
                    <Icon className="h-[22px] w-[22px]" aria-hidden />
                  </span>
                  <span>
                    <span className="flex items-center gap-1.5 font-display text-lg font-bold text-slate-900 dark:text-white">
                      {studio.name}
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </span>
                    <span className="block text-sm text-slate-500 dark:text-slate-400">
                      {studio.handles}
                    </span>
                  </span>
                </Link>
                <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-1">
                  {tools.map((tool) => (
                    <li key={tool.id} className="min-w-0">
                      <Link
                        href={tool.href}
                        className="-mx-1.5 block truncate rounded-md px-1.5 py-1 text-[14.5px] text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                      >
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* -- How it stays private --------------------------------------------- */}
      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:gap-16 lg:px-8">
          <div>
            <h2 className="text-3xl font-bold leading-tight text-slate-900 dark:text-white">
              How your files stay on your device
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
              Most online converters upload your file, process it on their
              server and send it back. Here, the converter comes to your file
              instead.
            </p>
            <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-4 text-sm leading-relaxed text-slate-600 dark:border-slate-700 dark:text-slate-400">
              <p className="font-semibold text-slate-900 dark:text-white">
                Check it yourself
              </p>
              Open your browser’s developer tools, switch to the Network tab and
              convert a file. You won’t see your file go anywhere. You can even
              turn off Wi-Fi once a tool has loaded.
            </div>
          </div>
          <ol className="space-y-8 lg:pt-1">
            {STEPS.map(({ icon: Icon, title, desc }, i) => (
              <li key={title} className="flex gap-4">
                <span className="relative flex flex-col items-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 font-display text-base font-bold text-white dark:bg-white dark:text-slate-900">
                    {i + 1}
                  </span>
                  {i < STEPS.length - 1 && (
                    <span
                      className="absolute top-12 h-[calc(100%+0.5rem)] w-px bg-slate-200 dark:bg-slate-700"
                      aria-hidden
                    />
                  )}
                </span>
                <div className="pt-1.5">
                  <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                    <Icon
                      className="h-[18px] w-[18px] text-slate-400"
                      aria-hidden
                    />
                    {title}
                  </h3>
                  <p className="mt-1 max-w-xl text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
                    {desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* -- Closing ---------------------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-slate-900 p-8 sm:flex-row sm:items-center sm:p-10 dark:bg-slate-800/70">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Missing a tool you need?
            </h2>
            <p className="mt-1.5 text-[15px] text-slate-300">
              Tell us which file you’re stuck with. New tools are added
              regularly.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-white px-5 text-[15px] font-semibold text-slate-900 hover:bg-slate-100"
          >
            Suggest a tool
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </main>
  );
}
