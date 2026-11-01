import { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/site/PageHeader';
import { StudioDirectory } from '@/components/site/StudioDirectory';
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Lock,
  Cpu,
  ServerOff,
} from 'lucide-react';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  path: '/about',
  title: 'About - Private, In-Browser File Conversion',
  description:
    'Swift Converter Hub converts files in your browser with WebAssembly, so nothing is uploaded. Learn how it works and why your files stay on your device.',
  keywords: [
    'about swift converter hub',
    'how swift converter hub works',
    'privacy first file converter',
    'browser based utility tools',
    'webassembly local file processing',
    'no upload file converter',
    'secure client side conversion',
    'webassembly image converter explained',
    'zero data collection file tool',
    'client side processing explained',
    'how browser file conversion works',
    'free privacy focused converter',
  ],
});

const PILLARS = [
  {
    icon: Shield,
    label: '100% Private',
    desc: 'Your files are processed entirely inside your browser. Nothing is uploaded to any server - ever.',
    color: 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
  },
  {
    icon: Zap,
    label: 'Instant Processing',
    desc: 'WebAssembly runs at near-native speed. No upload wait times, no server queues.',
    color:
      'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
  },
  {
    icon: Globe,
    label: 'Always Free',
    desc: 'No paywalls, no account required, no download caps. Available to anyone, anywhere.',
    color:
      'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
  },
];

const HOW_IT_WORKS = [
  {
    icon: Cpu,
    step: '01',
    label: 'WebAssembly loads in your browser',
    desc: 'When you open a tool, a compiled WebAssembly binary is loaded into your browser tab - the same binary that powers professional desktop-class design and editing software.',
  },
  {
    icon: Lock,
    step: '02',
    label: 'Your file never leaves your device',
    desc: 'When you drop a file, it goes directly into browser memory. No network request is made. No data is transmitted.',
  },
  {
    icon: ServerOff,
    step: '03',
    label: 'Processing happens locally',
    desc: 'The WASM engine converts your file using your own CPU. Pull the ethernet cable mid-conversion - it will still finish.',
  },
];

export default function AboutPage() {
  return (
    <main className="flex-1">
      <PageHeader
        title="Your files belong on your computer"
        lead={
          <>
            Swift Converter Hub is built on one idea: converting a file should
            not mean handing it to a stranger&apos;s server. Every tool here
            runs in your browser, so your files stay where they are.
          </>
        }
        width="max-w-5xl"
      >
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-[15px] font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
          >
            Convert a file
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            No account needed
          </span>
        </div>
      </PageHeader>

      {/* -- Principles ------------------------------------------------------ */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          What we hold to
        </h2>
        <dl className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-3">
          {PILLARS.map(({ icon: Icon, label, desc }) => (
            <div key={label}>
              <dt className="flex items-center gap-2.5 text-lg font-semibold text-slate-900 dark:text-white">
                <Icon
                  className="h-5 w-5 text-blue-600 dark:text-blue-400"
                  aria-hidden
                />
                {label
                  .replace('100% Private', 'Private by design')
                  .replace('Instant Processing', 'Fast')
                  .replace('Always Free', 'Free for everyone')}
              </dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
                {desc}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* -- How it works ---------------------------------------------------- */}
      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              How client-side processing works
            </h2>
            <ol className="mt-6 space-y-6">
              {HOW_IT_WORKS.map(({ step, label, desc }, i) => (
                <li key={step} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 font-display text-sm font-bold text-white dark:bg-white dark:text-slate-900">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                      {label}
                    </h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
                      {desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="self-start rounded-2xl bg-slate-900 p-6 sm:p-8 dark:bg-slate-800">
            <h2 className="text-xl font-bold text-white">
              What is WebAssembly?
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
              WebAssembly (WASM) lets compiled programs run in a browser at
              near-native speed. It&apos;s the same technology that lets Figma,
              Google Earth and AutoCAD run in a tab. We use it to run
              professional engines such as ImageMagick and FFmpeg on your
              device.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-slate-400">
              Because all the work happens locally, no server is involved in
              converting. We can&apos;t see your files - not because we promise
              not to look, but because they never reach us.
            </p>
            <p className="mt-5 border-t border-slate-700 pt-4 text-sm text-slate-400">
              Your file&apos;s journey: your device, browser memory, the engine,
              your downloads folder. No network hop.
            </p>
          </div>
        </div>
      </section>

      {/* -- Studios --------------------------------------------------------- */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Try it with your own file
        </h2>
        <p className="mt-2 text-[15px] text-slate-600 dark:text-slate-400">
          Pick a studio. Every tool is ready in seconds, with nothing to
          install.
        </p>
        <div className="mt-6">
          <StudioDirectory />
        </div>
      </section>
    </main>
  );
}
