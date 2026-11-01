'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { useRouter } from 'next/navigation';
import { Dialog } from 'radix-ui';
import { CornerDownLeft, FileQuestion, Search, X } from 'lucide-react';
import {
  POPULAR_TOOLS,
  TOOL_COUNT,
  TOOLS,
  getStudio,
  searchTools,
  type Tool,
} from '@/config/tools';
import { STUDIO_ACCENT } from '@/config/studio-theme';
import { cn } from '@/lib/utils';

/* ---------------------------------------------------------------------------
   Site-wide tool search. Opens with Cmd/Ctrl+K or "/" from anywhere, or from
   any element that calls openCommandMenu(). Remembers the last few tools a
   visitor opened (in this browser only) so returning visitors get there in
   one keystroke.
--------------------------------------------------------------------------- */

const OPEN_EVENT = 'sch:open-command-menu';
const RECENT_KEY = 'sch-recent-tools';

export function openCommandMenu(initialQuery = '') {
  window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: initialQuery }));
}

export function readRecentTools(): Tool[] {
  try {
    const ids: string[] = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
    return ids
      .map((id) => TOOLS.find((t) => t.id === id))
      .filter((t): t is Tool => Boolean(t));
  } catch {
    return [];
  }
}

export function rememberTool(id: string) {
  try {
    const ids: string[] = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
    const next = [id, ...ids.filter((x) => x !== id)].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* storage unavailable - recents are a convenience only */
  }
}

const emptySubscribe = () => () => {};

/** Platform-aware shortcut label, rendered only after hydration. */
export function useShortcutLabel() {
  return useSyncExternalStore(
    emptySubscribe,
    () => (/Mac|iPhone|iPad/.test(navigator.platform) ? '⌘K' : 'Ctrl K'),
    () => '',
  );
}

type Section = { label: string; items: Tool[] };

export default function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState<Tool[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  const show = useCallback((q = '') => {
    setRecent(readRecentTools());
    setQuery(q);
    setActive(0);
    setOpen(true);
  }, []);

  // Open with a query from the URL (/?q=pdf). Search engines use this for a
  // site search box, and it makes searches shareable. The parameter is
  // removed afterwards so a refresh doesn't reopen the menu.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (!q) return;
    params.delete('q');
    const rest = params.toString();
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${rest ? `?${rest}` : ''}${window.location.hash}`,
    );
    // Deferred, and deliberately not cancelled on cleanup: React's dev-mode
    // double run would otherwise drop it after the URL was already cleaned.
    window.setTimeout(() => show(q.slice(0, 80)), 0);
  }, [show]);

  // Global shortcuts + programmatic open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => {
          if (!o) {
            setRecent(readRecentTools());
            setQuery('');
            setActive(0);
          }
          return !o;
        });
      } else if (e.key === '/' && !typing && !open) {
        e.preventDefault();
        show();
      }
    };
    const onOpen = (e: Event) => show((e as CustomEvent<string>).detail ?? '');
    window.addEventListener('keydown', onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, [open, show]);

  const sections: Section[] = useMemo(() => {
    if (query.trim()) {
      const results = searchTools(query);
      return results.length
        ? [{ label: 'Tools', items: results.slice(0, 12) }]
        : [];
    }
    const out: Section[] = [];
    if (recent.length) out.push({ label: 'Recently used', items: recent });
    out.push({
      label: 'Popular',
      items: POPULAR_TOOLS.filter(
        (t) => !recent.some((r) => r.id === t.id),
      ).slice(0, 8),
    });
    return out;
  }, [query, recent]);

  const flat = useMemo(() => sections.flatMap((s) => s.items), [sections]);

  const go = useCallback(
    (tool: Tool) => {
      setOpen(false);
      router.push(tool.href);
    },
    [router],
  );

  // Keep the highlighted row in view.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (flat.length ? (i + 1) % flat.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0));
    } else if (e.key === 'Enter' && flat[active]) {
      e.preventDefault();
      go(flat[active]);
    }
  };

  let index = -1;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-slate-950/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-[8vh] z-[91] w-[calc(100%-1.5rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 outline-none dark:border-slate-700/70 dark:bg-slate-900 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.98]"
        >
          <Dialog.Title className="sr-only">Search tools</Dialog.Title>

          <div className="flex items-center gap-3 border-b border-slate-200 px-4 dark:border-slate-800">
            <Search className="h-5 w-5 shrink-0 text-slate-400" aria-hidden />
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onInputKey}
              placeholder={`Search ${TOOL_COUNT} tools - try “heic”, “merge pdf”, “json”`}
              className="h-14 w-full bg-transparent text-base text-slate-900 placeholder:text-slate-400 outline-none dark:text-white"
              role="combobox"
              aria-expanded
              aria-controls="command-menu-list"
              aria-activedescendant={
                flat[active] ? `cmd-${flat[active].id}` : undefined
              }
              aria-autocomplete="list"
            />
            <Dialog.Close
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <div
            ref={listRef}
            id="command-menu-list"
            role="listbox"
            className="max-h-[min(60vh,28rem)] overflow-y-auto p-2"
          >
            {sections.length === 0 ? (
              <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
                <FileQuestion className="h-7 w-7 text-slate-300 dark:text-slate-600" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  No tool matches “{query}”
                </p>
                <p className="max-w-xs text-sm text-slate-500 dark:text-slate-400">
                  Try a file format such as “mp4” or an action such as
                  “compress”.
                </p>
              </div>
            ) : (
              sections.map((section) => (
                <div
                  key={section.label}
                  role="group"
                  aria-label={section.label}
                  className="mb-1 last:mb-0"
                >
                  <p className="px-3 pb-1 pt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                    {section.label}
                  </p>
                  {section.items.map((tool) => {
                    index += 1;
                    const i = index;
                    const studio = getStudio(tool.studio);
                    const accent = STUDIO_ACCENT[tool.studio];
                    const Icon = tool.icon;
                    const isActive = i === active;
                    return (
                      <button
                        key={`${section.label}-${tool.id}`}
                        id={`cmd-${tool.id}`}
                        data-index={i}
                        role="option"
                        aria-selected={isActive}
                        onMouseMove={() => setActive(i)}
                        onClick={() => go(tool)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left outline-none',
                          isActive && 'bg-slate-100 dark:bg-slate-800',
                        )}
                      >
                        <span
                          className={cn(
                            'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                            accent.tile,
                          )}
                        >
                          <Icon className="h-[18px] w-[18px]" aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-slate-900 dark:text-white">
                            {tool.title}
                          </span>
                          <span className="block truncate text-[13px] text-slate-500 dark:text-slate-400">
                            {studio.name} - {tool.desc}
                          </span>
                        </span>
                        {isActive && (
                          <CornerDownLeft
                            className="h-4 w-4 shrink-0 text-slate-400"
                            aria-hidden
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          <div className="hidden items-center gap-4 border-t border-slate-200 px-4 py-2.5 text-xs text-slate-500 sm:flex dark:border-slate-800 dark:text-slate-400">
            <span>
              <Kbd>↑</Kbd> <Kbd>↓</Kbd> move
            </span>
            <span>
              <Kbd>Enter</Kbd> open
            </span>
            <span>
              <Kbd>Esc</Kbd> close
            </span>
            <span className="ml-auto">
              Tip: press <Kbd>/</Kbd> on any page to search
            </span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex min-w-5 items-center justify-center rounded border border-slate-200 bg-slate-50 px-1 font-sans text-[11px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
      {children}
    </kbd>
  );
}
