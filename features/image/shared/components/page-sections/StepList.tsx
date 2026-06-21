'use client';

import { useState } from 'react';
import { Upload, Cpu, Download, type LucideIcon } from 'lucide-react';

interface Step {
  step: string;
  title: string;
  desc: string;
}

interface StepListProps {
  title: string;
  steps: Step[];
  accentColor?: string;
  variant?: 'plain' | 'boxed';
  icons?: LucideIcon[];
}

const ACCENT_BG: Record<string, string> = {
  'bg-blue-500':
    'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 ring-blue-100 dark:ring-blue-900/40',
  'bg-purple-500':
    'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 ring-purple-100 dark:ring-purple-900/40',
  'bg-amber-500':
    'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 ring-amber-100 dark:ring-amber-900/40',
  'bg-emerald-500':
    'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 ring-emerald-100 dark:ring-emerald-900/40',
};

const BOXED_STEP_COLORS = [
  {
    bg: 'bg-blue-100 dark:bg-blue-950/60',
    text: 'text-blue-600 dark:text-blue-400',
    num: 'bg-blue-600 text-white',
  },
  {
    bg: 'bg-purple-100 dark:bg-purple-950/60',
    text: 'text-purple-600 dark:text-purple-400',
    num: 'bg-purple-600 text-white',
  },
  {
    bg: 'bg-emerald-100 dark:bg-emerald-950/60',
    text: 'text-emerald-600 dark:text-emerald-400',
    num: 'bg-emerald-600 text-white',
  },
];

const DEFAULT_BOXED_ICONS: LucideIcon[] = [Upload, Cpu, Download];

export const StepList = ({
  title,
  steps,
  accentColor = 'bg-blue-500',
  variant = 'plain',
  icons,
}: StepListProps) => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const badgeClasses = ACCENT_BG[accentColor] ?? ACCENT_BG['bg-blue-500'];

  if (variant === 'boxed') {
    const boxedIcons = icons ?? DEFAULT_BOXED_ICONS;

    return (
      <section className="rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 p-6">
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
          <span
            className={`w-1 h-4 rounded-full ${accentColor} inline-block`}
          />
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {/* Connector line - desktop only */}
          <div className="hidden md:block absolute top-5 left-[calc(16.67%+16px)] right-[calc(16.67%+16px)] h-px bg-slate-200 dark:bg-slate-700 z-0" />

          {steps.map(({ step, title: stepTitle, desc }, i) => {
            const Icon = boxedIcons[i] ?? boxedIcons[boxedIcons.length - 1];
            const color = BOXED_STEP_COLORS[i % BOXED_STEP_COLORS.length];
            return (
              <div
                key={step}
                className="relative z-10 flex flex-col items-center text-center sm:flex-row sm:text-left md:flex-col md:text-center gap-4"
              >
                {i < steps.length - 1 && (
                  <div className="md:hidden absolute left-5 top-10 w-px h-full bg-slate-200 dark:bg-slate-700 sm:hidden" />
                )}

                <div className="relative shrink-0">
                  <div
                    className={`w-10 h-10 rounded-xl ${color.bg} ${color.text} flex items-center justify-center`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${color.num}`}
                  >
                    {step}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {stepTitle}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-[180px] md:max-w-none mx-auto">
                    {desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  // -- Plain variant -----------------------------------------------------------
  return (
    <div className="px-6 pb-8 border-t border-slate-100 dark:border-slate-800 pt-6">
      <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
        <span className={`w-1 h-4 rounded-full ${accentColor} inline-block`} />
        {title}
      </h2>

      <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="hidden sm:block absolute top-4 left-0 right-0 h-px bg-slate-100 dark:bg-slate-800" />

        {steps.map(({ step, title: stepTitle, desc }, idx) => (
          <div
            key={step}
            onMouseEnter={() => setActiveStep(idx)}
            onMouseLeave={() => setActiveStep(null)}
            className="relative flex items-start gap-3 group"
          >
            <span
              className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full text-[11px] font-black shrink-0 ring-4 ring-white dark:ring-slate-900 transition-all duration-200
                ${
                  activeStep === idx
                    ? badgeClasses
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                }`}
            >
              {step}
            </span>
            <div className="pt-1">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors group-hover:text-slate-900 dark:group-hover:text-slate-100">
                {stepTitle}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                {desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
