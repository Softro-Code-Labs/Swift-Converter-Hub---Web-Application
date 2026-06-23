'use client';

import { useRef, useCallback } from 'react';
import { ClipboardPaste, Trash2 } from 'lucide-react';

interface EditorPaneProps {
  value: string;
  onChange: (val: string) => void;
}

// Tab key inserts 2 spaces instead of jumping focus
function handleTab(
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  value: string,
  onChange: (v: string) => void,
) {
  if (e.key !== 'Tab') return;
  e.preventDefault();
  const el = e.currentTarget;
  const { selectionStart: s, selectionEnd: end } = el;
  const next = value.slice(0, s) + '  ' + value.slice(end);
  onChange(next);
  // Restore cursor after React re-render
  requestAnimationFrame(() => {
    el.selectionStart = s + 2;
    el.selectionEnd = s + 2;
  });
}

const PLACEHOLDER = `# Welcome to Markdown Preview

Start typing to see your document rendered live on the right.

## What's supported

- **Bold**, *italic*, ~~strikethrough~~
- [Links](https://example.com) and images
- \`inline code\` and fenced code blocks
- Tables, blockquotes, task lists
- All GitHub Flavoured Markdown (GFM)

## Example table

| Feature | Supported |
|---------|-----------|
| GFM     | ✅ Yes    |
| Tables  | ✅ Yes    |
| Math    | 🔜 Soon   |

> Your markdown never leaves this page.`;

export function EditorPane({ value, onChange }: EditorPaneProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handlePaste = useCallback(async () => {
    try {
      const t = await navigator.clipboard.readText();
      onChange(t);
    } catch {
      /* denied */
    }
  }, [onChange]);

  return (
    <div className="flex flex-col h-full">
      {/* Pane header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Markdown
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePaste}
            className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors"
          >
            <ClipboardPaste className="w-3 h-3" /> Paste
          </button>
          {value && (
            <>
              <span className="text-slate-200 dark:text-slate-700">|</span>
              <button
                onClick={() => onChange('')}
                className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            </>
          )}
        </div>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => handleTab(e, value, onChange)}
        placeholder={PLACEHOLDER}
        spellCheck={false}
        className="flex-1 w-full resize-none bg-white dark:bg-slate-900 px-5 py-4 text-sm font-mono text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 leading-relaxed focus:outline-none"
      />
    </div>
  );
}
