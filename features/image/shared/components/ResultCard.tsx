import { CheckCircle, Download } from 'lucide-react';

interface ResultCardProps {
  imageUrl: string;
  label: string; // e.g. "Result - 1920 × 1080px · 240 KB"
  onDownload: () => void;
  onDismiss?: () => void;
  downloadLabel?: string;
}

export const ResultCard = ({
  imageUrl,
  label,
  onDownload,
  onDismiss,
  downloadLabel = 'Download',
}: ResultCardProps) => (
  <div className="bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-4 space-y-3">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <CheckCircle className="w-4 h-4 text-emerald-500" />
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
          {label}
        </span>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          Dismiss
        </button>
      )}
    </div>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={imageUrl}
      alt="Result"
      className="max-w-full max-h-[300px] object-contain mx-auto rounded-xl border border-slate-200 dark:border-slate-700"
    />
    <button
      onClick={onDownload}
      className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all active:scale-[0.98]"
    >
      <Download className="w-4 h-4" /> {downloadLabel}
    </button>
  </div>
);
