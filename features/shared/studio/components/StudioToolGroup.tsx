import { StudioFeaturedCard } from './StudioFeaturedCard';
import { StudioRegularCard } from './StudioRegularCard';
import type { StudioTool, StudioGroup } from '../types/studio';

interface StudioToolGroupProps {
  group: StudioGroup;
  tools: StudioTool[];
  query: string;
}

export function StudioToolGroup({ group, tools, query }: StudioToolGroupProps) {
  const featured = tools.filter((t) => t.featured);
  const regular = tools.filter((t) => !t.featured);

  return (
    <section className="space-y-4">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <span className={`w-2 h-2 rounded-full shrink-0 ${group.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-sm font-black text-slate-800 dark:text-slate-200 tracking-tight">
              {group.label}
            </h2>
            <span className="text-[10px] font-bold text-slate-300 dark:text-slate-600 tabular-nums">
              {tools.length} tool{tools.length !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            {group.desc}
          </p>
        </div>
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <div
          className={`grid gap-3 ${featured.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}
        >
          {featured.map((tool) => (
            <StudioFeaturedCard key={tool.id} tool={tool} query={query} />
          ))}
        </div>
      )}

      {/* Regular */}
      {regular.length > 0 && (
        <div className="grid grid-cols-1 gap-2">
          {regular.map((tool) => (
            <StudioRegularCard key={tool.id} tool={tool} query={query} />
          ))}
        </div>
      )}
    </section>
  );
}
