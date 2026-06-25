'use client';

import { useState, useCallback } from 'react';
import { ClipboardPaste, Trash2, Copy, Check } from 'lucide-react';
import { useUrlParser } from '../hooks/useUrlProcessor';

interface CopyableRowProps {
  label: string;
  value: string;
  mono?: boolean;
  accent?: boolean;
}

function CopyableRow({ label, value, mono, accent }: CopyableRowProps) {
  const [copied, setCopied] = useState(false);
  if (!value) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0 group">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 w-20 shrink-0 pt-0.5">
        {label}
      </span>
      <span
        className={`flex-1 text-sm break-all leading-relaxed
        ${mono ? 'font-mono' : ''}
        ${accent ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-slate-700 dark:text-slate-300'}
      `}
      >
        {value}
      </span>
      <button
        onClick={handleCopy}
        className="opacity-0 group-hover:opacity-100 shrink-0 p-1 rounded text-slate-400 hover:text-indigo-600 transition-all"
        title="Copy"
      >
        {copied ? (
          <Check className="w-3 h-3 text-emerald-500" />
        ) : (
          <Copy className="w-3 h-3" />
        )}
      </button>
    </div>
  );
}

export function UrlParserPanel() {
  const [input, setInput] = useState('');

  const parsed = useUrlParser(input);

  const handlePaste = useCallback(async () => {
    try {
      setInput(await navigator.clipboard.readText());
    } catch {
      /* denied */
    }
  }, []);

  return (
    <div className="space-y-5">
      {/* Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            URL to parse
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePaste}
              className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <ClipboardPaste className="w-3 h-3" /> Paste
            </button>
            {input && (
              <>
                <span className="text-slate-200 dark:text-slate-700">|</span>
                <button
                  onClick={() => setInput('')}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              </>
            )}
          </div>
        </div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://example.com/path?query=hello+world&page=2#section"
          spellCheck={false}
          className={`w-full rounded-2xl border px-5 py-3.5 text-sm font-mono text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all
            ${
              parsed.error && input
                ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/10 focus:ring-red-400/30'
                : parsed.isValid
                  ? 'border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 focus:ring-indigo-400/30'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-indigo-400/30'
            }`}
        />
        {parsed.error && input && (
          <p className="text-[11px] text-red-500 font-mono px-1">
            {parsed.error}
          </p>
        )}
      </div>

      {/* Parsed components */}
      {parsed.isValid && (
        <div className="space-y-4">
          {/* Core components */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-2">
            <CopyableRow label="Protocol" value={parsed.protocol} mono accent />
            <CopyableRow label="Host" value={parsed.host} mono accent />
            <CopyableRow label="Hostname" value={parsed.hostname} mono />
            {parsed.port && (
              <CopyableRow label="Port" value={parsed.port} mono />
            )}
            <CopyableRow label="Origin" value={parsed.origin} mono />
            <CopyableRow label="Path" value={parsed.pathname} mono />
            {parsed.search && (
              <CopyableRow label="Search" value={parsed.search} mono />
            )}
            {parsed.hash && (
              <CopyableRow label="Hash" value={parsed.hash} mono />
            )}
          </div>

          {/* Query params table */}
          {parsed.params.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                <span className="w-1 h-2.5 rounded-full bg-indigo-400 inline-block" />
                Query params
                <span className="font-normal normal-case text-slate-300 dark:text-slate-600">
                  ({parsed.params.length})
                </span>
              </p>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <div className="grid grid-cols-[1fr_1fr_auto] text-[9px] font-bold uppercase tracking-widest text-slate-400 px-4 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                  <span>Key</span>
                  <span>Value</span>
                  <span />
                </div>
                {parsed.params.map(({ key, value }, i) => (
                  <ParamRow key={i} paramKey={key} paramValue={value} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {!input && (
        <div className="text-center py-10">
          <p className="text-xs text-slate-300 dark:text-slate-600">
            Paste any URL above - protocol is optional, https:// will be assumed
          </p>
        </div>
      )}
    </div>
  );
}

function ParamRow({
  paramKey,
  paramValue,
}: {
  paramKey: string;
  paramValue: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${paramKey}=${paramValue}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="grid grid-cols-[1fr_1fr_auto] items-center px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0 group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
      <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 truncate pr-2">
        {paramKey}
      </span>
      <span className="text-xs font-mono text-slate-600 dark:text-slate-400 truncate pr-2">
        {decodeURIComponent(paramValue)}
      </span>
      <button
        onClick={handleCopy}
        className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-400 hover:text-indigo-600 transition-all"
        title="Copy key=value"
      >
        {copied ? (
          <Check className="w-3 h-3 text-emerald-500" />
        ) : (
          <Copy className="w-3 h-3" />
        )}
      </button>
    </div>
  );
}
