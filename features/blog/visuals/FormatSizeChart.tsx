/**
 * Range bars for "typical size vs. JPEG" on a photo. The ranges are the same
 * rough figures the article's table gives, drawn so the gap is visible.
 */
const ROWS = [
  { name: 'AVIF', min: 50, max: 60, bar: 'bg-emerald-500', note: '~40-50% smaller' },
  { name: 'WebP', min: 65, max: 75, bar: 'bg-blue-500', note: '~25-35% smaller' },
  { name: 'JPEG', min: 100, max: 100, bar: 'bg-slate-500', note: 'Baseline' },
  { name: 'PNG', min: 200, max: 500, bar: 'bg-rose-500', note: '2-5x larger' },
];
const SCALE = 500; // %, the right edge of the chart

export function FormatSizeChart() {
  return (
    <div>
      <p className="mb-5 text-[14px] font-semibold text-slate-900 dark:text-white">
        File size of the same photo, compared with JPEG
      </p>
      <div className="space-y-4">
        {ROWS.map((r) => (
          <div key={r.name} className="grid grid-cols-[3.5rem_1fr] items-center gap-3 sm:grid-cols-[3.5rem_1fr_8.5rem]">
            <span className="text-[15px] font-semibold text-slate-900 dark:text-white">{r.name}</span>
            <div
              className="relative h-7 rounded-md bg-slate-100 dark:bg-slate-800"
              role="img"
              aria-label={`${r.name}: ${r.note}`}
            >
              {/* solid bar up to the low end of the range */}
              <div
                className={`absolute inset-y-0 left-0 rounded-md ${r.bar}`}
                style={{ width: `${(r.min / SCALE) * 100}%` }}
              />
              {/* striped band for the spread */}
              {r.max > r.min && (
                <div
                  className={`absolute inset-y-0 rounded-r-md opacity-35 ${r.bar}`}
                  style={{
                    left: `${(r.min / SCALE) * 100}%`,
                    width: `${((r.max - r.min) / SCALE) * 100}%`,
                  }}
                />
              )}
              {/* JPEG baseline marker */}
              <div
                className="absolute inset-y-[-4px] w-px bg-slate-900/40 dark:bg-white/40"
                style={{ left: `${(100 / SCALE) * 100}%` }}
                aria-hidden
              />
            </div>
            <span className="col-start-2 -mt-2 text-[13px] text-slate-500 sm:col-start-auto sm:mt-0 dark:text-slate-400">
              {r.note}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-px bg-slate-900/40 dark:bg-white/40" aria-hidden />
          JPEG baseline
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-4 rounded-sm bg-slate-400 opacity-40" aria-hidden />
          Typical spread - depends on the photo
        </span>
      </div>
    </div>
  );
}
