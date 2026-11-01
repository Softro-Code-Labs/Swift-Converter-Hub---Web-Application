import { GuideSection } from './Section';

interface TechnicalNoteProps {
  title: string;
  paragraphs: string[];
  accentColor?: string;
  collapsible?: boolean;
}

/** Background reading for the curious. Collapsed by default when long, so
 *  it never pushes the FAQ out of reach. */
export const TechnicalNote = ({
  title,
  paragraphs,
  collapsible,
}: TechnicalNoteProps) => {
  const collapse = collapsible ?? paragraphs.join(' ').length > 700;

  const body = (
    <div className="max-w-3xl space-y-3">
      {paragraphs.map((p, i) => (
        <p
          key={i}
          className="text-[15px] leading-relaxed text-slate-600 dark:text-slate-400"
        >
          {p}
        </p>
      ))}
    </div>
  );

  if (!collapse) return <GuideSection title={title}>{body}</GuideSection>;

  return (
    <section className="border-t border-slate-200 px-5 py-8 sm:px-8 dark:border-slate-800">
      <details className="group">
        <summary className="flex list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {title}
          </h2>
          <span className="text-sm font-medium text-slate-500 group-open:hidden dark:text-slate-400">
            Read more
          </span>
          <span className="hidden text-sm font-medium text-slate-500 group-open:inline dark:text-slate-400">
            Show less
          </span>
        </summary>
        <div className="mt-4">{body}</div>
      </details>
    </section>
  );
};
