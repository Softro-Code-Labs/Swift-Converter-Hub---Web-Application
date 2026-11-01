'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  Binary,
  Copy,
  Check,
  Download,
  Trash2,
  ClipboardPaste,
  ArrowLeftRight,
  AlertCircle,
  Lock,
  Unlock,
} from 'lucide-react';
import { useBase64, looksEncoded, isJwtToken } from '../hooks/useBase64';
import { JwtInspector } from './JwtInspector';
import type { EncodeMode } from '../types/base64';

function OptionChip({
  label,
  active,
  onClick,
  title,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`px-2.5 py-1 rounded-lg border text-xs font-bold cursor-pointer transition-all
        ${
          active
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
            : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-blue-300 hover:text-blue-600 bg-white dark:bg-slate-900'
        }`}
    >
      {label}
    </button>
  );
}

function DirectionTab({
  mode,
  onChange,
}: {
  mode: EncodeMode;
  onChange: (m: EncodeMode) => void;
}) {
  return (
    <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
      {(
        [
          { id: 'encode', label: 'Encode → Base64' },
          { id: 'decode', label: 'Decode ← Base64' },
        ] as { id: EncodeMode; label: string }[]
      ).map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all
            ${
              mode === id
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// --- Quick examples -----------------------------------------------------------

const EXAMPLES = {
  encode: [
    { label: 'Hello World', value: 'Hello, World!' },
    { label: 'JSON string', value: '{"user":"alice","role":"admin"}' },
    { label: 'Unicode', value: 'こんにちは 🌍' },
    { label: 'Multiline', value: 'line one\nline two\nline three' },
  ],
  decode: [
    { label: 'Hello World', value: 'SGVsbG8sIFdvcmxkIQ==' },
    {
      label: 'Sample JWT',
      value:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    },
    { label: 'URL-safe', value: 'SGVsbG8gV29ybGQ_' },
    {
      label: 'JSON payload',
      value: 'eyJ1c2VyIjoiYWxpY2UiLCJyb2xlIjoiYWRtaW4ifQ==',
    },
  ],
};

// --- Main component -----------------------------------------------------------

export default function Base64TextTool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<EncodeMode>('encode');
  const [urlSafe, setUrlSafe] = useState(false);
  const [copiedOut, setCopiedOut] = useState(false);

  const opts = useMemo(
    () => ({
      mode,
      charset: urlSafe ? ('url-safe' as const) : ('standard' as const),
      urlSafe,
    }),
    [mode, urlSafe],
  );

  const result = useBase64(input, opts);

  const handlePaste = useCallback(async () => {
    try {
      setInput(await navigator.clipboard.readText());
    } catch {
      /* denied */
    }
  }, []);

  const handleCopy = useCallback(() => {
    if (!result.output) return;
    navigator.clipboard.writeText(result.output);
    setCopiedOut(true);
    setTimeout(() => setCopiedOut(false), 1500);
  }, [result.output]);

  const handleDownload = useCallback(() => {
    if (!result.output) return;
    const ext = mode === 'encode' ? 'txt' : 'txt';
    const blob = new Blob([result.output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `base64_${mode}d.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [result.output, mode]);

  const handleSwap = useCallback(() => {
    if (result.output) setInput(result.output);
    setMode((m) => (m === 'encode' ? 'decode' : 'encode'));
  }, [result.output]);

  const isEmpty = !input.trim();
  const isEncoding = mode === 'encode';
  const showJwt = mode === 'decode' && result.isJwt && !result.error;

  const inputPlaceholder = isEncoding
    ? `Type or paste plain text to encode…\n\nSupports Unicode, emoji, and any UTF-8 text.`
    : `Paste a Base64 string to decode…\n\nAlso supports URL-safe Base64 (- and _ instead of + and /)\nand JWT tokens - try the Sample JWT example!`;

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-5 space-y-4">
        {/* Direction + swap */}
        <div className="flex items-center gap-3 flex-wrap">
          <DirectionTab mode={mode} onChange={setMode} />
          <button
            onClick={handleSwap}
            disabled={!result.output}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-500 hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400 cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            Swap
          </button>
        </div>

        {/* Options */}
        <div className="flex items-center gap-2 flex-wrap">
          <OptionChip
            label={urlSafe ? 'URL-safe (- _)' : 'Standard (+ /)'}
            active={urlSafe}
            onClick={() => setUrlSafe((v) => !v)}
            title="URL-safe replaces + with - and / with _ for use in URLs"
          />

          {/* Stats */}
          {result.output && !result.error && (
            <div className="ml-auto flex items-center gap-3 text-xs text-slate-400 tabular-nums">
              {isEncoding ? (
                <>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">
                    {result.byteCount} bytes
                  </span>
                  <span>→</span>
                  <span>{result.charCount} chars</span>
                  <span className="text-slate-300 dark:text-slate-600">
                    (
                    {Math.round(
                      (result.charCount / Math.max(result.byteCount, 1) - 1) *
                        100,
                    )}
                    % larger)
                  </span>
                </>
              ) : (
                <>
                  <span>{input.length} chars</span>
                  <span>→</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">
                    {result.byteCount} bytes
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Quick examples */}
        <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-400">Examples</span>
          {EXAMPLES[mode].map(({ label, value }) => (
            <button
              key={label}
              onClick={() => setInput(value)}
              className={`px-2.5 py-1 rounded-lg border text-xs font-bold cursor-pointer transition-all
                  ${
                    input === value
                      ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-blue-300 hover:text-blue-600 bg-white dark:bg-slate-900'
                  }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor panes */}
      <div className="space-y-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500">
              {isEncoding ? 'Plain text' : 'Base64 string'}
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePaste}
                className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
              >
                <ClipboardPaste className="w-3 h-3" /> Paste
              </button>
              {!isEmpty && (
                <>
                  <span className="text-slate-200 dark:text-slate-700">|</span>
                  <button
                    onClick={() => setInput('')}
                    className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                </>
              )}
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={inputPlaceholder}
            spellCheck={false}
            className="w-full h-40 resize-none rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-4 text-xs font-mono text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-400/30 transition-all"
          />
        </div>

        {/* Pasted something already encoded into the encoder? Offer to decode. */}
        {mode === 'encode' && looksEncoded(input) && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100">
            <span>
              This looks like {isJwtToken(input) ? 'a JWT' : 'Base64 text'}{' '}
              already. Did you mean to decode it?
            </span>
            <button
              type="button"
              onClick={() => setMode('decode')}
              className="h-9 rounded-lg bg-blue-600 px-3.5 text-sm font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
            >
              Decode instead
            </button>
          </div>
        )}

        {/* Error */}
        {result.error && !isEmpty && (
          <div className="flex items-start gap-3 px-5 py-4 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-red-600 dark:text-red-400">
                {isEncoding ? 'Encoding error' : 'Invalid Base64'}
              </p>
              <p className="text-[13px] text-red-500 font-mono mt-0.5">
                {result.error}
              </p>
            </div>
          </div>
        )}

        {/* Output */}
        {result.output && !result.error && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500">
                {isEncoding ? 'Base64 output' : 'Decoded text'}
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                >
                  {copiedOut ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy
                    </>
                  )}
                </button>
                <span className="text-slate-200 dark:text-slate-700">|</span>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                >
                  <Download className="w-3 h-3" /> .txt
                </button>
              </div>
            </div>
            <textarea
              readOnly
              value={result.output}
              className="w-full h-40 resize-none rounded-2xl border border-rose-100 dark:border-rose-900/40 bg-slate-50 dark:bg-slate-800/40 px-5 py-4 text-xs font-mono text-slate-800 dark:text-slate-200 leading-relaxed focus:outline-none"
            />
          </div>
        )}

        {/* JWT inspector */}
        {showJwt && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center gap-2">
              <span className="w-1 h-2.5 rounded-full bg-rose-400 inline-block" />
              JWT Token Inspector
            </p>
            <JwtInspector token={input} />
          </div>
        )}
      </div>

      {/* Reference cards */}
      <div className="mt-6 grid grid-cols-1 @xl:grid-cols-3 gap-3">
        {[
          {
            icon: Lock,
            title: 'Standard Base64',
            desc: 'Uses + and / characters. Safe for files but needs encoding in URLs.',
            code: 'SGVsbG8rV29ybGQ/',
          },
          {
            icon: Unlock,
            title: 'URL-safe Base64',
            desc: 'Replaces + with - and / with _. No padding. Safe in URLs and filenames.',
            code: 'SGVsbG8tV29ybGQ_',
          },
          {
            icon: Binary,
            title: 'JWT Structure',
            desc: 'Three Base64URL parts separated by dots: header.payload.signature',
            code: 'aaaa.bbbb.cccc',
          },
        ].map(({ icon: Icon, title, desc, code }) => (
          <div
            key={title}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2"
          >
            <div className="flex items-center gap-2">
              <Icon className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <p className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                {title}
              </p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
            <code className="text-xs font-mono text-rose-600 dark:text-rose-400 break-all">
              {code}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}
