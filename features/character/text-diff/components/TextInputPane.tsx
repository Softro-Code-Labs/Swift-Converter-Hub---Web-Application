'use client';

import { useCallback } from 'react';
import { ClipboardPaste, Trash2 } from 'lucide-react';

interface TextInputPaneProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}

export function TextInputPane({
  label,
  value,
  onChange,
  placeholder,
}: TextInputPaneProps) {
  const handlePaste = useCallback(async () => {
    try {
      onChange(await navigator.clipboard.readText());
    } catch {
      /* denied */
    }
  }, [onChange]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePaste}
            className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer transition-colors"
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
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        className="flex-1 w-full resize-none bg-white dark:bg-slate-900 px-4 py-3 text-xs font-mono text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 leading-relaxed focus:outline-none"
      />
    </div>
  );
}
