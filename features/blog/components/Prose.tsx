import Link from 'next/link';
import type { ReactNode } from 'react';

/* ---------------------------------------------------------------------------
   Typography for blog articles. One place for the reading styles so every
   post looks the same and a tweak here applies everywhere.
--------------------------------------------------------------------------- */

export const P = ({ children }: { children: ReactNode }) => (
  <p className="mb-5 text-[17px] leading-[1.75] text-slate-700 dark:text-slate-300">
    {children}
  </p>
);

/** Section heading. Give it an `id` so the table of contents can link to it. */
export const H2 = ({ id, children }: { id?: string; children: ReactNode }) => (
  <h2
    id={id}
    className="mb-4 mt-14 scroll-mt-24 text-2xl font-bold leading-tight text-slate-900 sm:text-[1.75rem] dark:text-white"
  >
    {children}
  </h2>
);

export const H3 = ({ children }: { children: ReactNode }) => (
  <h3 className="mb-2 mt-8 text-xl font-semibold text-slate-900 dark:text-white">
    {children}
  </h3>
);

export const List = ({
  children,
  ordered = false,
}: {
  children: ReactNode;
  ordered?: boolean;
}) => {
  const className = `${ordered ? 'list-decimal' : 'list-disc'} mb-6 space-y-2.5 pl-5 text-[17px] leading-[1.7] text-slate-700 marker:text-slate-400 dark:text-slate-300`;
  return ordered ? (
    <ol className={className}>{children}</ol>
  ) : (
    <ul className={className}>{children}</ul>
  );
};

/** Internal link inside article text. */
export const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link
    href={href}
    className="font-semibold text-blue-600 underline-offset-4 hover:underline dark:text-blue-400"
  >
    {children}
  </Link>
);

/** Simple, responsive data table. `rows` cells may contain JSX. */
export const DataTable = ({
  head,
  rows,
  caption,
}: {
  head: string[];
  rows: ReactNode[][];
  caption?: string;
}) => (
  <div className="mb-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
    <table className="w-full border-collapse text-left text-[15px]">
      {caption && <caption className="sr-only">{caption}</caption>}
      <thead className="bg-slate-50 dark:bg-slate-900">
        <tr>
          {head.map((h) => (
            <th
              key={h}
              scope="col"
              className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-900 dark:border-slate-800 dark:text-white"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={i}
            className="border-b border-slate-100 last:border-0 dark:border-slate-800/70"
          >
            {row.map((cell, j) => (
              <td
                key={j}
                className={`px-4 py-3 align-top text-slate-700 dark:text-slate-300 ${j === 0 ? 'font-semibold text-slate-900 dark:text-white' : ''}`}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
