'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const STORAGE_KEY = 'swiftconverterhub-home-tour-seen';
const START_DELAY_MS = 700;
const CARD_WIDTH = 288;
const SPOTLIGHT_PADDING = 8;
const CARD_GAP = 14;
const VIEWPORT_MARGIN = 16;

type Placement = 'bottom' | 'bottom-end';

interface TourStep {
  target: string;
  title: string;
  description: string;
  placement: Placement;
}

const STEPS: TourStep[] = [
  {
    target: '[data-tour="drop-zone"]',
    title: 'Start here',
    description:
      "Drop any file, or click to browse. We'll show you exactly which tools work with it.",
    placement: 'bottom',
  },
  {
    target: '[data-tour="studios-nav"]',
    title: 'Browse by studio',
    description:
      'Prefer to explore? Studios groups every tool by file type - image, audio, video, and more.',
    placement: 'bottom',
  },
  {
    target: '[data-tour="theme-toggle"]',
    title: 'Light or dark',
    description: 'Switch the whole site between light and dark mode anytime.',
    placement: 'bottom-end',
  },
];

// Picks the first matching element that's actually rendered/visible, since
// some targets (e.g. the theme toggle) exist twice in the DOM at once - a
// desktop copy and a mobile copy - with only one shown at a given viewport.
function getVisibleTarget(selector: string): HTMLElement | null {
  const els = document.querySelectorAll<HTMLElement>(selector);
  for (const el of els) {
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) return el;
  }
  return null;
}

function getCardPosition(rect: DOMRect, placement: Placement) {
  const top = rect.bottom + SPOTLIGHT_PADDING + CARD_GAP;
  const rawLeft =
    placement === 'bottom-end'
      ? rect.right - CARD_WIDTH
      : rect.left + rect.width / 2 - CARD_WIDTH / 2;
  const left = Math.max(
    VIEWPORT_MARGIN,
    Math.min(rawLeft, window.innerWidth - CARD_WIDTH - VIEWPORT_MARGIN),
  );
  return { top, left };
}

export default function HomeTour() {
  const [stepIndex, setStepIndex] = useState(0);
  const [active, setActive] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);

  // Only auto-start once per browser, and only if a previous visit hasn't
  // already dismissed it.
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') return;
    } catch {
      return;
    }
    const timer = setTimeout(() => setActive(true), START_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  // Resolves the current step's target and keeps its position in sync.
  // Steps whose target isn't present/visible on this viewport (e.g. the
  // desktop-only Studios button on a phone) are skipped automatically.
  useEffect(() => {
    if (!active) return;

    const step = STEPS[stepIndex];
    if (!step) {
      finish();
      return;
    }

    const el = getVisibleTarget(step.target);
    if (!el) {
      setStepIndex((i) => i + 1);
      return;
    }

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    const updateRect = () => {
      const current = getVisibleTarget(step.target);
      setRect(current ? current.getBoundingClientRect() : null);
    };
    updateRect();

    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, stepIndex]);

  const finish = () => {
    setActive(false);
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // Private browsing etc. - the tour just replays next visit, harmless.
    }
  };

  if (!active || !rect) return null;

  const step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;
  const { top, left } = getCardPosition(rect, step.placement);

  return createPortal(
    <>
      {/* Spotlight - dims everything except the target's box. Never
          intercepts clicks, so the highlighted element stays fully usable. */}
      <div
        className="fixed z-[100] pointer-events-none rounded-2xl transition-all duration-300 ease-out"
        style={{
          top: rect.top - SPOTLIGHT_PADDING,
          left: rect.left - SPOTLIGHT_PADDING,
          width: rect.width + SPOTLIGHT_PADDING * 2,
          height: rect.height + SPOTLIGHT_PADDING * 2,
          boxShadow:
            '0 0 0 2px rgba(37,99,235,0.7), 0 0 0 6px rgba(37,99,235,0.15), 0 0 0 9999px rgba(15,23,42,0.65)',
        }}
      />

      {/* Tooltip card */}
      <div
        className="fixed z-[101] w-72 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-4 transition-all duration-300 ease-out"
        style={{ top, left }}
        role="dialog"
        aria-label={step.title}
      >
        <button
          onClick={finish}
          aria-label="Skip tour"
          className="absolute top-3 right-3 text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <p className="text-sm font-bold text-slate-900 dark:text-white pr-5">
          {step.title}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1.5">
          {step.description}
        </p>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => (
              <span
                key={s.target}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === stepIndex
                    ? 'w-4 bg-blue-600'
                    : 'w-1.5 bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            {stepIndex > 0 && (
              <button
                onClick={() => setStepIndex((i) => i - 1)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                Back
              </button>
            )}
            <button
              onClick={() => (isLast ? finish() : setStepIndex((i) => i + 1))}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold rounded-lg transition-all shadow-sm shadow-blue-500/20 cursor-pointer"
            >
              {isLast ? 'Got it' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
