'use client';

import { useRef, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { BASE_INFO } from '../types/numberBase';
import type { Base } from '../types/numberBase';

interface BaseInputProps {
  base: Base;
  value: string; // display value (may be grouped)
  rawValue: string; // ungrouped, for editing
  isActive: boolean;
  isError: boolean;
  onChange: (raw: string, base: Base) => void;
  onFocus: (base: Base) => void;
}

export function BaseInput({
  base,
  value,
  rawValue,
  isActive,
  isError,
  onChange,
  onFocus,
}: BaseInputProps) {
  const info = BASE_INFO[base];
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const plain = value.replace(/\s/g, '');
    if (!plain) return;
    navigator.clipboard.writeText(plain);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Strip spaces/underscores the user may type for readability
    const raw = e.target.value.replace(/[\s_]/g, '');
    onChange(raw, base);
  };

  return (
    <div
      className={`group rounded-2xl border-2 bg-white dark:bg-slate-900 transition-all duration-150 overflow-hidden
      ${
        isError
          ? 'border-red-300 dark:border-red-700'
          : isActive
            ? info.color.border
            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-2.5 border-b
        ${
          isActive
            ? 'border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40'
            : 'border-slate-100 dark:border-slate-800'
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-black tracking-wide
            ${isActive ? info.color.label : 'text-slate-500 dark:text-slate-400'}`}
          >
            {info.label}
          </span>
          {info.prefix && (
            <span
              className={`text-[10px] font-bold font-mono
              ${isActive ? info.color.prefix : 'text-slate-300 dark:text-slate-600'}`}
            >
              {info.prefix}
            </span>
          )}
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md
            ${
              isActive
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
            }`}
          >
            base {base}
          </span>
        </div>
        <button
          onClick={handleCopy}
          disabled={!value}
          className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer transition-all disabled:cursor-not-allowed"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-500" /> Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" /> Copy
            </>
          )}
        </button>
      </div>

      {/* Input */}
      <div className="px-4 py-3">
        <input
          ref={inputRef}
          value={isActive ? rawValue : value}
          onChange={handleChange}
          onFocus={() => onFocus(base)}
          placeholder={info.placeholder}
          spellCheck={false}
          autoComplete="off"
          className={`w-full bg-transparent text-lg font-mono font-bold tracking-wider outline-none placeholder:text-slate-200 dark:placeholder:text-slate-700 transition-colors
            ${
              isError
                ? 'text-red-500'
                : isActive
                  ? info.color.label
                  : 'text-slate-700 dark:text-slate-300'
            }`}
        />
      </div>
    </div>
  );
}
