import { Metadata } from 'next';
import { ArrowLeft, Crop, Shield, Zap, Monitor } from 'lucide-react';
import Link from 'next/link';
import CropTool from '@/features/image/crop/components/CropTool';

export const metadata: Metadata = {
  title: 'Image Crop & Resize — Free Online Tool',
  description:
    'Crop and resize images to any dimension or aspect ratio. Works 100% in your browser — no uploads, no account required.',
  keywords: [
    'crop image online',
    'resize image free',
    'image cropper',
    'crop photo online',
    'image resize tool',
    'browser image crop',
  ],
};

const FEATURES = [
  {
    icon: Crop,
    label: 'Visual crop editor',
    desc: 'Drag handles with rule-of-thirds grid',
  },
  {
    icon: Monitor,
    label: 'Preset aspect ratios',
    desc: '1:1, 4:3, 16:9, 3:2 and more',
  },
  {
    icon: Zap,
    label: 'Instant processing',
    desc: 'Powered by ImageMagick WebAssembly',
  },
  {
    icon: Shield,
    label: '100% private',
    desc: 'Files never leave your browser',
  },
];

export default function CropPage() {
  return (
    <div className="space-y-0">
      {/* ── Header ──────────────────────────────────────────────────────── */}
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
            Crop & Resize
          </span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-black">
                CROP
              </span>
              <span className="text-slate-300 dark:text-slate-600">+</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-black">
                RESIZE
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Crop & Resize Images Online
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Visually crop images with drag handles, lock aspect ratios, and
              resize to any pixel dimension — all processed locally in your
              browser.
            </p>
          </div>

          {/* Feature pills — desktop */}
          <div className="hidden sm:grid grid-cols-2 gap-2 shrink-0">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
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

        {/* Feature pills — mobile */}
        <div className="flex sm:hidden gap-2 mt-4 overflow-x-auto pb-1">
          {FEATURES.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 shrink-0 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-semibold text-slate-600 dark:text-slate-400"
            >
              <Icon className="w-3 h-3 text-blue-500" />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Tool ────────────────────────────────────────────────────────── */}
      <div className="px-6 py-6">
        <CropTool />
      </div>

      {/* ── How it works ────────────────────────────────────────────────── */}
      <div className="px-6 pb-8 border-t border-slate-100 dark:border-slate-800 pt-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-blue-500 inline-block" />
          How it works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              step: '01',
              title: 'Upload your image',
              desc: 'Drop any image file — PNG, JPG, WebP, HEIC and more.',
            },
            {
              step: '02',
              title: 'Crop or resize',
              desc: 'Drag the crop handles, pick an aspect ratio, or enter exact pixel dimensions.',
            },
            {
              step: '03',
              title: 'Download the result',
              desc: 'Choose your output format and download. Nothing is stored or uploaded.',
            },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex items-start gap-3">
              <span className="text-xs font-black text-slate-300 dark:text-slate-600 mt-0.5 shrink-0">
                {step}
              </span>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
