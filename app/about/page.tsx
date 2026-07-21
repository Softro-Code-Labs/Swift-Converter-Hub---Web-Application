import { SITE_URL } from '@/config/site';
import { Metadata } from 'next';
import Link from 'next/link';
import { LaboratoryModules } from '@/components/LaboratoryModules';
import {
  ArrowLeft,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Lock,
  Cpu,
  ServerOff,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn how Swift Converter Hub uses WebAssembly to convert files entirely in your browser with zero uploads and 100% data privacy.',
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
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: 'About Swift Converter Hub - Privacy-First Local File Converters',
    description:
      'How we built a browser-based image toolkit that never uploads your files.',
    url: `${SITE_URL}/about`,
    type: 'website',
  },
};

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

const TRUST_BADGES = [
  'GDPR compliant',
  'No PHI ever transmitted',
  'Zero server logging',
  'Works offline',
  'No account required',
  'Open to all',
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 selection:bg-blue-500 selection:text-white">
      {/* -- Hero ------------------------------------------------------------ */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          {/* Breadcrumb */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to home
          </Link>

          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-xs font-bold text-blue-700 dark:text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Privacy-first file conversion
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Your files belong on{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                your computer
              </span>
            </h1>

            <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed">
              Swift Converter Hub was built on one principle: file conversion
              tools should not require you to upload your personal files to a
              stranger&apos;s server. Everything runs in your browser. Your data
              never moves.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/image"
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all active:scale-[0.98] group"
              >
                Try it now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                No account needed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -- Three pillars --------------------------------------------------- */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PILLARS.map(({ icon: Icon, label, desc, color }) => (
            <div
              key={label}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {label}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* -- How it works ---------------------------------------------------- */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-blue-500 inline-block" />
              How client-side processing works
            </h2>
          </div>

          {/* Steps */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {HOW_IT_WORKS.map(({ icon: Icon, step, label, desc }) => (
              <div key={step} className="flex items-start gap-5 px-6 py-5">
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <span className="text-[10px] font-black text-slate-300 dark:text-slate-600">
                    {step}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-1 pt-1">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {label}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
            {TRUST_BADGES.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-full"
              >
                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* -- Technical detail ------------------------------------------------ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-base font-bold text-white">
            What is WebAssembly?
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            WebAssembly (WASM) is a binary instruction format that runs in your
            browser at near-native speed. It&apos;s the same technology that lets
            Figma, Google Earth and AutoCAD run in a browser tab. We use it to
            run a professional-grade image processing engine directly in your
            browser.
          </p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Because all computation happens locally, there is no server involved
            in the conversion process. We don&apos;t log your files, we don&apos;t store
            your files, and we can&apos;t access your files - not because we promise
            not to, but because the architecture makes it technically
            impossible.
          </p>
          <div className="pt-2 border-t border-slate-700">
            <p className="text-xs text-slate-500 font-mono">
              File path:{' '}
              <span className="text-slate-400">
                your device → browser memory → WASM engine → download
              </span>
              <span className="ml-3 text-slate-600">{'// no network hop'}</span>
            </p>
          </div>
        </div>
      </section>

      {/* -- CTA + modules --------------------------------------------------- */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              Ready to try it?
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Pick a tool and convert your first file in seconds - no setup
              required.
            </p>
          </div>

          <LaboratoryModules title="Choose a studio" />

          <div className="flex justify-center">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-semibold text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Back to homepage
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
