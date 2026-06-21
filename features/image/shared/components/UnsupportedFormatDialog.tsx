import { AlertTriangle, X, FileX, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';

interface UnsupportedFormatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileName: string;
  fileExtension: string;
  supportedFormats: string[];
  /** Tool-specific reason, e.g. "This file can't be cropped" */
  reason?: string;
  /** Show a "Go to Format Converter" CTA - useful when the user could
   * convert the file first and come back */
  showConverterCta?: boolean;
  /** Optional callback for a "Try a different file" secondary action that
   * reopens the original tool's file picker */
  onTryAnother?: () => void;
}

export const UnsupportedFormatDialog = ({
  open,
  onOpenChange,
  fileName,
  fileExtension,
  supportedFormats,
  reason = "This file type isn't supported",
  showConverterCta = true,
  onTryAnother,
}: UnsupportedFormatDialogProps) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent className="p-0 max-w-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
      <div className="relative px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={() => onOpenChange(false)}
          aria-label="Close"
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
              Format not supported
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {reason}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 space-y-3">
        <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 rounded-xl">
          <FileX className="w-5 h-5 text-red-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
              {fileName}
            </p>
            <p className="text-[10px] text-red-500 dark:text-red-400 font-bold uppercase mt-0.5">
              .{fileExtension} - not supported
            </p>
          </div>
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Supported formats
          </p>
          <div className="flex flex-wrap gap-1.5">
            {supportedFormats.map((fmt) => (
              <span
                key={fmt}
                className="text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md"
              >
                {fmt}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 flex flex-col gap-2">
        {showConverterCta && (
          <Link
            href="/image"
            onClick={() => onOpenChange(false)}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-bold rounded-xl transition-all"
          >
            Go to Format Converter <ArrowRight className="w-4 h-4" />
          </Link>
        )}
        <button
          onClick={() => {
            onOpenChange(false);
            onTryAnother?.();
          }}
          className={`w-full py-2.5 text-sm font-semibold rounded-xl transition-all
            ${
              showConverterCta
                ? 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
        >
          {onTryAnother ? 'Try a different file' : 'Dismiss'}
        </button>
      </div>
    </AlertDialogContent>
  </AlertDialog>
);
