import {
  CheckCircle2,
  Info,
  Lightbulb,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';

type Tone = 'tip' | 'note' | 'warning';

const TONES: Record<Tone, { icon: LucideIcon; label: string; box: string; icon_: string }> = {
  tip: {
    icon: Lightbulb,
    label: 'Tip',
    box: 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-500/25 dark:bg-emerald-500/10',
    icon_: 'text-emerald-600 dark:text-emerald-400',
  },
  note: {
    icon: Info,
    label: 'Good to know',
    box: 'border-blue-200 bg-blue-50/70 dark:border-blue-500/25 dark:bg-blue-500/10',
    icon_: 'text-blue-600 dark:text-blue-400',
  },
  warning: {
    icon: TriangleAlert,
    label: 'Watch out',
    box: 'border-amber-200 bg-amber-50/70 dark:border-amber-500/25 dark:bg-amber-500/10',
    icon_: 'text-amber-600 dark:text-amber-400',
  },
};

/** A highlighted aside: a tip, a note or a warning. */
export function Callout({
  tone = 'note',
  title,
  children,
}: {
  tone?: Tone;
  title?: string;
  children: ReactNode;
}) {
  const t = TONES[tone];
  const Icon = t.icon;
  return (
    <aside className={`my-8 flex gap-3.5 rounded-xl border p-5 ${t.box}`}>
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${t.icon_}`} aria-hidden />
      <div className="text-[16px] leading-relaxed text-slate-700 dark:text-slate-300">
        <p className="mb-1 font-semibold text-slate-900 dark:text-white">
          {title ?? t.label}
        </p>
        {children}
      </div>
    </aside>
  );
}

/** The "if you only read one thing" box near the top of a post. */
export function KeyTakeaways({ items }: { items: ReactNode[] }) {
  return (
    <section
      aria-label="Key takeaways"
      className="my-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <p className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Key takeaways
      </p>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-3 text-[16px] leading-relaxed text-slate-700 dark:text-slate-300"
          >
            <CheckCircle2
              className="mt-1 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
              aria-hidden
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Frame for a diagram or interactive demo, with an optional caption. */
export function Figure({
  caption,
  children,
  bare = false,
}: {
  caption?: ReactNode;
  children: ReactNode;
  /** Skip the card frame (for widgets that draw their own). */
  bare?: boolean;
}) {
  return (
    <figure className="my-10">
      <div
        className={
          bare
            ? ''
            : 'overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900'
        }
      >
        {children}
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-[14px] leading-relaxed text-slate-500 dark:text-slate-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
