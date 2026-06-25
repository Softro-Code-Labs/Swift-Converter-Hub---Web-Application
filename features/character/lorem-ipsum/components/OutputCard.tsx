'use client';

import { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';

interface OutputCardProps {
  text: string;
  onRegenerate: () => void;
}

export function OutputCard({ text, onRegenerate }: OutputCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lorem-ipsum.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const charCount = text.length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
      {/* Output header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900">
        <div className="flex items-center gap-3 text-[10px] text-slate-400 tabular-nums">
          <span>{wordCount.toLocaleString()} words</span>
          <span>·</span>
          <span>{charCount.toLocaleString()} characters</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] font-bold text-slate-500 hover:border-orange-300 hover:text-orange-600 dark:hover:border-orange-700 dark:hover:text-orange-400 cursor-pointer transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" /> Copy
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] font-bold text-slate-500 hover:border-orange-300 hover:text-orange-600 dark:hover:border-orange-700 dark:hover:text-orange-400 cursor-pointer transition-all"
          >
            <Download className="w-3 h-3" /> .txt
          </button>
        </div>
      </div>

      {/* Text output */}
      <div className="px-6 py-5 space-y-4 max-h-[480px] overflow-y-auto">
        {text.split('\n\n').map((para, i) => (
          <p
            key={i}
            className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
          >
            {para}
          </p>
        ))}
      </div>
    </div>
  );
}
