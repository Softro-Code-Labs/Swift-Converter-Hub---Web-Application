'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  Copy,
  Check,
  Download,
  Trash2,
  ClipboardPaste,
  ArrowLeftRight,
  AlertCircle,
} from 'lucide-react';
import { useCsvJson } from '../hooks/useCsvJson';
import { CsvPreviewTable } from './CsvPreviewTable';
import type {
  ConvertDirection,
  Delimiter,
  CsvJsonOptions,
} from '../types/csvJson';
import { DELIMITER_OPTIONS } from '../types/csvJson';

// --- Option toggle chip -------------------------------------------------------

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
          { id: 'csv-to-json', label: 'CSV → JSON' },
          { id: 'json-to-csv', label: 'JSON → CSV' },
        ] as { id: ConvertDirection; label: string }[]
      ).map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all
            ${
              direction === id
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

// --- Main component -----------------------------------------------------------

export default function CsvJsonTool() {
  const [input, setInput] = useState('');
  const [direction, setDirection] = useState<ConvertDirection>('csv-to-json');
  const [delimiter, setDelimiter] = useState<Delimiter>(',');
  const [hasHeader, setHasHeader] = useState(true);
  const [prettyJson, setPrettyJson] = useState(true);
  const [copiedIn, setCopiedIn] = useState(false);
  const [copiedOut, setCopiedOut] = useState(false);

  const opts: CsvJsonOptions = useMemo(
    () => ({ direction, delimiter, hasHeader, prettyJson, arrayOutput: true }),
    [direction, delimiter, hasHeader, prettyJson],
  );

  const result = useCsvJson(input, opts);

  const handlePaste = useCallback(async () => {
    try {
      setInput(await navigator.clipboard.readText());
    } catch {
      /* denied */
    }
  }, []);

  const handleCopyInput = useCallback(() => {
    navigator.clipboard.writeText(input);
    setCopiedIn(true);
    setTimeout(() => setCopiedIn(false), 1500);
  }, [input]);

  const handleCopyOutput = useCallback(() => {
    if (!result.output) return;
    navigator.clipboard.writeText(result.output);
    setCopiedOut(true);
    setTimeout(() => setCopiedOut(false), 1500);
  }, [result.output]);

  const handleDownload = useCallback(() => {
    if (!result.output) return;
    const ext = direction === 'csv-to-json' ? 'json' : 'csv';
    const mime = ext === 'json' ? 'application/json' : 'text/csv';
    const blob = new Blob([result.output], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [result.output, direction]);

  const handleSwap = useCallback(() => {
    // Put the output back as input and flip direction
    if (result.output) setInput(result.output);
    setDirection((d) => (d === 'csv-to-json' ? 'json-to-csv' : 'csv-to-json'));
  }, [result.output]);

  const isCsvMode = direction === 'csv-to-json';
  const inputLabel = isCsvMode ? 'CSV input' : 'JSON input';
  const outputLabel = isCsvMode ? 'JSON output' : 'CSV output';
  const inputPlaceholder = isCsvMode
    ? `name,age,city\nAlice,30,New York\nBob,25,London`
    : `[\n  { "name": "Alice", "age": 30, "city": "New York" },\n  { "name": "Bob", "age": 25, "city": "London" }\n]`;

  const isEmpty = !input.trim();

  return (
    <div className="space-y-5">
      {/* Controls card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-5 space-y-4">
        {/* Direction + swap */}
        <div className="flex items-center gap-3 flex-wrap">
          <DirectionTab direction={direction} onChange={setDirection} />
          <button
            onClick={handleSwap}
            disabled={!result.output}
            title="Swap - use output as new input"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-500 hover:border-blue-300 hover:text-blue-600 dark:hover:border-blue-700 dark:hover:text-blue-400 cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            Swap
          </button>
        </div>

        {/* Options row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Delimiter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400">Delimiter</span>
            <div className="flex gap-1">
              {DELIMITER_OPTIONS.map(({ value, label }) => (
                <OptionChip
                  key={value}
                  label={label}
                  active={delimiter === value}
                  onClick={() => setDelimiter(value)}
                />
              ))}
            </div>
          </div>

          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Header row toggle */}
          <OptionChip
            label="Header row"
            active={hasHeader}
            onClick={() => setHasHeader((v) => !v)}
          />

          {/* Pretty JSON toggle (only in csv→json) */}
          {isCsvMode && (
            <OptionChip
              label="Pretty JSON"
              active={prettyJson}
              onClick={() => setPrettyJson((v) => !v)}
            />
          )}
        </div>

        {/* Stats row when there's output */}
        {result.output && !result.error && (
          <div className="flex items-center gap-3 text-xs text-slate-400 tabular-nums">
            <span className="text-amber-600 dark:text-amber-400 font-bold">
              {result.rowCount.toLocaleString()} row
              {result.rowCount !== 1 ? 's' : ''}
            </span>
            <span>·</span>
            <span>
              {result.colCount} column{result.colCount !== 1 ? 's' : ''}
            </span>
            <span>·</span>
            <span>{result.output.length.toLocaleString()} chars output</span>
          </div>
        )}
      </div>

      {/* Editor panes */}
      <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500">
              {inputLabel}
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
                    onClick={handleCopyInput}
                    className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors"
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
            className="w-full h-80 resize-none rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-4 text-xs font-mono text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-400/30 transition-all"
          />

          {/* CSV preview table */}
          {isCsvMode && !isEmpty && !result.error && (
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500">
                Preview
              </p>
              <CsvPreviewTable
                text={input}
                delimiter={delimiter}
                hasHeader={hasHeader}
              />
            </div>
          )}
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500">
              {outputLabel}
            </label>
            {result.output && !result.error && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyOutput}
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
                  <Download className="w-3 h-3" />.
                  {direction === 'csv-to-json' ? 'json' : 'csv'}
                </button>
              </div>
            )}
          </div>

          {result.error ? (
            <div className="h-80 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-5 py-4 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-red-600 dark:text-red-400">
                  Parse error
                </p>
                <p className="text-[13px] text-red-500 font-mono leading-relaxed">
                  {result.error}
                </p>
              </div>
            </div>
          ) : (
            <textarea
              readOnly
              value={result.output}
              placeholder={
                isCsvMode
                  ? '[\n  { "name": "Alice", "age": 30 }\n]'
                  : 'name,age\nAlice,30'
              }
              className="w-full h-80 resize-none rounded-2xl border border-amber-100 dark:border-amber-900/40 bg-slate-50 dark:bg-slate-800/40 px-5 py-4 text-xs font-mono text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600 leading-relaxed focus:outline-none"
            />
          )}

          {/* JSON preview table (when converting to CSV) */}
          {!isCsvMode && result.output && !result.error && (
            <div className="space-y-1.5">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500">
                Preview
              </p>
              <CsvPreviewTable
                text={result.output}
                delimiter={delimiter}
                hasHeader={hasHeader}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
