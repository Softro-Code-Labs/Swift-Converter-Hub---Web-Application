import type { StudioHeroConfig } from '../types/studio';
import { Sparkles } from 'lucide-react';

interface StudioHeroProps {
  config: StudioHeroConfig;
  liveCount: number;
  totalCount: number;
}

export function StudioHero({ config, liveCount, totalCount }: StudioHeroProps) {
  const {
    icon: Icon,
    iconColor,
    iconBg,
    title,
    subtitle,
    description,
    privacyNote,
    accentFrom,
    accentTo,
    badgeColor,
    pills,
  } = config;

  const pct = Math.round((liveCount / totalCount) * 100);

  return (
    <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.018] dark:opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="relative">
        {/* Top row */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${iconBg}`}
            >
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {title}
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                {subtitle}
              </p>
            </div>
          </div>
          <span
            className={`shrink-0 inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border ${badgeColor}`}
          >
            <Sparkles className="w-3 h-3" />
            {liveCount === 0
              ? 'Coming soon'
              : `${liveCount} tool${liveCount !== 1 ? 's' : ''} live`}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5 max-w-2xl">
          {description}
        </p>

        {/* Progress bar */}
        <div className="space-y-1.5 mb-5">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
            <span>
              {liveCount} of {totalCount} tools live
            </span>
            <span>{pct}% complete</span>
          </div>
          <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${accentFrom} ${accentTo} rounded-full transition-all duration-700`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Stat pills */}
        <div className="flex flex-wrap gap-2">
          {pills.map(({ icon: PillIcon, label, color }) => (
            <div
              key={label}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-semibold ${color}`}
            >
              <PillIcon className="w-3 h-3 shrink-0" />
              {label}
            </div>
          ))}
        </div>

        {/* Privacy note */}
        <p className="mt-4 text-[11px] text-slate-400 dark:text-slate-500 font-semibold">
          {privacyNote}
        </p>
      </div>
    </div>
  );
}
