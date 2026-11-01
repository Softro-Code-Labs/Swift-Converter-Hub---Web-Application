import Link from 'next/link';
import { PageHeader } from './PageHeader';

export interface LegalSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

/** Long legal documents: a contents list you can jump from, and readable
 *  prose instead of a stack of boxed cards. */
export function LegalLayout({
  title,
  meta,
  lead,
  notice,
  sections,
  related,
}: {
  title: string;
  meta: React.ReactNode;
  lead?: React.ReactNode;
  notice?: React.ReactNode;
  sections: LegalSection[];
  related: { label: string; href: string };
}) {
  const slug = (s: LegalSection) => `section-${s.id}`;
  return (
    <main className="flex-1">
      <PageHeader title={title} meta={meta} lead={lead} width="max-w-5xl">
        {notice && (
          <div className="mt-6 max-w-2xl rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-[15px] leading-relaxed text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100">
            {notice}
          </div>
        )}
      </PageHeader>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14 lg:px-8 lg:py-14">
        <nav
          aria-label="On this page"
          className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start"
        >
          <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
            On this page
          </p>
          <ol className="space-y-1.5 border-l border-slate-200 text-sm dark:border-slate-800">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${slug(s)}`}
                  className="-ml-px block border-l border-transparent py-0.5 pl-3 text-slate-600 hover:border-slate-400 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="max-w-2xl">
          {sections.map((s, i) => (
            <section
              key={s.id}
              id={slug(s)}
              className={
                i > 0
                  ? 'mt-10 border-t border-slate-200 pt-10 dark:border-slate-800'
                  : ''
              }
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                <span className="mr-2 font-sans text-base font-medium text-slate-400 tabular-nums">
                  {s.id}.
                </span>
                {s.title}
              </h2>
              <div className="prose-site mt-4 text-[16px]">{s.content}</div>
            </section>
          ))}

          <p className="mt-14 border-t border-slate-200 pt-6 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
            See also our{' '}
            <Link
              href={related.href}
              className="font-medium text-slate-900 underline underline-offset-4 dark:text-white"
            >
              {related.label}
            </Link>
            . Questions?{' '}
            <Link
              href="/contact"
              className="font-medium text-slate-900 underline underline-offset-4 dark:text-white"
            >
              Contact us
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
