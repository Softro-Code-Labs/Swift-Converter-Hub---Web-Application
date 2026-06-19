'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

interface ConverterMarketingZoneProps {
  features: FeatureItem[];
  faqs: FaqItem[];
}

export default function ConverterMarketingZone({
  features,
  faqs,
}: ConverterMarketingZoneProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="space-y-10">
      {/* -- Feature grid ---------------------------------------------------- */}
      <section>
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-emerald-500 inline-block" />
          Why use this converter
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group flex gap-4 p-4 bg-white dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl hover:border-blue-200 dark:hover:border-blue-900/50 hover:bg-blue-50/30 dark:hover:bg-blue-950/10 transition-all duration-200"
            >
              {/* Icon with colored background */}
              <div className="shrink-0 w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-950/40 transition-colors">
                {feature.icon}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-0.5">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* -- FAQ ------------------------------------------------------------- */}
      <section>
        <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-purple-500 inline-block" />
          Frequently asked questions
        </h2>

        <div className="space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`border rounded-xl overflow-hidden transition-all duration-200
                  ${
                    isOpen
                      ? 'border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/10'
                      : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/30 hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-500' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="w-full h-px bg-blue-100 dark:bg-blue-900/40 mb-3" />
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
