'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Binary,
  ChevronUp,
  ChevronDown,
  ClipboardPaste,
  Trash2,
  Copy,
  Check,
} from 'lucide-react';
import { useRegexEngine } from '../hooks/useRegexEngine';
import { FlagToggle } from './FlagToggle';
import { MatchCard } from './MatchCard';
import { RegexHighlightedText } from './RegexHighlightedText';
import type { RegexFlag, RegexFlagMeta } from '../types/regexTester';

// ─── Flag metadata ────────────────────────────────────────────────────────────

const FLAG_META: RegexFlagMeta[] = [
  { flag: 'i', label: 'Ignore case', title: 'Case-insensitive matching' },
  { flag: 'm', label: 'Multiline', title: '^ and $ match line boundaries' },
  { flag: 's', label: 'Dot all', title: '. matches newlines too' },
  { flag: 'u', label: 'Unicode', title: 'Full Unicode support' },
];

// ─── Quick reference ──────────────────────────────────────────────────────────

const QUICK_REF = [
  { token: '.', desc: 'Any character (except newline)' },
  { token: '\\d', desc: 'Digit [0-9]' },
  { token: '\\w', desc: 'Word char [a-zA-Z0-9_]' },
  { token: '\\s', desc: 'Whitespace' },
  { token: '\\b', desc: 'Word boundary' },
  { token: '^', desc: 'Start of string / line' },
  { token: '$', desc: 'End of string / line' },
  { token: '*', desc: 'Zero or more' },
  { token: '+', desc: 'One or more' },
  { token: '?', desc: 'Zero or one (optional)' },
  { token: '{n,m}', desc: 'Between n and m times' },
  { token: '(abc)', desc: 'Capture group' },
  { token: '(?:…)', desc: 'Non-capturing group' },
  { token: '(?<n>…)', desc: 'Named capture group' },
  { token: '[abc]', desc: 'Character class' },
  { token: '[^abc]', desc: 'Negated class' },
  { token: 'a|b', desc: 'Alternation (a or b)' },
  { token: '(?=…)', desc: 'Positive lookahead' },
  { token: '(?!…)', desc: 'Negative lookahead' },
];

