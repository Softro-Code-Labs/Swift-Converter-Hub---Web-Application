import type { LucideIcon } from 'lucide-react';
import { GuideSection } from './Section';

interface Step {
  step: string;
  title: string;
  desc: string;
}

interface StepListProps {
  title: string;
  steps: Step[];
  /** Kept for compatibility - colour now comes from the design system. */
  accentColor?: string;
  /** 'boxed' renders without its own section padding (caller provides it). */
  variant?: 'plain' | 'boxed';
  icons?: LucideIcon[];
}

/** A real sequence, so it is numbered. */
export const StepList = ({
  title,
  steps,
  variant = 'plain',
}: StepListProps) => (
  <GuideSection title={title} bare={variant === 'boxed'}>
    <ol className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-3">
      {steps.map(({ step, title: stepTitle, desc }, i) => (
        <li key={step} className="relative flex gap-3.5 sm:flex-col sm:gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 font-display text-sm font-bold text-white dark:bg-white dark:text-slate-900">
            {i + 1}
          </span>
          {i < steps.length - 1 && (
            <span
              aria-hidden
              className="absolute left-12 right-0 top-4 hidden h-px bg-slate-200 sm:block dark:bg-slate-700"
            />
          )}
          <div>
            <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
              {stepTitle}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {desc}
            </p>
          </div>
        </li>
      ))}
    </ol>
  </GuideSection>
);
