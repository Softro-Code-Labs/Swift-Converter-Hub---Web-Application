import {
  Database,
  FileText,
  ImageIcon,
  Music,
  Type,
  Video,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

const STUDIOS = [
  {
    icon: ImageIcon,
    label: 'Image Studio',
    href: '/image',
    desc: 'Convert, compress and edit WebP, PNG, JPEG, HEIC and 120+ formats.',
    accent: 'blue',
    tools: ['Format Convert', 'Batch Convert', 'Crop & Resize', 'Compress'],
  },
  // {
  //   icon: Music,
  //   label: 'Audio Studio',
  //   href: '/audio',
  //   desc: 'Transcode MP3, WAV, FLAC and M4A with bitrate and quality control.',
  //   accent: 'emerald',
  //   tools: ['MP3 Convert', 'WAV to FLAC', 'Bitrate Adjust', 'Trim Audio'],
  // },
  // {
  //   icon: Video,
  //   label: 'Video Studio',
  //   href: '/video',
  //   desc: 'Transcode MP4, WebM and AVI. Clip, compress and convert in seconds.',
  //   accent: 'purple',
  //   tools: ['MP4 Convert', 'GIF Export', 'Compress Video', 'Clip Trim'],
  // },
  // {
  //   icon: FileText,
  //   label: 'Document Suite',
  //   href: '/file',
  //   desc: 'Generate and convert PDFs, Word documents and Excel spreadsheets.',
  //   accent: 'cyan',
  //   tools: ['PDF Convert', 'Word to PDF', 'Merge PDF', 'Excel Tools'],
  // },
  // {
  //   icon: Database,
  //   label: 'Data Studio',
  //   href: '/data',
  //   desc: 'Parse and convert JSON, CSV, XML and structured data formats.',
  //   accent: 'amber',
  //   tools: ['JSON to CSV', 'XML Parse', 'CSV Convert', 'Format Data'],
  // },
  {
    icon: Type,
    label: 'Character Studio',
    href: '/character',
    desc: 'Transform text, apply encoding changes and regex operations.',
    accent: 'rose',
    tools: ['Case Convert', 'Base64 Encode', 'URL Encode', 'Markdown'],
  },
];

const ACCENT = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    icon: 'text-blue-600 dark:text-blue-400',
    iconHover: 'group-hover:bg-blue-600',
    border: 'group-hover:border-blue-200 dark:group-hover:border-blue-800',
    link: 'text-blue-600 dark:text-blue-400',
    pill: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    icon: 'text-emerald-600 dark:text-emerald-400',
    iconHover: 'group-hover:bg-emerald-600',
    border:
      'group-hover:border-emerald-200 dark:group-hover:border-emerald-800',
    link: 'text-emerald-600 dark:text-emerald-400',
    pill: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    icon: 'text-purple-600 dark:text-purple-400',
    iconHover: 'group-hover:bg-purple-600',
    border: 'group-hover:border-purple-200 dark:group-hover:border-purple-800',
    link: 'text-purple-600 dark:text-purple-400',
    pill: 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
  },
  cyan: {
    bg: 'bg-cyan-50 dark:bg-cyan-950/40',
    icon: 'text-cyan-600 dark:text-cyan-400',
    iconHover: 'group-hover:bg-cyan-600',
    border: 'group-hover:border-cyan-200 dark:group-hover:border-cyan-800',
    link: 'text-cyan-600 dark:text-cyan-400',
    pill: 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    icon: 'text-amber-600 dark:text-amber-400',
    iconHover: 'group-hover:bg-amber-600',
    border: 'group-hover:border-amber-200 dark:group-hover:border-amber-800',
    link: 'text-amber-600 dark:text-amber-400',
    pill: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
  },
  rose: {
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    icon: 'text-rose-600 dark:text-rose-400',
    iconHover: 'group-hover:bg-rose-600',
    border: 'group-hover:border-rose-200 dark:group-hover:border-rose-800',
    link: 'text-rose-600 dark:text-rose-400',
    pill: 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',
  },
} as const;

const TRUST = [
  {
    icon: Shield,
    label: 'Zero uploads',
    desc: 'Files never leave your device',
  },
  { icon: Zap, label: 'Instant processing', desc: 'Powered by WebAssembly' },
  { icon: Globe, label: 'Works offline', desc: 'No internet after page load' },
];

const STATS = [
  { value: '120+', label: 'Image formats' },
  { value: '100%', label: 'Browser-side' },
  { value: '0', label: 'Server uploads' },
  { value: '6', label: 'Studio tools' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* -- Hero ------------------------------------------------------------ */}
      <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-xs font-bold text-blue-700 dark:text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              100% private · browser-side processing
              <Sparkles className="w-3 h-3" />
            </span>
          </div>

          {/* Headline */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Convert anything.{' '}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Privately.
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
              A complete file conversion toolkit that runs entirely in your
              browser. Images, audio, video, documents, data - no uploads, no
              accounts, no limits.
            </p>
          </div>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Link
              href="/image"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-blue-500/20"
            >
              <ImageIcon className="w-4 h-4" />
              Start with Image Studio
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#studios"
              className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-xl transition-all"
            >
              Browse all tools
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-12">
            {STATS.map(({ value, label }) => (
              <div
                key={label}
                className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800"
              >
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  {value}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- Trust strip ----------------------------------------------------- */}
      <section className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10">
            {TRUST.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {label}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- Studios --------------------------------------------------------- */}
      <section
        id="studios"
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14"
      >
        <div className="flex items-center gap-2 mb-8">
          <span className="w-1 h-5 rounded-full bg-blue-500 inline-block" />
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            All Studios
          </h2>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            {STUDIOS.length} tools
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {STUDIOS.map((studio) => {
            const Icon = studio.icon;
            const a = ACCENT[studio.accent as keyof typeof ACCENT];
            return (
              <Link
                key={studio.label}
                href={studio.href}
                className={`group relative flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md transition-all duration-200 ${a.border}`}
              >
                {/* Icon */}
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${a.bg} ${a.icon} ${a.iconHover} group-hover:text-white transition-all duration-200 mb-4`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                  {studio.label}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
                  {studio.desc}
                </p>

                {/* Tool pills */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {studio.tools.map((tool) => (
                    <span
                      key={tool}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${a.pill}`}
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                {/* Footer link */}
                <div
                  className={`flex items-center gap-1 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-bold ${a.link} group-hover:gap-2 transition-all`}
                >
                  Open {studio.label}
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* -- Bottom CTA ------------------------------------------------------ */}
      <section className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center space-y-4">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Ready to convert?
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            All tools are free, private, and require no sign-up. Your files
            never leave your browser.
          </p>
          <Link
            href="/image"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all mt-2"
          >
            Get started free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
