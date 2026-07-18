import type { RegexMatch } from '../types/regexTester';

interface MatchCardProps {
  match: RegexMatch;
  active: boolean;
  onClick: () => void;
}

export function MatchCard({ match, active, onClick }: MatchCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border p-3 transition-all space-y-2
        ${
          active
            ? 'border-purple-400 bg-purple-50 dark:bg-purple-950/30 shadow-sm'
            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-300 dark:hover:border-purple-800'
        }`}
    >
      {/* Match header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-black px-1.5 py-0.5 rounded-md
            ${
              active
                ? 'bg-purple-200 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}
          >
            #{match.index + 1}
          </span>
          <code className="text-xs font-mono text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
            {match.fullMatch === '' ? (
              <span className="text-slate-300 dark:text-slate-600 italic">
                empty match
              </span>
            ) : (
              `"${match.fullMatch}"`
            )}
          </code>
        </div>
        <span className="text-[10px] text-slate-400 tabular-nums shrink-0">
          {match.start}-{match.end}
        </span>
      </div>

      {/* Capture groups */}
      {match.groups.length > 0 && (
        <div className="space-y-1">
          {match.groups.map((g) => (
            <div key={g.index} className="flex items-center gap-2 text-[10px]">
              <span className="font-bold text-purple-500 dark:text-purple-400 shrink-0 w-16 truncate">
                {g.name ? `$<${g.name}>` : `$${g.index}`}
              </span>
              <code
                className={`font-mono truncate ${g.value === null ? 'text-slate-300 dark:text-slate-600 italic' : 'text-slate-600 dark:text-slate-400'}`}
              >
                {g.value === null
                  ? 'undefined'
                  : g.value === ''
                    ? 'empty'
                    : `"${g.value}"`}
              </code>
            </div>
          ))}
        </div>
      )}
    </button>
  );
}
