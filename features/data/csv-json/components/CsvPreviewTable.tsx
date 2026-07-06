interface CsvPreviewTableProps {
  text: string;
  delimiter: string;
  hasHeader: boolean;
  maxRows?: number;
}

export function CsvPreviewTable({
  text,
  delimiter,
  hasHeader,
  maxRows = 6,
}: CsvPreviewTableProps) {
  if (!text.trim()) return null;

  const lines = text
    .trim()
    .split('\n')
    .slice(0, maxRows + (hasHeader ? 1 : 0));
  const rows = lines.map((l) => l.split(delimiter));
  const headers = hasHeader ? rows[0] : rows[0].map((_, i) => `col_${i}`);
  const dataRows = hasHeader ? rows.slice(1) : rows;
  const totalCols = headers.length;

  return (
    <div className="overflow-auto rounded-xl border border-slate-200 dark:border-slate-700 max-h-48">
      <table className="w-full text-[10px] font-mono border-collapse min-w-max">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-3 py-1.5 text-left font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap border-r border-slate-200 dark:border-slate-700 last:border-r-0"
              >
                {h || `col_${i}`}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, ri) => (
            <tr
              key={ri}
              className="border-b border-slate-100 dark:border-slate-800 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              {Array.from({ length: totalCols }).map((_, ci) => (
                <td
                  key={ci}
                  className="px-3 py-1 text-slate-600 dark:text-slate-400 whitespace-nowrap border-r border-slate-100 dark:border-slate-800 last:border-r-0 max-w-[160px] truncate"
                >
                  {row[ci] ?? ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
