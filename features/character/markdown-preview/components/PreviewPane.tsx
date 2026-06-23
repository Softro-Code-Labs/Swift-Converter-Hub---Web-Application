'use client';

import { FileCheck } from 'lucide-react';

interface PreviewPaneProps {
  html: string;
}

export function PreviewPane({ html }: PreviewPaneProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Pane header */}
      <div className="flex items-center px-4 py-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Preview
        </span>
      </div>

      {/* Rendered output */}
      <div className="flex-1 overflow-y-auto px-6 py-5 bg-white dark:bg-slate-900">
        {html ? (
          <div
            className="markdown-body prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-500">
              <FileCheck className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">
              Your rendered document appears here
            </p>
            <p className="text-xs text-slate-300 dark:text-slate-600 max-w-xs">
              Start typing Markdown on the left - preview updates as you type
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
