'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  FileCheck,
  Copy,
  Check,
  Download,
  Columns2,
  PanelLeft,
  PanelRight,
  Maximize2,
  X,
} from 'lucide-react';
import { useMarkdownRenderer } from '../hooks/useMarkdownRenderer';
import { EditorPane } from './EditorPane';
import { PreviewPane } from './PreviewPane';
import { ToolbarButton } from './ToolbarButton';
import type { ViewMode } from '../types/markdownPreview';

export default function MarkdownPreviewTool() {
  const [markdown, setMarkdown] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [fullscreen, setFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { html, stats } = useMarkdownRenderer(markdown);

  const isEmpty = markdown.trim().length === 0;

  const handleCopyHtml = useCallback(() => {
    if (!html) return;
    navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [html]);

  const handleDownloadMd = useCallback(() => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
  }, [markdown]);

  const handleDownloadHtml = useCallback(() => {
    const full = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 740px; margin: 40px auto; padding: 0 20px; color: #1e293b; line-height: 1.7; }
    h1,h2,h3,h4 { font-weight: 800; margin-top: 2em; }
    code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-size: 0.875em; }
    pre { background: #f1f5f9; padding: 16px; border-radius: 8px; overflow-x: auto; }
    pre code { background: none; padding: 0; }
    blockquote { border-left: 3px solid #10b981; margin: 0; padding-left: 1em; color: #64748b; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #e2e8f0; padding: 8px 12px; text-align: left; }
    th { background: #f8fafc; font-weight: 700; }
    a { color: #10b981; }
    img { max-width: 100%; }
  </style>
</head>
<body>
${html}
</body>
</html>`;
    const blob = new Blob([full], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
  }, [html]);

  // Editor area - reused in both normal and fullscreen
  const editorArea = (
    <div
      className={`
        bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden
        ${fullscreen ? 'fixed inset-4 z-50 shadow-2xl flex flex-col' : 'flex flex-col'}
      `}
      style={{ height: fullscreen ? undefined : '600px' }}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 shrink-0">
        {/* View mode */}
        <ToolbarButton
          onClick={() => setViewMode('editor')}
          active={viewMode === 'editor'}
          icon={PanelLeft}
          label="Editor"
          title="Editor only"
        />
        <ToolbarButton
          onClick={() => setViewMode('split')}
          active={viewMode === 'split'}
          icon={Columns2}
          label="Split"
          title="Split view"
        />
        <ToolbarButton
          onClick={() => setViewMode('preview')}
          active={viewMode === 'preview'}
          icon={PanelRight}
          label="Preview"
          title="Preview only"
        />

        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

        {/* Actions */}
        <ToolbarButton
          onClick={handleCopyHtml}
          disabled={isEmpty}
          icon={copied ? Check : Copy}
          label={copied ? 'Copied!' : 'Copy HTML'}
          title="Copy rendered HTML to clipboard"
        />
        <ToolbarButton
          onClick={handleDownloadMd}
          disabled={isEmpty}
          icon={Download}
          label=".md"
          title="Download as Markdown"
        />
        <ToolbarButton
          onClick={handleDownloadHtml}
          disabled={isEmpty}
          icon={Download}
          label=".html"
          title="Download as HTML"
        />

        {/* Stats */}
        {!isEmpty && (
          <div className="ml-auto flex items-center gap-3 text-[10px] font-semibold text-slate-400 tabular-nums">
            <span>{stats.words} words</span>
            <span>·</span>
            <span>{stats.lines} lines</span>
            <span>·</span>
            <span>{stats.readingTime} read</span>
          </div>
        )}

        {/* Fullscreen toggle */}
        <button
          onClick={() => setFullscreen((v) => !v)}
          title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          className="ml-auto flex items-center p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-all"
        >
          {fullscreen ? (
            <X className="w-3.5 h-3.5" />
          ) : (
            <Maximize2 className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Panes */}
      <div className="flex-1 overflow-hidden flex min-h-0">
        {viewMode !== 'preview' && (
          <div
            className={`flex flex-col overflow-hidden border-r border-slate-100 dark:border-slate-800
            ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}
          >
            <EditorPane value={markdown} onChange={setMarkdown} />
          </div>
        )}
        {viewMode !== 'editor' && (
          <div
            className={`flex flex-col overflow-hidden
            ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}
          >
            <PreviewPane html={html} />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Fullscreen backdrop */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm"
          onClick={() => setFullscreen(false)}
        />
      )}

      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back nav */}
          <Link
            href="/character"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Character Studio
          </Link>

          {/* Header */}
          <div className="flex items-start gap-4 mb-8">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Markdown Preview
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                GFM rendering - split view, fullscreen, export to .md or .html
              </p>
            </div>
          </div>

          {/* Main editor */}
          {editorArea}

          {/* Markdown cheatsheet */}
          {isEmpty && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { syntax: '# Heading', desc: 'H1 – H6 with #' },
                { syntax: '**bold**', desc: 'Bold text' },
                { syntax: '*italic*', desc: 'Italic text' },
                { syntax: '`code`', desc: 'Inline code' },
                { syntax: '> quote', desc: 'Blockquote' },
                { syntax: '- item', desc: 'Unordered list' },
                { syntax: '[text](url)', desc: 'Hyperlink' },
                { syntax: '```lang', desc: 'Code block' },
              ].map(({ syntax, desc }) => (
                <div
                  key={syntax}
                  className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                >
                  <code className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold block mb-1">
                    {syntax}
                  </code>
                  <span className="text-[10px] text-slate-400">{desc}</span>
                </div>
              ))}
            </div>
          )}

          {/* Live indicator */}
          <div className="mt-6 flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
              Renders as you type - your markdown never leaves this page
            </p>
          </div>
        </div>
      </main>

      {/* Markdown prose styles injected globally */}
      <style>{`
        .markdown-body h1 { font-size: 1.75rem; font-weight: 900; margin-bottom: 0.5rem; margin-top: 1.5rem; color: inherit; }
        .markdown-body h2 { font-size: 1.35rem; font-weight: 800; margin-bottom: 0.4rem; margin-top: 1.5rem; color: inherit; padding-bottom: 0.3rem; border-bottom: 1px solid rgb(226 232 240 / 1); }
        .dark .markdown-body h2 { border-bottom-color: rgb(51 65 85 / 1); }
        .markdown-body h3 { font-size: 1.1rem; font-weight: 700; margin-top: 1.2rem; margin-bottom: 0.3rem; color: inherit; }
        .markdown-body h4, .markdown-body h5, .markdown-body h6 { font-weight: 700; margin-top: 1rem; margin-bottom: 0.25rem; color: inherit; }
        .markdown-body p { margin-bottom: 0.85rem; line-height: 1.75; }
        .markdown-body ul, .markdown-body ol { padding-left: 1.5rem; margin-bottom: 0.85rem; }
        .markdown-body li { margin-bottom: 0.25rem; line-height: 1.7; }
        .markdown-body a { color: #10b981; text-decoration: underline; text-underline-offset: 3px; }
        .markdown-body a:hover { color: #059669; }
        .markdown-body strong { font-weight: 800; }
        .markdown-body em { font-style: italic; }
        .markdown-body del { text-decoration: line-through; color: #94a3b8; }
        .markdown-body code { font-size: 0.8rem; background: #f1f5f9; color: #10b981; padding: 2px 6px; border-radius: 5px; font-family: ui-monospace, monospace; }
        .dark .markdown-body code { background: #1e293b; color: #34d399; }
        .markdown-body pre { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; overflow-x: auto; margin-bottom: 1rem; }
        .dark .markdown-body pre { background: #0f172a; border-color: #1e293b; }
        .markdown-body pre code { background: none; color: #334155; padding: 0; font-size: 0.8rem; }
        .dark .markdown-body pre code { color: #94a3b8; }
        .markdown-body blockquote { border-left: 3px solid #10b981; margin: 0 0 0.85rem 0; padding: 0.5rem 0 0.5rem 1rem; color: #64748b; background: #f0fdf4; border-radius: 0 8px 8px 0; }
        .dark .markdown-body blockquote { background: #022c22; color: #94a3b8; }
        .markdown-body table { width: 100%; border-collapse: collapse; margin-bottom: 1rem; font-size: 0.875rem; }
        .markdown-body th { background: #f8fafc; font-weight: 700; text-align: left; padding: 8px 12px; border: 1px solid #e2e8f0; }
        .dark .markdown-body th { background: #1e293b; border-color: #334155; }
        .markdown-body td { padding: 8px 12px; border: 1px solid #e2e8f0; }
        .dark .markdown-body td { border-color: #334155; }
        .markdown-body tr:nth-child(even) td { background: #f8fafc; }
        .dark .markdown-body tr:nth-child(even) td { background: #0f172a; }
        .markdown-body hr { border: none; border-top: 1px solid #e2e8f0; margin: 1.5rem 0; }
        .dark .markdown-body hr { border-top-color: #334155; }
        .markdown-body img { max-width: 100%; border-radius: 8px; }
      `}</style>
    </>
  );
}
