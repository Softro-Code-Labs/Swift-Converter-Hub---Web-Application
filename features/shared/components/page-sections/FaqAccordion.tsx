import { Plus } from 'lucide-react';
import { GuideSection } from './Section';

interface FaqItem {
  q: string;
  a: string;
}

interface FaqAccordionProps {
  title: string;
  items: FaqItem[];
  accentColor?: string;
}

/** Native <details> keeps this accessible, works without JS, and lets
 *  several answers stay open at once. */
export const FaqAccordion = ({ title, items }: FaqAccordionProps) => (
  <GuideSection
    title={title}
    aside={
      <span className="text-[13px] text-slate-500 dark:text-slate-400">
        {items.length} question{items.length !== 1 ? 's' : ''}
      </span>
    }
  >
    <div className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
      {items.map((faq, idx) => (
        <details key={idx} className="group" open={idx === 0}>
          <summary className="flex list-none items-start justify-between gap-4 py-4 text-left [&::-webkit-details-marker]:hidden">
            <span className="text-[15px] font-semibold leading-snug text-slate-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-300">
              {faq.q}
            </span>
            <Plus
              className="mt-0.5 h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-45"
              aria-hidden
            />
          </summary>
          <p className="max-w-3xl pb-5 pr-8 text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">
            {faq.a}
          </p>
        </details>
      ))}
    </div>
  </GuideSection>
);
