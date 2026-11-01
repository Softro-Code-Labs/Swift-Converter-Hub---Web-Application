import { TrendingDown } from 'lucide-react';
import { GuideSection } from './Section';
import { cn } from '@/lib/utils';

interface InfoCard {
  title: string;
  desc: string;
  meta?: string;
  highlight?: string;
}

interface InfoCardGridProps {
  title: string;
  cards: InfoCard[];
  accentColor?: string;
  columns?: string;
  variant?: 'plain' | 'card';
}

export const InfoCardGrid = ({
  title,
  cards,
  columns = 'grid-cols-1 sm:grid-cols-3',
  variant = 'card',
}: InfoCardGridProps) => (
  <GuideSection title={title}>
    <ul className={cn('grid gap-3', columns)}>
      {cards.map((card) => (
        <li
          key={card.title}
          className={cn(
            variant === 'card'
              ? 'rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/30'
              : 'py-1',
          )}
        >
          <p className="text-[15px] font-semibold leading-snug text-slate-900 dark:text-white">
            {card.title}
          </p>
          {card.meta && (
            <p className="mt-0.5 text-[13px] font-medium text-slate-500 dark:text-slate-400">
              {card.meta}
            </p>
          )}
          {card.desc && (
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {card.desc}
            </p>
          )}
          {card.highlight && (
            <p className="mt-2.5 flex items-center gap-1.5 text-[13px] font-semibold text-emerald-700 dark:text-emerald-400">
              <TrendingDown className="h-4 w-4 shrink-0" aria-hidden />
              {card.highlight}
            </p>
          )}
        </li>
      ))}
    </ul>
  </GuideSection>
);
