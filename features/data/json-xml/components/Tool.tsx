'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Code,
  Copy,
  Check,
  Download,
  Trash2,
  ClipboardPaste,
  ArrowLeftRight,
  AlertCircle,
  Settings2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useJsonXml } from '../hooks/useJsonXml';
import type { ConvertDirection, JsonXmlOptions } from '../types/jsonXml';

// --- Option chip --------------------------------------------------------------

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
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
            : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-blue-300 hover:text-blue-600 bg-white dark:bg-slate-900'
        }`}
    >
      {label}
    </button>
  );
}

// --- Direction tab ------------------------------------------------------------

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
          { id: 'json-to-xml', label: 'JSON → XML' },
          { id: 'xml-to-json', label: 'XML → JSON' },
        ] as { id: ConvertDirection; label: string }[]
      ).map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all
            ${
              direction === id
                ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// --- Main component -----------------------------------------------------------

export default function JsonXmlTool() {
  const [input, setInput] = useState('');
  const [direction, setDirection] = useState<ConvertDirection>('json-to-xml');
  const [prettyXml, setPrettyXml] = useState(true);
  const [prettyJson, setPrettyJson] = useState(true);
  const [rootElement, setRootElement] = useState('root');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [attrPrefix, setAttrPrefix] = useState('@');
  const [textKey, setTextKey] = useState('#text');
  const [copiedIn, setCopiedIn] = useState(false);
  const [copiedOut, setCopiedOut] = useState(false);

  const opts: JsonXmlOptions = useMemo(
    () => ({
      direction,
      rootElement: rootElement.trim() || 'root',
      prettyXml,
      prettyJson,
      attributePrefix: attrPrefix || '@',
      textKey: textKey || '#text',
      arrayIndicator: '[]',
    }),
    [direction, rootElement, prettyXml, prettyJson, attrPrefix, textKey],
  );

  const result = useJsonXml(input, opts);

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

  const handleCopyInput = useCallback(() => {
    if (!input) return;
    navigator.clipboard.writeText(input);
    setCopiedIn(true);
    setTimeout(() => setCopiedIn(false), 1500);
  }, [input]);

  const handleDownload = useCallback(() => {
    if (!result.output) return;
    const ext = direction === 'json-to-xml' ? 'xml' : 'json';
    const mime = ext === 'xml' ? 'application/xml' : 'application/json';
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
    setDirection((d) => (d === 'json-to-xml' ? 'xml-to-json' : 'json-to-xml'));
  }, [result.output]);

  const isJsonMode = direction === 'json-to-xml';
  const isEmpty = !input.trim();

  const inputPlaceholder = isJsonMode
    ? `{\n  "person": {\n    "name": "Alice",\n    "age": 30,\n    "city": "New York"\n  }\n}`
    : `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n  <person>\n    <name>Alice</name>\n    <age>30</age>\n  </person>\n</root>`;

  const outputPlaceholder = isJsonMode
    ? `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n  ...\n</root>`
    : `{\n  "root": {\n    ...\n  }\n}`;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back nav */}
        <Link
          href="/data"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Data Studio
        </Link>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              JSON ↔ XML Converter
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Bidirectional conversion with attribute support - no server, no
              upload
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
              title="Use output as new input"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-500 hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400 cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              Swap
            </button>
          </div>

          {/* Basic options */}
          <div className="flex items-center gap-2 flex-wrap">
            {isJsonMode ? (
              <OptionChip
                label="Pretty XML"
                active={prettyXml}
                onClick={() => setPrettyXml((v) => !v)}
              />
            ) : (
              <OptionChip
                label="Pretty JSON"
                active={prettyJson}
                onClick={() => setPrettyJson((v) => !v)}
              />
            )}

            {/* Root element (JSON→XML only) */}
            {isJsonMode && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Root tag
                </span>
                <input
                  value={rootElement}
                  onChange={(e) => setRootElement(e.target.value)}
                  className="w-24 px-2 py-1 text-[10px] font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                />
              </div>
            )}

            {/* Advanced toggle */}
            <button
              onClick={() => setShowAdvanced((v) => !v)}
              className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors ml-auto"
            >
              <Settings2 className="w-3 h-3" />
              Advanced
              {showAdvanced ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          </div>

          {/* Advanced options */}
          {showAdvanced && (
            <div className="flex items-center gap-4 flex-wrap pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Attribute prefix
                </span>
                <input
                  value={attrPrefix}
                  onChange={(e) => setAttrPrefix(e.target.value)}
                  className="w-12 px-2 py-1 text-[10px] font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400/30 text-center"
                />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Text key
                </span>
                <input
                  value={textKey}
                  onChange={(e) => setTextKey(e.target.value)}
                  className="w-20 px-2 py-1 text-[10px] font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                />
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">
                In JSON, keys starting with &quot;{attrPrefix || '@'}&quot; become XML
                attributes. &quot;{textKey || '#text'}&quot; holds mixed text content.
              </p>
            </div>
          )}

          {/* Stats */}
          {result.output && !result.error && (
            <div className="flex items-center gap-3 text-[10px] text-slate-400 tabular-nums">
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                {result.nodeCount} node{result.nodeCount !== 1 ? 's' : ''}
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
                {isJsonMode ? 'JSON input' : 'XML input'}
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePaste}
                  className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                >
                  <ClipboardPaste className="w-3 h-3" /> Paste
                </button>
                {!isEmpty && (
                  <>
                    <span className="text-slate-200 dark:text-slate-700">
                      |
                    </span>
                    <button
                      onClick={handleCopyInput}
                      className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                    >
                      {copiedIn ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy
                        </>
                      )}
                    </button>
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
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={inputPlaceholder}
              spellCheck={false}
              className="w-full h-96 resize-none rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-4 text-xs font-mono text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-400/30 transition-all"
            />
            {!isEmpty && !result.error && (
              <p className="text-[10px] text-slate-400 tabular-nums">
                {input.length.toLocaleString()} chars ·{' '}
                {input.split('\n').length} lines
              </p>
            )}
          </div>

          {/* Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {isJsonMode ? 'XML output' : 'JSON output'}
              </label>
              {result.output && !result.error && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyOutput}
                    className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
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
                    className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
                  >
                    <Download className="w-3 h-3" />.
                    {isJsonMode ? 'xml' : 'json'}
                  </button>
                </div>
              )}
            </div>

            {result.error ? (
              <div className="h-96 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-5 py-4 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-red-600 dark:text-red-400">
                    Parse error
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
                className="w-full h-96 resize-none rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-950/10 px-5 py-4 text-xs font-mono text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 leading-relaxed focus:outline-none"
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

        {/* Attribute guide */}
        {showAdvanced && (
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                label: 'JSON with attributes',
                code: `{\n  "person": {\n    "@id": "1",\n    "name": "Alice"\n  }\n}`,
              },
              {
                label: 'XML output',
                code: `<root>\n  <person id="1">\n    <name>Alice</name>\n  </person>\n</root>`,
              },
            ].map(({ label, code }) => (
              <div
                key={label}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {label}
                </p>
                <pre className="text-[10px] font-mono text-slate-600 dark:text-slate-400 whitespace-pre leading-relaxed">
                  {code}
                </pre>
              </div>
            ))}
          </div>
        )}

        {/* Live indicator */}
        <div className="mt-5 flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500" />
          </span>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            Converts as you type - no server, your data never leaves this page
          </p>
        </div>
      </div>
    </main>
  );
}
