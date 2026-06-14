'use client';

import Link from 'next/link';
import {
  Image as ImageIcon,
  FileText,
  Music,
  Video,
  Database,
  Type,
  HelpCircle,
} from 'lucide-react';

interface LaboratoryModulesProps {
  title?: string;
}

export const LaboratoryModules = ({
  title = 'Available Laboratory Modules',
}: LaboratoryModulesProps) => {
  const modules = [
    {
      href: '/image',
      title: 'Image Studio',
      desc: 'Convert & compress WebP, PNG, HEIC',
      icon: ImageIcon,
      themeClass:
        'hover:bg-blue-50/50 dark:hover:bg-blue-950/30 hover:border-blue-200 dark:hover:border-blue-800',
      iconBg:
        'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 group-hover/item:bg-blue-600 dark:group-hover/item:bg-blue-500',
    },
    {
      href: '/file',
      title: 'Document Suite',
      desc: 'PDF compiler, Word tools, Excel',
      icon: FileText,
      themeClass:
        'hover:bg-cyan-50/50 dark:hover:bg-cyan-950/30 hover:border-cyan-200 dark:hover:border-cyan-800',
      iconBg:
        'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400 group-hover/item:bg-cyan-600 dark:group-hover/item:bg-cyan-500',
    },
    {
      href: '/audio',
      title: 'Audio Studio',
      desc: 'Transcode MP3, WAV, FLAC, bitrates',
      icon: Music,
      themeClass:
        'hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 hover:border-emerald-200 dark:hover:border-emerald-800',
      iconBg:
        'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 group-hover/item:bg-emerald-600 dark:group-hover/item:bg-emerald-500',
    },
    {
      href: '/data',
      title: 'Data Studio',
      desc: 'Map schemas across CSV, JSON, XML',
      icon: Database,
      themeClass:
        'hover:bg-amber-50/50 dark:hover:bg-amber-950/30 hover:border-amber-200 dark:hover:border-amber-800',
      iconBg:
        'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 group-hover/item:bg-amber-600 dark:group-hover/item:bg-amber-500',
    },
    {
      href: '/video',
      title: 'Video Studio',
      desc: 'Clip rendering, MP4 arrays, GIF engine',
      icon: Video,
      themeClass:
        'hover:bg-purple-50/50 dark:hover:bg-purple-950/30 hover:border-purple-200 dark:hover:border-purple-800',
      iconBg:
        'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 group-hover/item:bg-purple-600 dark:group-hover/item:bg-purple-500',
    },
    {
      href: '/character',
      title: 'Character Studio',
      desc: 'Case shifts, word metrics, sanitation',
      icon: Type,
      themeClass:
        'hover:bg-rose-50/50 dark:hover:bg-rose-950/30 hover:border-rose-200 dark:hover:border-rose-800',
      iconBg:
        'bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 group-hover/item:bg-rose-600 dark:group-hover/item:bg-rose-500',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm dark:shadow-xl dark:shadow-black/20 space-y-4 transition-colors duration-300">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          {title}
        </p>
        <HelpCircle className="w-4 h-4 text-slate-300 dark:text-slate-600 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        {modules.map((mod) => {
          const IconComponent = mod.icon;
          return (
            <Link
              key={mod.href}
              href={mod.href}
              className={`flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/40 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all duration-200 group/item active:scale-98 cursor-pointer ${mod.themeClass}`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg shadow-sm flex-shrink-0 group-hover/item:text-white transition-colors duration-200 ${mod.iconBg}`}
              >
                <IconComponent className="w-4 h-4 group-hover/item:scale-110 transition-transform" />
              </span>
              <div>
                <span className="block font-bold">{mod.title}</span>
                <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-normal mt-0.5">
                  {mod.desc}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
