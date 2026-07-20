'use client';

import { useState } from 'react';
import { Download, Loader2, ImageIcon, AlertCircle, Wand2 } from 'lucide-react';
import { useBase64Engine } from '../hooks/useBase64Engine';
import { isValidBase64 } from '../types/base64';

export const DecodeTab = () => {
  const { isDecoding, decodeResult, decodeBase64, clearDecode } =
    useBase64Engine();
  const [input, setInput] = useState('');
  const [touched, setTouched] = useState(false);

  const isValid = !touched || !input.trim() || isValidBase64(input);

  const handleDecode = () => {
    setTouched(true);
    if (!input.trim() || !isValidBase64(input)) return;
    decodeBase64(input);
  };

  const handleDownload = () => {
    if (!decodeResult) return;
    const ext = decodeResult.mimeType.split('/')[1] ?? 'png';
    const a = document.createElement('a');
    a.href = decodeResult.blobUrl;
    a.download = `decoded_image.${ext}`;
    a.click();
  };

  const handlePaste = (val: string) => {
    setInput(val);
    setTouched(false);
    if (decodeResult) clearDecode();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
      {/* Input column */}
      <div className="space-y-3">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Paste Base64 string
          </label>
          <textarea
            value={input}
            onChange={(e) => handlePaste(e.target.value)}
            placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA... or just the raw base64 string"
            className={`w-full h-64 p-3 text-[11px] font-mono bg-slate-50 dark:bg-slate-900 border rounded-xl text-slate-700 dark:text-slate-300 resize-none focus:outline-none focus:ring-2 transition-all
              ${
                !isValid
                  ? 'border-red-300 dark:border-red-800 focus:ring-red-500/30'
                  : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500/30 focus:border-blue-400'
              }`}
          />
          {!isValid && (
            <p className="flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400">
              <AlertCircle className="w-3.5 h-3.5" /> This doesn&apos;t look like
              valid Base64
            </p>
          )}
        </div>

        <button
          onClick={handleDecode}
          disabled={!input.trim() || isDecoding}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all
            ${
              input.trim() && !isDecoding
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 active:scale-[0.98]'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
        >
          {isDecoding ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Decoding…
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" /> Decode to Image
            </>
          )}
        </button>
      </div>

      {/* Result column */}
      <div className="space-y-3">
        <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
          Preview
        </p>
        <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-3 flex items-center justify-center min-h-[200px]">
          {decodeResult ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={decodeResult.blobUrl}
              alt="Image decoded from Base64 string"
              className="max-w-full max-h-[240px] object-contain rounded-xl"
            />
          ) : (
            <ImageIcon className="w-10 h-10 text-slate-300 dark:text-slate-700" />
          )}
        </div>

        {decodeResult && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-1.5">
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-400">Format</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {decodeResult.mimeType}
              </span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-400">Size</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {decodeResult.size}
              </span>
            </div>
            {decodeResult.dimensions && (
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400">Dimensions</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {decodeResult.dimensions.width} ×{' '}
                  {decodeResult.dimensions.height}px
                </span>
              </div>
            )}
          </div>
        )}

        {decodeResult && (
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all active:scale-[0.98]"
          >
            <Download className="w-4 h-4" /> Download Image
          </button>
        )}
      </div>
    </div>
  );
};
