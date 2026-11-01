import { cn } from '@/lib/utils';

/** Common wrapper for the help content under a tool: one rhythm, one rule. */
export function GuideSection({
  title,
  aside,
  children,
  className,
  bare = false,
}: {
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Render without the section padding/border (when the caller provides it). */
  bare?: boolean;
}) {
  return (
    <section
      className={cn(
        !bare &&
          'border-t border-slate-200 px-5 py-8 sm:px-8 dark:border-slate-800',
        className,
      )}
    >
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );
}