const TEST_PLACEHOLDER = `Paste or type your test string here…

The regex engine will highlight every match in real time.
Try writing a pattern like \\b\\w{5}\\b to find 5-letter words,
or (\\d{1,3}\\.){3}\\d{1,3} to match IP addresses.`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function RegexTesterTool() {
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [activeFlags, setActiveFlags] = useState<Set<RegexFlag>>(
    new Set(['g']),
  );
  const [activeMatch, setActiveMatch] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showRef, setShowRef] = useState(false);

  const result = useRegexEngine(pattern, activeFlags, testString);

  const toggleFlag = useCallback((flag: RegexFlag) => {
    setActiveFlags((prev) => {
      const next = new Set(prev);
      // 'g' is always on - we force it internally but hide it visually
      next.has(flag) ? next.delete(flag) : next.add(flag);
      return next;
    });
  }, []);

  const goNext = useCallback(() => {
    if (!result.matchCount) return;
    setActiveMatch((p) => (p + 1) % result.matchCount);
  }, [result.matchCount]);

  const goPrev = useCallback(() => {
    if (!result.matchCount) return;
    setActiveMatch((p) => (p - 1 + result.matchCount) % result.matchCount);
  }, [result.matchCount]);

  const handlePaste = useCallback(async () => {
    try {
      setTestString(await navigator.clipboard.readText());
    } catch {
      /* denied */
    }
  }, []);

  const handleCopyPattern = useCallback(() => {
    if (!pattern) return;
    navigator.clipboard.writeText(`/${pattern}/${[...activeFlags].join('')}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [pattern, activeFlags]);

  const hasMatch = result.matchCount > 0 && !result.error;
  const isEmpty = testString.trim().length === 0;
  const hasPattern = pattern.length > 0;

  // Regex display string for the header
  const regexDisplay = useMemo(() => {
    const flags = [...activeFlags].filter((f) => f !== 'g').join('');
    return pattern ? `/${pattern}/${flags}g` : null;
  }, [pattern, activeFlags]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 selection:bg-purple-400 selection:text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back nav */}
        <Link
          href="/character"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Character Studio
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
              <Binary className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Regex Tester
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Live match highlighting, capture groups, flag controls
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowRef((v) => !v)}
            className={`shrink-0 text-[10px] font-bold px-3 py-1.5 rounded-lg border cursor-pointer transition-all
              ${
                showRef
                  ? 'border-purple-400 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:border-purple-300 hover:text-purple-600 dark:hover:text-purple-400 bg-white dark:bg-slate-900'
              }`}
          >
            {showRef ? 'Hide' : 'Quick ref'}
          </button>
        </div>

        <div
          className={`grid gap-6 ${showRef ? 'lg:grid-cols-[1fr_240px]' : 'grid-cols-1'}`}
        >
          <div className="space-y-5 min-w-0">
            {/* Pattern input card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
              {/* Pattern row */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Pattern
                </label>
                <div className="flex items-center gap-0">
                  {/* / delimiter */}
                  <span className="px-3 py-2.5 text-lg font-black text-purple-400 dark:text-purple-500 select-none shrink-0">
                    /
                  </span>
                  <input
                    value={pattern}
                    onChange={(e) => {
                      setPattern(e.target.value);
                      setActiveMatch(0);
                    }}
                    placeholder="e.g. \b\w+@\w+\.\w+\b"
                    spellCheck={false}
                    autoComplete="off"
                    className={`flex-1 py-2.5 text-sm font-mono text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 border-y placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:outline-none transition-colors
                      ${
                        result.error
                          ? 'border-red-300 dark:border-red-700 bg-red-50/30 dark:bg-red-950/10'
                          : hasMatch
                            ? 'border-purple-200 dark:border-purple-800'
                            : 'border-slate-200 dark:border-slate-700'
                      }`}
                  />
                  {/* / + flags */}
                  <span className="px-2 py-2.5 text-lg font-black text-purple-400 dark:text-purple-500 select-none shrink-0">
                    /
                  </span>
                  <span className="py-2.5 pr-3 text-sm font-mono font-bold text-purple-500 dark:text-purple-400 min-w-[2rem] select-none">
                    {[...activeFlags].filter((f) => f !== 'g').join('')}g
                  </span>

                  {/* Copy pattern */}
                  <button
                    onClick={handleCopyPattern}
                    disabled={!hasPattern}
                    title="Copy pattern"
                    className="ml-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:border-purple-300 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                {result.error && (
                  <p className="text-[11px] text-red-500 font-mono px-1">
                    {result.error}
                  </p>
                )}
              </div>

              {/* Flags row */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Flags
                </label>
                <div className="flex flex-wrap gap-2">
                  {FLAG_META.map((meta) => (
                    <FlagToggle
                      key={meta.flag}
                      meta={meta}
                      active={activeFlags.has(meta.flag)}
                      onToggle={toggleFlag}
                    />
                  ))}
                  {/* Always-on global flag indicator */}
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/20 opacity-60 cursor-default">
                    <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400">
                      g
                    </span>
                    <span className="text-[10px] font-semibold text-purple-500 hidden sm:inline">
                      Global
                    </span>
                    <span className="text-[9px] text-purple-400 hidden sm:inline">
                      (always on)
                    </span>
                  </div>
                </div>
              </div>

              {/* Match summary */}
              {hasPattern && (
                <div className="flex items-center gap-3">
                  {result.error ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600">
                      Invalid pattern
                    </span>
                  ) : result.matchCount === 0 ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                      No matches
                    </span>
                  ) : (
                    <>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300">
                        {result.matchCount}{' '}
                        {result.matchCount === 1 ? 'match' : 'matches'}
                      </span>
                      {/* Navigator */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={goPrev}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-purple-600 transition-colors"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[10px] font-bold text-slate-400 tabular-nums">
                          {activeMatch + 1} / {result.matchCount}
                        </span>
                        <button
                          onClick={goNext}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-purple-600 transition-colors"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {regexDisplay && (
                        <code className="ml-auto text-[10px] font-mono text-purple-500 dark:text-purple-400 hidden sm:inline">
                          {regexDisplay}
                        </code>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Test string + highlighted preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Test string
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePaste}
                      className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-colors"
                    >
                      <ClipboardPaste className="w-3 h-3" /> Paste
                    </button>
                    {!isEmpty && (
                      <>
                        <span className="text-slate-200 dark:text-slate-700">
                          |
                        </span>
                        <button
                          onClick={() => {
                            setTestString('');
                            setActiveMatch(0);
                          }}
                          className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-3 h-3" /> Clear
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <textarea
                  value={testString}
                  onChange={(e) => {
                    setTestString(e.target.value);
                    setActiveMatch(0);
                  }}
                  placeholder={TEST_PLACEHOLDER}
                  spellCheck={false}
                  className="w-full h-64 resize-none rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-4 text-sm font-mono text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-400/30 transition-all"
                />
                {!isEmpty && (
                  <p className="text-[10px] text-slate-400 tabular-nums">
                    {testString.length.toLocaleString()} chars ·{' '}
                    {testString.split('\n').length} lines
                  </p>
                )}
              </div>

              {/* Highlighted preview */}
              <div className="space-y-2">
                <div className="flex flex-col items-start justify-between">
                  <label className="mb-[8] text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Highlighted matches
                  </label>
                  <div className="w-full h-64 overflow-y-auto rounded-2xl border border-purple-100 dark:border-purple-900/40 bg-white dark:bg-slate-900 px-5 py-4">
                    <RegexHighlightedText
                      text={testString}
                      matches={result.matches}
                      activeMatch={activeMatch}
                      onMatchClick={setActiveMatch}
                    />
                  </div>
                  {hasMatch && (
                    <p className="text-[10px] text-slate-400 tabular-nums">
                      Click a highlight to focus that match
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Match cards */}
            {hasMatch && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Match details
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {result.matches.map((match) => (
                    <MatchCard
                      key={match.index}
                      match={match}
                      active={match.index === activeMatch}
                      onClick={() => setActiveMatch(match.index)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick reference sidebar */}
          {showRef && (
            <aside className="space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-2">
                <span className="w-1 h-2.5 rounded-full bg-purple-400 inline-block" />
                Quick reference
              </p>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                {QUICK_REF.map(({ token, desc }, i) => (
                  <button
                    key={token}
                    onClick={() => setPattern((p) => p + token)}
                    title={`Insert ${token}`}
                    className={`w-full flex items-start gap-3 px-4 py-2.5 text-left hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors group
                      ${i !== 0 ? 'border-t border-slate-100 dark:border-slate-800' : ''}`}
                  >
                    <code className="text-[11px] font-mono font-bold text-purple-600 dark:text-purple-400 shrink-0 w-16 pt-0.5 group-hover:text-purple-700">
                      {token}
                    </code>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {desc}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-slate-400 dark:text-slate-600 text-center">
                Click any token to append to pattern
              </p>
            </aside>
          )}
        </div>

        {/* Live indicator */}
        <div className="mt-6 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-500" />
          </span>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            Matches update as you type - JavaScript RegExp engine, no server
          </p>
        </div>
      </div>
    </main>
  );
}
