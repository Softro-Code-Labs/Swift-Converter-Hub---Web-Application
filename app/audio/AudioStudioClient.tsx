'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Music,
  Disc,
  Scissors,
  Sliders,
  FileAudio,
  Shield,
  Zap,
  Bell,
} from 'lucide-react';

const TOOLS = [
  {
    icon: Disc,
    title: 'Audio Format Converter',
    desc: 'Convert between MP3, WAV, FLAC, OGG and M4A using a professional WebAssembly audio engine.',
    color:
      'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: Scissors,
    title: 'Audio Trimmer',
    desc: 'Cut clips or trim silence with a visual waveform editor.',
    color: 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
  },
  {
    icon: Sliders,
    title: 'Bitrate & Volume Adjuster',
    desc: 'Change export bitrate or boost/normalize volume levels.',
    color:
      'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
  },
  {
    icon: FileAudio,
    title: 'Audio Extractor from Video',
    desc: 'Pull the audio track out of an MP4 or MOV file as MP3.',
    color:
      'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
  },
] as const;

const FEATURES = [
  {
    icon: Shield,
    label: '100% private',
    desc: 'Files never leave your browser',
  },
  {
    icon: Zap,
    label: 'Powered by WebAssembly',
    desc: 'Real audio processing, not just renaming',
  },
];

export default function AudioStudioClient() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 selection:bg-blue-500 selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to home
        </Link>

        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 mb-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <Music className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Audio Studio
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400">
                  <Bell className="w-2.5 h-2.5" /> Coming soon
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Browser-based audio tools, in development
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            We're building a full audio toolkit using high-performance
            WebAssembly - the same engine that powers our image and video
            processing - so conversion, trimming and bitrate control happen
            entirely on your device.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400"
              >
                <Icon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Planned tools */}
        <div className="space-y-4">
          <h2 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1 h-3 rounded-full bg-emerald-500 inline-block" />
            Planned tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {TOOLS.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="flex gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-80"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Want to be notified when Audio Studio launches?{' '}
            <Link
              href="/contact"
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Get in touch
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
