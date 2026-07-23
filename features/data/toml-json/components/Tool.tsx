'use client';

import { useState, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Package,
  Copy,
  Check,
  Download,
  Trash2,
  ClipboardPaste,
  ArrowLeftRight,
  AlertCircle,
  FileText,
  Upload,
} from 'lucide-react';
import { useTomlJson } from '../hooks/useTomlJson';
import type { ConvertDirection, TomlJsonOptions } from '../types/tomlJson';

// --- Examples -----------------------------------------------------------------

const TOML_EXAMPLE = `# Cargo.toml example
[package]
name = "my-app"
version = "0.1.0"
edition = "2021"
authors = ["Alice <alice@example.com>"]
description = "A sample Rust project"

[dependencies]
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1", features = ["full"] }
reqwest = "0.11"

[dev-dependencies]
pretty_assertions = "1.0"

[profile.release]
opt-level = 3
lto = true
strip = true`;

const JSON_EXAMPLE = `{
  "package": {
    "name": "my-app",
    "version": "0.1.0",
    "edition": "2021",
    "authors": ["Alice <alice@example.com>"],
    "description": "A sample Rust project"
  },
  "dependencies": {
    "serde": { "version": "1.0", "features": ["derive"] },
    "tokio": { "version": "1", "features": ["full"] },
    "reqwest": "0.11"
  },
  "profile": {
    "release": {
      "opt-level": 3,
      "lto": true,
      "strip": true
    }
  }
}`;

const JSON_EXAMPLES = [{ label: 'package.json', content: JSON_EXAMPLE }];

const TOML_EXAMPLES = [
  { label: 'Cargo.toml', content: TOML_EXAMPLE },
  {
    label: 'pyproject.toml',
    content: `[project]
name = "my-package"
version = "0.1.0"
description = "A Python package"
requires-python = ">=3.9"
dependencies = ["requests>=2.28", "pydantic>=2.0"]

[project.optional-dependencies]
dev = ["pytest", "black", "mypy"]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.black]
line-length = 88
target-version = ["py39", "py310", "py311"]`,
  },
  {
    label: 'config.toml',
    content: `[server]
host = "0.0.0.0"
port = 8080
workers = 4

[database]
url = "postgres://localhost/mydb"
pool_size = 10
timeout = 30

[logging]
level = "info"
format = "json"
output = "stdout"

[features]
debug_mode = false
hot_reload = true`,
  },
];

// --- Chips --------------------------------------------------------------------

function OptionChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold cursor-pointer transition-all
        ${
          active
            ? 'border-orange-400 bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300'
            : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-orange-300 hover:text-orange-600 bg-white dark:bg-slate-900'
        }`}
    >
      {label}
    </button>
  );
}

function DirectionTab({
  direction,
  onChange,
}: {
  direction: ConvertDirection;
  onChange: (d: ConvertDirection) => void;
}) {
  return (
    <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
      {(
        [
          { id: 'toml-to-json', label: 'TOML → JSON' },
          { id: 'json-to-toml', label: 'JSON → TOML' },
        ] as { id: ConvertDirection; label: string }[]
      ).map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all
            ${
              direction === id
                ? 'bg-white dark:bg-slate-700 text-orange-700 dark:text-orange-300 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// --- Main ---------------------------------------------------------------------

export default function TomlJsonTool() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState('');
  const [direction, setDirection] = useState<ConvertDirection>('toml-to-json');
  const [prettyJson, setPrettyJson] = useState(true);
  const [sortKeys, setSortKeys] = useState(false);
  const [copiedOut, setCopiedOut] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  const opts: TomlJsonOptions = useMemo(
    () => ({ direction, prettyJson, sortKeys }),
    [direction, prettyJson, sortKeys],
  );

  const result = useTomlJson(input, opts);

  const handlePaste = useCallback(async () => {
    try {
      setInput(await navigator.clipboard.readText());
    } catch {
      /* denied */
    }
  }, []);

  const handleFile = useCallback(async (f: File) => {
    const text = await f.text();
    setInput(text);
    // Auto-detect direction from file extension
    if (f.name.endsWith('.toml')) setDirection('toml-to-json');
    if (f.name.endsWith('.json')) setDirection('json-to-toml');
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) handleFile(f);
      e.target.value = '';
    },
    [handleFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLTextAreaElement>) => {
      e.preventDefault();
      const f = e.dataTransfer.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile],
  );

  const handleCopyOutput = useCallback(() => {
    if (!result.output) return;
    navigator.clipboard.writeText(result.output);
    setCopiedOut(true);
    setTimeout(() => setCopiedOut(false), 1500);
  }, [result.output]);

  const handleDownload = useCallback(() => {
    if (!result.output) return;
    const ext = direction === 'toml-to-json' ? 'json' : 'toml';
    const mime = ext === 'json' ? 'application/json' : 'text/plain';
    const blob = new Blob([result.output], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [result.output, direction]);

  const handleSwap = useCallback(() => {
    if (result.output) setInput(result.output);
    setDirection((d) =>
      d === 'toml-to-json' ? 'json-to-toml' : 'toml-to-json',
    );
  }, [result.output]);

  const isTomlMode = direction === 'toml-to-json';
  const isEmpty = !input.trim();

  const inputPlaceholder = isTomlMode
    ? `[package]\nname = "my-app"\nversion = "0.1.0"\n\n[dependencies]\nserde = "1.0"`
    : `{\n  "package": {\n    "name": "my-app",\n    "version": "0.1.0"\n  }\n}`;

  const outputPlaceholder = isTomlMode
    ? `{\n  "package": {\n    "name": "my-app"\n  }\n}`
    : `[package]\nname = "my-app"\nversion = "0.1.0"`;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back nav */}
        <Link
          href="/data"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors group mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Data Studio
        </Link>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              TOML ↔ JSON Converter
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Cargo.toml, pyproject.toml, config files - instant, private, no
              server
            </p>
          </div>
        </div>

        {/* Controls card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-5 space-y-4">
          {/* Direction + actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <DirectionTab direction={direction} onChange={setDirection} />
            <button
              onClick={handleSwap}
              disabled={!result.output}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-500 hover:border-orange-300 hover:text-orange-600 dark:hover:border-orange-700 dark:hover:text-orange-400 cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Swap
            </button>

            {/* File upload */}
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-500 hover:border-orange-300 hover:text-orange-600 dark:hover:border-orange-700 dark:hover:text-orange-400 cursor-pointer transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              Open file
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".toml,.json"
              className="hidden"
              onChange={handleFileInput}
            />

            {/* Examples dropdown */}
            <div className="relative">
                <button
                  onClick={() => setShowExamples((v) => !v)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-500 hover:border-orange-300 hover:text-orange-600 dark:hover:border-orange-700 dark:hover:text-orange-400 cursor-pointer transition-all"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Examples
                </button>
                {showExamples && (
                  <div className="absolute top-full mt-1 left-0 z-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden min-w-[180px]">
                    {(isTomlMode ? TOML_EXAMPLES : JSON_EXAMPLES).map(
                      ({ label, content }) => (
                        <button
                          key={label}
                          onClick={() => {
                            setInput(content);
                            setShowExamples(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-orange-700 dark:hover:text-orange-400 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-800 last:border-b-0"
                        >
                          {label}
                        </button>
                      ),
                    )}
                  </div>
                )}
              </div>
          </div>

          {/* Options */}
          <div className="flex items-center gap-2 flex-wrap">
            {isTomlMode ? (
              <OptionChip
                label="Pretty JSON"
                active={prettyJson}
                onClick={() => setPrettyJson((v) => !v)}
              />
            ) : null}
            <OptionChip
              label="Sort keys"
              active={sortKeys}
              onClick={() => setSortKeys((v) => !v)}
            />
          </div>

          {/* Stats */}
          {result.output && !result.error && (
            <div className="flex items-center gap-3 text-[10px] text-slate-400 tabular-nums">
              <span className="text-orange-600 dark:text-orange-400 font-bold">
                {result.keyCount} keys
              </span>
              <span>·</span>
              <span>{result.output.length.toLocaleString()} chars</span>
              <span>·</span>
              <span>{result.output.split('\n').length} lines</span>
            </div>
          )}
        </div>

        {/* Editor panes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {isTomlMode ? 'TOML input' : 'JSON input'}
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePaste}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer transition-colors"
                >
                  <ClipboardPaste className="w-3 h-3" /> Paste
                </button>
                {!isEmpty && (
                  <>
                    <span className="text-slate-200 dark:text-slate-700">
                      |
                    </span>
                    <button
                      onClick={() => setInput('')}
                      className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3 h-3" /> Clear
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                placeholder={inputPlaceholder}
                spellCheck={false}
                className={`w-full h-96 resize-none rounded-2xl border px-5 py-4 text-xs font-mono text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 leading-relaxed focus:outline-none transition-all
                  ${
                    result.errorLine
                      ? 'border-red-300 dark:border-red-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-red-400/30'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-orange-400/30'
                  }`}
              />
              {result.errorLine && (
                <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-red-100 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle className="w-3 h-3 text-red-500" />
                  <span className="text-[10px] font-bold text-red-600 dark:text-red-400">
                    Line {result.errorLine}
                  </span>
                </div>
              )}
              {/* Drop hint */}
              {isEmpty && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] text-slate-300 dark:text-slate-600 pointer-events-none whitespace-nowrap">
                  or drop a .{isTomlMode ? 'toml' : 'json'} file here
                </div>
              )}
            </div>
            {!isEmpty && (
              <p className="text-[10px] text-slate-400 tabular-nums">
                {input.length.toLocaleString()} chars ·{' '}
                {input.split('\n').length} lines
                {result.errorLine && (
                  <span className="text-red-500 ml-2">
                    · Error on line {result.errorLine}
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {isTomlMode ? 'JSON output' : 'TOML output'}
              </label>
              {result.output && !result.error && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyOutput}
                    className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer transition-colors"
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
                    className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer transition-colors"
                  >
                    <Download className="w-3 h-3" />.
                    {isTomlMode ? 'json' : 'toml'}
                  </button>
                </div>
              )}
            </div>

            {result.error ? (
              <div className="h-96 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-5 py-4 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-red-600 dark:text-red-400">
                    {isTomlMode ? 'TOML parse error' : 'JSON parse error'}
                    {result.errorLine && ` - line ${result.errorLine}`}
                  </p>
                  <p className="text-[11px] text-red-500 font-mono leading-relaxed">
                    {result.error}
                  </p>
                </div>
              </div>
            ) : (
              <textarea
                readOnly
                value={result.output}
                placeholder={outputPlaceholder}
                className="w-full h-96 resize-none rounded-2xl border border-orange-100 dark:border-orange-900/40 bg-orange-50/30 dark:bg-orange-950/10 px-5 py-4 text-xs font-mono text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 leading-relaxed focus:outline-none"
              />
            )}
            {result.output && !result.error && (
              <p className="text-[10px] text-slate-400 tabular-nums">
                {result.output.length.toLocaleString()} chars ·{' '}
                {result.output.split('\n').length} lines
              </p>
            )}
          </div>
        </div>

        {/* TOML type info strip */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { type: 'String', toml: '"hello"', json: '"hello"' },
            { type: 'Integer', toml: 'count = 42', json: '42' },
            { type: 'Float', toml: 'ratio = 3.14', json: '3.14' },
            { type: 'Boolean', toml: 'enabled = true', json: 'true' },
            {
              type: 'Datetime',
              toml: '2024-01-15T00:00Z',
              json: '"2024-01-15T…"',
            },
            { type: 'Array', toml: '[1, 2, 3]', json: '[1, 2, 3]' },
            { type: 'Table', toml: '[section]', json: '{ }' },
            { type: 'Inline', toml: '{a = 1}', json: '{"a": 1}' },
          ].map(({ type, toml, json }) => (
            <div
              key={type}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-1.5"
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500 dark:text-orange-400">
                {type}
              </p>
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                TOML:{' '}
                <span className="text-slate-700 dark:text-slate-300">
                  {toml}
                </span>
              </p>
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                JSON:{' '}
                <span className="text-slate-700 dark:text-slate-300">
                  {json}
                </span>
              </p>
            </div>
          ))}
        </div>

        {/* JSON→TOML constraint note */}
        {!isTomlMode && (
          <div className="mt-4 flex items-start gap-2 px-4 py-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40 rounded-xl">
            <Package className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-orange-700 dark:text-orange-400 font-semibold">
              TOML requires a top-level object - JSON arrays and bare primitives
              cannot be converted. Nested arrays of objects become TOML{' '}
              <code className="font-mono bg-orange-100 dark:bg-orange-900/40 px-1 rounded">
                [[table arrays]]
              </code>
              .
            </p>
          </div>
        )}

        {/* Live indicator */}
        <div className="mt-5 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500" />
          </span>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            Converts as you type - no server, your data never leaves this page
          </p>
        </div>
      </div>
    </main>
  );
}
