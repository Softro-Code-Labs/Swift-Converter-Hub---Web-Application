'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Fingerprint,
  ClipboardPaste,
  Trash2,
  Upload,
  CaseSensitive,
  KeyRound,
  X,
} from 'lucide-react';
import { useHashGenerator } from '../hooks/useHashGenerator';
import { HashCard } from './HashCard';
import type { InputMode, HashOptions } from '../types/hashGenerator';

export default function HashGeneratorTool() {
  const [inputMode, setInputMode] = useState<InputMode>('text');
  const [text, setText] = useState('');
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [fileName, setFileName] = useState('');
  const [hmac, setHmac] = useState(false);
  const [hmacKey, setHmacKey] = useState('');
  const [uppercase, setUppercase] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const opts: HashOptions = useMemo(
    () => ({ hmac, hmacKey, uppercase }),
    [hmac, hmacKey, uppercase],
  );

  // Pass the right input to the hook
  const input: string | ArrayBuffer | null =
    inputMode === 'file' ? fileBuffer : text;

  const results = useHashGenerator(input, opts);

  const handlePaste = useCallback(async () => {
    try {
      setText(await navigator.clipboard.readText());
    } catch {
      /* denied */
    }
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (!f) return;
      setFileName(f.name);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const buf = ev.target?.result;
        if (buf instanceof ArrayBuffer) setFileBuffer(buf);
      };
      reader.readAsArrayBuffer(f);
      e.target.value = '';
    },
    [],
  );

  const handleClear = useCallback(() => {
    setText('');
    setFileBuffer(null);
    setFileName('');
  }, []);

  const hasInput = inputMode === 'text' ? text.length > 0 : fileBuffer !== null;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 selection:bg-red-400 selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back nav */}
        <Link
          href="/character"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors group mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Character Studio
        </Link>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Hash Generator
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              MD5, SHA-1, SHA-256, SHA-512 - text or file, with optional HMAC
            </p>
          </div>
        </div>

        {/* Input card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-5 space-y-4">
          {/* Input mode tabs */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              {(['text', 'file'] as InputMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    setInputMode(m);
                    handleClear();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold capitalize cursor-pointer transition-all
                    ${
                      inputMode === m
                        ? 'bg-white dark:bg-slate-700 text-red-700 dark:text-red-300 shadow-sm'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                    }`}
                >
                  {m === 'file' ? <Upload className="w-3 h-3" /> : null}
                  {m === 'text' ? 'Text input' : 'File input'}
                </button>
              ))}
            </div>

            {/* HMAC toggle */}
            <button
              onClick={() => setHmac((v) => !v)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-all
                ${
                  hmac
                    ? 'border-red-400 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:border-red-300 hover:text-red-600 bg-white dark:bg-slate-900'
                }`}
            >
              <KeyRound className="w-3 h-3" />
              HMAC
            </button>

            {/* Uppercase toggle */}
            <button
              onClick={() => setUppercase((v) => !v)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-all
                ${
                  uppercase
                    ? 'border-red-400 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:border-red-300 hover:text-red-600 bg-white dark:bg-slate-900'
                }`}
            >
              <CaseSensitive className="w-3 h-3" />
              Uppercase
            </button>

            {hasInput && (
              <button
                onClick={handleClear}
                className="ml-auto flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Clear
              </button>
            )}
          </div>

          {/* HMAC key input */}
          {hmac && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                HMAC Secret Key
              </label>
              <div className="relative">
                <input
                  value={hmacKey}
                  onChange={(e) => setHmacKey(e.target.value)}
                  placeholder="Enter your secret key… (defaults to 'secret' if empty)"
                  type="text"
                  spellCheck={false}
                  className="w-full rounded-xl border border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-950/10 px-4 py-2.5 pr-8 text-sm font-mono text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-red-400/30 transition-all"
                />
                {hmacKey && (
                  <button
                    onClick={() => setHmacKey('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 cursor-pointer transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-[10px] text-slate-400 px-1">
                HMAC is not supported for MD5 - that card will show a plain MD5
                hash
              </p>
            </div>
          )}

          {/* Text input */}
          {inputMode === 'text' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Input text
                </label>
                <button
                  onClick={handlePaste}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-red-600 dark:hover:text-red-400 cursor-pointer transition-colors"
                >
                  <ClipboardPaste className="w-3 h-3" /> Paste
                </button>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste text to hash…"
                spellCheck={false}
                rows={5}
                className="w-full resize-none rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-5 py-4 text-sm font-mono text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 leading-relaxed focus:outline-none focus:ring-2 focus:ring-red-400/30 transition-all"
              />
              {text && (
                <p className="text-[10px] text-slate-400 tabular-nums">
                  {text.length.toLocaleString()} characters ·{' '}
                  {new TextEncoder().encode(text).length.toLocaleString()} bytes
                </p>
              )}
            </div>
          )}

          {/* File input */}
          {inputMode === 'file' && (
            <div>
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              {!fileBuffer ? (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center gap-3 py-12 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-700 hover:bg-red-50/30 dark:hover:bg-red-950/10 transition-all cursor-pointer"
                >
                  <Upload className="w-7 h-7 text-slate-300 dark:text-slate-600" />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                      Click to select a file
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      Any file type - hashed entirely in your browser
                    </p>
                  </div>
                </button>
              ) : (
                <div className="flex items-center justify-between p-4 rounded-2xl border border-red-100 dark:border-red-900/40 bg-red-50/30 dark:bg-red-950/10">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 dark:bg-red-950/50 text-red-500">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[240px]">
                        {fileName}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {(fileBuffer.byteLength / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="text-[10px] font-bold text-slate-400 hover:text-red-600 cursor-pointer transition-colors"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hash results */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
            <span className="w-1 h-2.5 rounded-full bg-red-400 inline-block" />
            Hash outputs
          </p>
          <div className="space-y-3">
            {results.map((result) => (
              <HashCard key={result.algorithm} result={result} />
            ))}
          </div>
        </div>

        {/* Live indicator */}
        <div className="mt-6 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
          </span>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            Hashes computed locally - your text and files never leave this page
          </p>
        </div>
      </div>
    </main>
  );
}
