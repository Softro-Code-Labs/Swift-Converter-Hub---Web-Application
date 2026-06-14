import { useRouter } from 'next/navigation';
import { AlertTriangle, X, ArrowRight, FileX } from 'lucide-react';
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';

interface InvalidFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileName: string;
  fileType: string;
  sourceFormatLabel: string;
}

export const InvalidFileDialog = ({
  open,
  onOpenChange,
  fileName,
  fileType,
  sourceFormatLabel,
}: InvalidFileDialogProps) => {
  const router = useRouter();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="p-0 max-w-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="relative px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Wrong file type
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                This converter only accepts {sourceFormatLabel} files
              </p>
            </div>
          </div>
        </div>

        {/* ── File details ────────────────────────────────────────────── */}
        <div className="px-6 py-4 space-y-3">
          <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 rounded-xl">
            <FileX className="w-5 h-5 text-red-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                {fileName}
              </p>
              <p className="text-[10px] text-red-500 dark:text-red-400 font-bold uppercase mt-0.5">
                .{fileType} — not accepted
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span>Expected</span>
              <span className="font-black text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                {sourceFormatLabel}
              </span>
              <span>files only</span>
            </div>
          </div>
        </div>

        {/* ── Actions ─────────────────────────────────────────────────── */}
        <div className="px-6 pb-6 flex flex-col gap-2">
          <button
            onClick={() => onOpenChange(false)}
            className="w-full py-2.5 text-sm font-bold bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl transition-all shadow-sm shadow-blue-500/20 cursor-pointer"
          >
            Continue with valid files
          </button>
          <button
            onClick={() => {
              onOpenChange(false);
              router.push('/image');
            }}
            className="w-full py-2.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Go to Image Hub
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
