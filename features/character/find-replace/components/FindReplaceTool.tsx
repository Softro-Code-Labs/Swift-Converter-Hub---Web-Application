'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  RefreshCw,
  Copy,
  Check,
  Trash2,
  ClipboardPaste,
  ChevronUp,
  ChevronDown,
  Regex,
  CaseSensitive,
  WholeWord,
  Replace,
  ReplaceAll,
} from 'lucide-react';
import { useFindReplace } from '../hooks/useFindReplace';
import { HighlightedText } from './HighlightedText';
import { MatchBadge } from './MatchBadge';
import type { FindReplaceOptions } from '../types/findReplace';

const PLACEHOLDER = `Paste or type your text here…

Find & Replace scans the full text in real time. Switch to Regex mode to use patterns like \\d+ or [aeiou] - all match highlighting happens locally, nothing is sent to a server.`;

function ToggleChip({
  active,
  onClick,
  icon: Icon,
  label,
  title,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-all
        ${
          active
            ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
            : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:border-amber-300 dark:hover:border-amber-700 hover:text-amber-600 dark:hover:text-amber-400 bg-white dark:bg-slate-900'
        }`}
    >
      <Icon className="w-3 h-3" />
      {label}
    </button>
  );
}

export default function FindReplaceTool() {
  const [text, setText] = useState('');
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [activeMatch, setActiveMatch] = useState(0);
  const [copied, setCopied] = useState(false);
  const [replaced, setReplaced] = useState(false); // track if replace was applied

  const opts: FindReplaceOptions = useMemo(
    () => ({ find, replace, useRegex, caseSensitive, wholeWord }),
    [find, replace, useRegex, caseSensitive, wholeWord],
  );

  const result = useFindReplace(text, opts);

  // Navigation between matches
  const goNext = useCallback(() => {
    if (result.matchCount === 0) return;
    setActiveMatch((p) => (p + 1) % result.matchCount);
  }, [result.matchCount]);

  const goPrev = useCallback(() => {
    if (result.matchCount === 0) return;
    setActiveMatch((p) => (p - 1 + result.matchCount) % result.matchCount);
  }, [result.matchCount]);

  // Replace only the active match
  const replaceOne = useCallback(() => {
    if (result.matchCount === 0 || result.error) return;
    const { start, end } = result.matches[activeMatch];
    setText((prev) => prev.slice(0, start) + replace + prev.slice(end));
    setActiveMatch((p) => Math.min(p, result.matchCount - 2));
    setReplaced(true);
    setTimeout(() => setReplaced(false), 1000);
  }, [result, activeMatch, replace]);

  // Replace all
  const replaceAll = useCallback(() => {
    if (!result.output || result.error) return;
    setText(result.output);
    setActiveMatch(0);
    setReplaced(true);
    setTimeout(() => setReplaced(false), 1000);
  }, [result]);

  const handlePaste = useCallback(async () => {
    try {
      setText(await navigator.clipboard.readText());
    } catch {
      /* denied */
    }
  }, []);

  const handleCopy = useCallback(() => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [text]);

  const handleClear = useCallback(() => {
    setText('');
    setFind('');
    setReplace('');
    setActiveMatch(0);
  }, []);

  const isEmpty = text.trim().length === 0;
  const hasFind = find.length > 0;
  const hasMatch = result.matchCount > 0 && !result.error;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 selection:bg-amber-400 selection:text-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back nav */}
        <Link
          href="/character"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors group mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Character Studio
        </Link>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Find & Replace
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Plain text or regex - live match highlighting, instant replace
            </p>
          </div>
        </div>

        {/* Find / Replace inputs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-5 space-y-4">
          {/* Mode toggles */}
          <div className="flex items-center gap-2 flex-wrap">
            <ToggleChip
              active={useRegex}
              onClick={() => {
                setUseRegex((v) => !v);
                setWholeWord(false);
              }}
              icon={Regex}
              label="Regex"
              title="Use regular expression pattern"
            />
            <ToggleChip
              active={caseSensitive}
              onClick={() => setCaseSensitive((v) => !v)}
              icon={CaseSensitive}
              label="Case sensitive"
              title="Match exact letter case"
            />
            {!useRegex && (
              <ToggleChip
                active={wholeWord}
                onClick={() => setWholeWord((v) => !v)}
                icon={WholeWord}
                label="Whole word"
                title="Match whole words only"
              />
            )}
            <div className="ml-auto">
              <MatchBadge
                count={result.matchCount}
                error={result.error}
                hasFind={hasFind}
              />
            </div>
          </div>

          {/* Find row */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Find
            </label>
            <div className="flex gap-2">
              <input
                value={find}
                onChange={(e) => {
                  setFind(e.target.value);
                  setActiveMatch(0);
                }}
                placeholder={useRegex ? 'e.g. \\d+ or [aeiou]' : 'Search text…'}
                spellCheck={false}
                className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-mono text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all
                  ${
                    result.error
                      ? 'border-red-300 dark:border-red-700 focus:ring-red-400/30'
                      : hasMatch
                        ? 'border-amber-300 dark:border-amber-700 focus:ring-amber-400/30'
                        : 'border-slate-200 dark:border-slate-700 focus:ring-amber-400/30'
                  }`}
              />
              {/* Match navigator */}
              {hasMatch && (
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 tabular-nums w-14 text-center">
                    {activeMatch + 1} / {result.matchCount}
                  </span>
                  <button
                    onClick={goPrev}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-300 text-slate-400 hover:text-amber-600 cursor-pointer transition-all"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={goNext}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-amber-300 text-slate-400 hover:text-amber-600 cursor-pointer transition-all"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            {result.error && (
              <p className="text-[11px] text-red-500 dark:text-red-400 font-mono px-1">
                {result.error}
              </p>
            )}
          </div>

          {/* Replace row */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Replace with
            </label>
            <div className="flex gap-2">
              <input
                value={replace}
                onChange={(e) => setReplace(e.target.value)}
                placeholder={
                  useRegex ? 'e.g. $1 for capture groups' : 'Replacement text…'
                }
                spellCheck={false}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-mono text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-400/30 transition-all"
              />
              <button
                onClick={replaceOne}
                disabled={!hasMatch}
                title="Replace current match"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-500 hover:border-amber-300 hover:text-amber-600 dark:hover:border-amber-700 dark:hover:text-amber-400 cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
              >
                <Replace className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Replace</span>
              </button>
              <button
                onClick={replaceAll}
                disabled={!hasMatch}
                title="Replace all matches"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white text-xs font-bold cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
              >
                <ReplaceAll className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Replace all</span>
              </button>
            </div>
          </div>
        </div>

        {/* Text area + highlighted preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Editable input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Text
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePaste}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-colors"
                >
                  <ClipboardPaste className="w-3 h-3" /> Paste
                </button>
                <span className="text-slate-200 dark:text-slate-700">|</span>
                <button
                  onClick={handleCopy}
                  disabled={isEmpty}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <span className="text-slate-200 dark:text-slate-700">|</span>
                <button
                  onClick={handleClear}
                  disabled={isEmpty}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-red-500 cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              </div>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={PLACEHOLDER}
              spellCheck={false}
              className="w-full h-80 resize-none rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-4 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-400/30 transition-all font-mono"
            />
            {!isEmpty && (
              <p className="text-[10px] text-slate-400 tabular-nums">
                {text.length.toLocaleString()} characters
              </p>
            )}
          </div>

          {/* Live highlight preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="my-[4] text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Preview
              </label>
              {replaced && (
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Replaced
                </span>
              )}
            </div>
            <div className="w-full h-80 overflow-y-auto rounded-2xl border border-amber-100 dark:border-amber-900/40 bg-white dark:bg-slate-900 px-5 py-4">
              <HighlightedText
                text={text}
                matches={result.matches}
                activeMatch={activeMatch}
              />
            </div>
            {hasMatch && (
              <p className="text-[10px] text-slate-400 tabular-nums">
                Match {activeMatch + 1} of {result.matchCount} highlighted
              </p>
            )}
          </div>
        </div>

        {/* Live indicator */}
        <div className="mt-6 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
          </span>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            Matches highlight as you type - no internet connection needed
          </p>
        </div>
      </div>
    </main>
  );
}
