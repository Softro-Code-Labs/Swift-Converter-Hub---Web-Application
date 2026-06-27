'use client';

import Link from 'next/link';
import {
  ImageIcon,
  FileText,
  Music,
  Video,
  Database,
  Type,
  ArrowRight,
} from 'lucide-react';

const MODULES = [
  {
    href: '/image',
    label: 'Image Studio',
    desc: 'Convert WebP, PNG, HEIC and 70+ formats',
    icon: ImageIcon,
    color: 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
    hover:
      'hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-950/20',
    iconHover: 'group-hover:bg-blue-600 group-hover:text-white',
  },
  // {
  //   href: '/audio',
  //   label: 'Audio Studio',
  //   desc: 'Transcode MP3, WAV, FLAC and more',
  //   icon: Music,
  //   color:
  //     'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
  //   hover:
  //     'hover:border-emerald-200 dark:hover:border-emerald-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20',
  //   iconHover: 'group-hover:bg-emerald-600 group-hover:text-white',
  // },
  // {
  //   href: '/video',
  //   label: 'Video Studio',
  //   desc: 'Convert MP4, WebM, clip and compress',
  //   icon: Video,
  //   color:
  //     'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
  //   hover:
  //     'hover:border-purple-200 dark:hover:border-purple-800 hover:bg-purple-50/50 dark:hover:bg-purple-950/20',
  //   iconHover: 'group-hover:bg-purple-600 group-hover:text-white',
  // },
  // {
  //   href: '/file',
  //   label: 'Document Suite',
  //   desc: 'PDF, Word, Excel and document tools',
  //   icon: FileText,
  //   color: 'bg-cyan-100 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400',
  //   hover:
  //     'hover:border-cyan-200 dark:hover:border-cyan-800 hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20',
  //   iconHover: 'group-hover:bg-cyan-600 group-hover:text-white',
  // },
  // {
  //   href: '/data',
  //   label: 'Data Studio',
  //   desc: 'Parse JSON, CSV and XML formats',
  //   icon: Database,
  //   color:
  //     'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
  //   hover:
  //     'hover:border-amber-200 dark:hover:border-amber-800 hover:bg-amber-50/50 dark:hover:bg-amber-950/20',
  //   iconHover: 'group-hover:bg-amber-600 group-hover:text-white',
  // },
  {
    href: '/character',
    label: 'Character Studio',
    desc: 'Text encoding, case and regex tools',
    icon: Type,
    color: 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',
    hover:
      'hover:border-rose-200 dark:hover:border-rose-800 hover:bg-rose-50/50 dark:hover:bg-rose-950/20',
    iconHover: 'group-hover:bg-rose-600 group-hover:text-white',
  },
];

interface LaboratoryModulesProps {
  title?: string;
}

export const LaboratoryModules = ({
  title = 'Available tools',
}: LaboratoryModulesProps) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          {title}
        </p>
        <span className="text-[10px] font-semibold text-slate-300 dark:text-slate-600">
          {MODULES.length} studios
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-slate-100 dark:bg-slate-800">
        {MODULES.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link
              key={mod.href}
              href={mod.href}
              className={`group flex items-center gap-3 p-4 bg-white dark:bg-slate-900 border border-transparent transition-all duration-200 ${mod.hover}`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${mod.color} ${mod.iconHover}`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="min-w-0 flex-1 text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  {mod.label}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                  {mod.desc}
                </p>
              </div>

              <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
};
