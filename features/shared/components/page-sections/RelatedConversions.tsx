import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * Links to sibling format pairs (same source, same target, and the reverse)
 * on every format-pair page. Only indexable, curated pairs are linked, so
 * people find the conversion they actually want and search engines can
 * crawl the whole set without hitting thin pages.
 */
export function RelatedConversions({
  base,
  source,
  target,
  curated,
  label,
}: {
  /** e.g. '/image/convert' */
  base: string;
  source: string;
  target: string;
  /** Curated pair slugs such as 'jpg-to-png'. */
  curated: Set<string>;
  /** Lowercase extension -> display label, e.g. jpg -> 'JPG'. */
  label: (ext: string) => string;
}) {
  const current = `${source}-to-${target}`;
  const all = [...curated].filter((c) => c !== current);
  const pick = (pred: (s: string, t: string) => boolean) =>
    all.filter((c) => {
      const [s, t] = c.split('-to-');
      return pred(s, t);
    });

  const reverse = all.filter((c) => c === `${target}-to-${source}`);
  const sameSource = pick((s, t) => s === source && t !== source).slice(0, 6);
  const sameTarget = pick((s, t) => t === target && s !== target).slice(0, 6);
  const groups = [
    {
      title: `Convert ${label(source)} to other formats`,
      items: [...reverse, ...sameSource],
    },
    { title: `Convert other formats to ${label(target)}`, items: sameTarget },
  ]
    .map((g) => ({ ...g, items: [...new Set(g.items)] }))
    .filter((g) => g.items.length);

  if (!groups.length) return null;

  return (
    <section className="border-t border-slate-200 px-5 py-8 sm:px-8 dark:border-slate-800">
      <h2 className="mb-5 text-xl font-bold text-slate-900 dark:text-white">
        Related conversions
      </h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {groups.map((g) => (
          <div key={g.title}>
            <h3 className="mb-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
              {g.title}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {g.items.map((slug) => {
                const [s, t] = slug.split('-to-');
                return (
                  <li key={slug}>
                    <Link
                      href={`${base}/${slug}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-500/40 dark:hover:text-blue-300"
                    >
                      {label(s)}
                      <ArrowRight
                        className="h-3.5 w-3.5 text-slate-400"
                        aria-hidden
                      />
                      {label(t)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
