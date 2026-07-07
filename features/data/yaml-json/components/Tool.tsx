'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Braces,
  Copy,
  Check,
  Download,
  Trash2,
  ClipboardPaste,
  ArrowLeftRight,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useYamlJson } from '../hooks/useYamlJson';
import type { ConvertDirection, YamlJsonOptions } from '../types/yamlJson';

// --- Small reusable chips -----------------------------------------------------

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
            ? 'border-purple-400 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
            : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-purple-300 hover:text-purple-600 bg-white dark:bg-slate-900'
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
          { id: 'yaml-to-json', label: 'YAML → JSON' },
          { id: 'json-to-yaml', label: 'JSON → YAML' },
        ] as { id: ConvertDirection; label: string }[]
      ).map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all
            ${
              direction === id
                ? 'bg-white dark:bg-slate-700 text-purple-700 dark:text-purple-300 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// --- Textarea with line error highlight ---------------------------------------

function MonoEditor({
  value,
  onChange,
  placeholder,
  errorLine,
  accentClass,
  readOnly = false,
}: {
  value: string;
  onChange?: (v: string) => void;
  placeholder: string;
  errorLine?: number | null;
  accentClass: string;
  readOnly?: boolean;
}) {
  return (
    <div className="relative">
      <textarea
        readOnly={readOnly}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        spellCheck={false}
        className={`w-full h-96 resize-none rounded-2xl border px-5 py-4 text-xs font-mono text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 leading-relaxed focus:outline-none transition-all
          ${
            errorLine
              ? 'border-red-300 dark:border-red-800 focus:ring-2 focus:ring-red-400/30'
              : readOnly
                ? accentClass
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-purple-400/30'
          }`}
      />
      {errorLine && (
        <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-red-100 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="w-3 h-3 text-red-500" />
          <span className="text-[10px] font-bold text-red-600 dark:text-red-400">
            Line {errorLine}
          </span>
        </div>
      )}
    </div>
  );
}

// --- Quick examples -----------------------------------------------------------

const YAML_EXAMPLE = `# Kubernetes deployment config
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-app
          image: my-app:latest
          ports:
            - containerPort: 8080
          env:
            - name: NODE_ENV
              value: production`;

const JSON_EXAMPLE = `{
  "apiVersion": "apps/v1",
  "kind": "Deployment",
  "metadata": {
    "name": "my-app",
    "labels": { "app": "my-app" }
  },
  "spec": {
    "replicas": 3,
    "selector": {
      "matchLabels": { "app": "my-app" }
    }
  }
}`;

// --- Main component -----------------------------------------------------------

export default function YamlJsonTool() {
  const [input, setInput] = useState('');
  const [direction, setDirection] = useState<ConvertDirection>('yaml-to-json');
  const [prettyJson, setPrettyJson] = useState(true);
  const [yamlIndent, setYamlIndent] = useState(2);
  const [lineWidth, setLineWidth] = useState(120);
  const [sortKeys, setSortKeys] = useState(false);
  const [multiDoc, setMultiDoc] = useState(false);
  const [copiedOut, setCopiedOut] = useState(false);

  const opts: YamlJsonOptions = useMemo(
    () => ({
      direction,
      prettyJson,
      yamlIndent,
      lineWidth,
      sortKeys,
      multiDoc,
    }),
    [direction, prettyJson, yamlIndent, lineWidth, sortKeys, multiDoc],
  );

  const result = useYamlJson(input, opts);

  const handlePaste = useCallback(async () => {
    try {
      setInput(await navigator.clipboard.readText());
    } catch {
      /* denied */
    }
  }, []);

  const handleCopyOutput = useCallback(() => {
    if (!result.output) return;
    navigator.clipboard.writeText(result.output);
    setCopiedOut(true);
    setTimeout(() => setCopiedOut(false), 1500);
  }, [result.output]);

  const handleDownload = useCallback(() => {
    if (!result.output) return;
    const ext = direction === 'yaml-to-json' ? 'json' : 'yaml';
    const mime = ext === 'json' ? 'application/json' : 'text/yaml';
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
      d === 'yaml-to-json' ? 'json-to-yaml' : 'yaml-to-json',
    );
  }, [result.output]);

  const loadExample = useCallback(() => {
    setInput(direction === 'yaml-to-json' ? YAML_EXAMPLE : JSON_EXAMPLE);
  }, [direction]);

  const isYamlMode = direction === 'yaml-to-json';
  const isEmpty = !input.trim();

  const inputPlaceholder = isYamlMode
    ? `# Paste your YAML here\nname: Alice\nage: 30\ncity: New York`
    : `{\n  "name": "Alice",\n  "age": 30,\n  "city": "New York"\n}`;

  const outputPlaceholder = isYamlMode
    ? `{\n  "name": "Alice",\n  "age": 30\n}`
    : `name: Alice\nage: 30\ncity: New York`;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back nav */}
        <Link
          href="/data"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Data Studio
        </Link>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
            <Braces className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              YAML ↔ JSON Converter
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Configs, CI pipelines, Kubernetes manifests - instant, private, no
              server
            </p>
          </div>
        </div>

        {/* Controls card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-5 space-y-4">
          {/* Direction + swap */}
          <div className="flex items-center gap-3 flex-wrap">
            <DirectionTab direction={direction} onChange={setDirection} />
            <button
              onClick={handleSwap}
              disabled={!result.output}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-500 hover:border-purple-300 hover:text-purple-600 dark:hover:border-purple-700 dark:hover:text-purple-400 cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Swap
            </button>
            <button
              onClick={loadExample}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-500 hover:border-purple-300 hover:text-purple-600 dark:hover:border-purple-700 dark:hover:text-purple-400 cursor-pointer transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              Load example
            </button>
          </div>

          {/* Options */}
          <div className="flex items-center gap-2 flex-wrap">
            {isYamlMode ? (
              <OptionChip
                label="Pretty JSON"
                active={prettyJson}
                onClick={() => setPrettyJson((v) => !v)}
              />
            ) : (
              <>
                {/* YAML indent */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Indent
                  </span>
                  {[2, 4].map((n) => (
                    <OptionChip
                      key={n}
                      label={`${n}`}
                      active={yamlIndent === n}
                      onClick={() => setYamlIndent(n)}
                    />
                  ))}
                </div>

                <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

                {/* Line width */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Line width
                  </span>
                  {[80, 120, -1].map((n) => (
                    <OptionChip
                      key={n}
                      label={n === -1 ? 'None' : `${n}`}
                      active={lineWidth === n}
                      onClick={() => setLineWidth(n)}
                    />
                  ))}
                </div>
              </>
            )}

            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

            <OptionChip
              label="Sort keys"
              active={sortKeys}
              onClick={() => setSortKeys((v) => !v)}
            />
            <OptionChip
              label="Multi-document"
              active={multiDoc}
              onClick={() => setMultiDoc((v) => !v)}
            />
          </div>

          {/* Stats */}
          {result.output && !result.error && (
            <div className="flex items-center gap-3 text-[10px] text-slate-400 tabular-nums flex-wrap">
              {result.docCount > 1 && (
                <>
                  <span className="text-purple-600 dark:text-purple-400 font-bold flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {result.docCount} documents
                  </span>
                  <span>·</span>
                </>
              )}
              <span className="text-purple-600 dark:text-purple-400 font-bold">
                {result.keyCount} keys
              </span>
              <span>·</span>
              <span>{result.output.length.toLocaleString()} chars</span>
            </div>
          )}
        </div>

        {/* Editor panes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {isYamlMode ? 'YAML input' : 'JSON input'}
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
                      onClick={() => setInput('')}
                      className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-red-500 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3 h-3" /> Clear
                    </button>
                  </>
                )}
              </div>
            </div>
            <MonoEditor
              value={input}
              onChange={setInput}
              placeholder={inputPlaceholder}
              errorLine={result.errorLine}
              accentClass=""
            />
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
                {isYamlMode ? 'JSON output' : 'YAML output'}
              </label>
              {result.output && !result.error && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyOutput}
                    className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-colors"
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
                    className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer transition-colors"
                  >
                    <Download className="w-3 h-3" />.
                    {isYamlMode ? 'json' : 'yaml'}
                  </button>
                </div>
              )}
            </div>

            {result.error ? (
              <div className="h-96 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-5 py-4 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-red-600 dark:text-red-400">
                    {isYamlMode ? 'YAML parse error' : 'JSON parse error'}
                    {result.errorLine && ` - line ${result.errorLine}`}
                  </p>
                  <p className="text-[11px] text-red-500 font-mono leading-relaxed">
                    {result.error}
                  </p>
                </div>
              </div>
            ) : (
              <MonoEditor
                value={result.output}
                placeholder={outputPlaceholder}
                accentClass="border-purple-100 dark:border-purple-900/40 bg-purple-50/30 dark:bg-purple-950/10"
                readOnly
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

        {/* Multi-doc note */}
        {multiDoc && (
          <div className="mt-4 flex items-start gap-2 px-4 py-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 rounded-xl">
            <FileText className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-purple-700 dark:text-purple-400 font-semibold">
              Multi-document mode - YAML documents separated by{' '}
              <code className="font-mono bg-purple-100 dark:bg-purple-900/40 px-1 rounded">
                ---
              </code>{' '}
              are converted to a JSON array. JSON arrays convert to separate
              YAML documents.
            </p>
          </div>
        )}

        {/* Live indicator */}
        <div className="mt-5 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-500" />
          </span>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            Converts as you type - no server, your data never leaves this page
          </p>
        </div>
      </div>
    </main>
  );
}
