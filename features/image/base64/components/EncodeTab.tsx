'use client';

import { useState, useCallback, useRef } from 'react';
import {
  Copy,
  Check,
  Download,
  RotateCcw,
  ImageIcon,
  Loader2,
} from 'lucide-react';
import { Base64DropZone } from './Base64DropZone';
import { useBase64Engine } from '../hooks/useBase64Engine';
import { Base64OutputStyle } from '../types/base64';

const OUTPUT_STYLES: { id: Base64OutputStyle; label: string }[] = [
  { id: 'raw', label: 'Raw Base64' },
  { id: 'dataUri', label: 'Data URI' },
  { id: 'cssBackground', label: 'CSS' },
  { id: 'htmlImg', label: 'HTML <img>' },
];

export const EncodeTab = () => {
  const { isEncoding, encodeResult, encodeFile, clearEncode } =
    useBase64Engine();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [outputStyle, setOutputStyle] = useState<Base64OutputStyle>('dataUri');
  const [copied, setCopied] = useState(false);

  const loadFile = useCallback(
    (f: File) => {
      clearEncode();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
      encodeFile(f);
    },
    [clearEncode, previewUrl, encodeFile],
  );

  const reset = useCallback(() => {
    clearEncode();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl('');
  }, [clearEncode, previewUrl]);

  const getOutputText = (): string => {
    if (!encodeResult) return '';
    switch (outputStyle) {
      case 'raw':
        return encodeResult.base64Raw;
      case 'dataUri':
        return encodeResult.dataUri;
      case 'cssBackground':
        return `background-image: url('${encodeResult.dataUri}');`;
      case 'htmlImg':
        return `<img src="${encodeResult.dataUri}" alt="${encodeResult.fileName}" />`;
      default:
        return '';
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getOutputText());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadAsText = () => {
    const blob = new Blob([getOutputText()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name.split('.')[0] ?? 'image'}_base64.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!file) {
    return <Base64DropZone onFile={loadFile} />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">
      {/* Preview column */}
      <div className="space-y-3">
        <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-3 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-full max-h-[240px] object-contain rounded-xl"
          />
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-1.5">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
            {file.name}
          </p>
          {encodeResult && (
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-400">
              <span>{encodeResult.originalSize}</span>
              {encodeResult.dimensions && (
                <span>
                  {encodeResult.dimensions.width} ×{' '}
                  {encodeResult.dimensions.height}px
                </span>
              )}
              <span>{encodeResult.mimeType}</span>
            </div>
          )}
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors py-1"
        >
          Change image
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) loadFile(f);
            e.target.value = '';
          }}
        />
        <button
          onClick={reset}
          className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Start over
        </button>
      </div>

      {/* Output column */}
      <div className="space-y-3">
        {isEncoding ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        ) : encodeResult ? (
          <>
            {/* Output style tabs */}
            <div className="flex flex-wrap gap-1.5">
              {OUTPUT_STYLES.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setOutputStyle(id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all
                    ${
                      outputStyle === id
                        ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-blue-300'
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Stats bar */}
            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span>{encodeResult.encodedSize} encoded</span>
              <span>·</span>
              <span>~33% larger than binary</span>
            </div>

            {/* Output textarea */}
            <div className="relative">
              <textarea
                readOnly
                value={getOutputText()}
                className="w-full h-64 p-3 text-[11px] font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:border-blue-300 transition-all shadow-sm"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <button
              onClick={downloadAsText}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all active:scale-[0.98]"
            >
              <Download className="w-4 h-4" /> Download as .txt
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};
