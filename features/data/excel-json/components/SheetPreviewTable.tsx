interface SheetPreviewTableProps {
  headers: string[];
  rawRows: unknown[][];
  hasHeader: boolean;
  maxRows?: number;
}

export function SheetPreviewTable({
  headers,
  rawRows,
  hasHeader,
  maxRows = 5,
}: SheetPreviewTableProps) {
  const previewRows = hasHeader
    ? rawRows.slice(1, maxRows + 1)
    : rawRows.slice(0, maxRows);

  if (previewRows.length === 0)
    return (
      <p className="text-xs text-slate-400 italic py-4 text-center">
        No data rows found
      </p>
    );

  return (
    <div className="overflow-auto rounded-xl border border-slate-200 dark:border-slate-700 max-h-52">
      <table className="w-full text-[10px] font-mono border-collapse min-w-max">
        <thead>
          <tr className="bg-emerald-50 dark:bg-emerald-950/30 border-b border-slate-200 dark:border-slate-700">
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-3 py-1.5 text-left font-bold text-emerald-700 dark:text-emerald-300 whitespace-nowrap border-r border-slate-200 dark:border-slate-700 last:border-r-0"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {previewRows.map((row, ri) => (
            <tr
              key={ri}
              className="border-b border-slate-100 dark:border-slate-800 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              {headers.map((_, ci) => (
                <td
                  key={ci}
                  className="px-3 py-1 text-slate-600 dark:text-slate-400 border-r border-slate-100 dark:border-slate-800 last:border-r-0 whitespace-nowrap max-w-[160px] truncate"
                >
                  {(row as unknown[])[ci] !== null &&
                  (row as unknown[])[ci] !== undefined ? (
                    String((row as unknown[])[ci])
                  ) : (
                    <span className="text-slate-300 dark:text-slate-600 italic">
                      empty
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
