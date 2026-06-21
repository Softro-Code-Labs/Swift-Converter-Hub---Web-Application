import { AlertTriangle, X, FileX } from 'lucide-react';
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';

interface UnsupportedMetadataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileName: string;
  fileExtension: string;
}

const SUPPORTED_FORMATS = ['JPG', 'TIFF', 'PNG', 'WebP', 'HEIC'];

export const UnsupportedMetadataDialog = ({
  open,
  onOpenChange,
  fileName,
  fileExtension,
}: UnsupportedMetadataDialogProps) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent className="p-0 max-w-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
      <div className="relative px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Format not supported
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              This file type rarely carries EXIF data
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
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Best formats for metadata
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SUPPORTED_FORMATS.map((fmt) => (
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
      <div className="px-6 pb-6">
        <button
          onClick={() => onOpenChange(false)}
          className="w-full py-2.5 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all"
        >
          Try a different file
        </button>
      </div>
    </AlertDialogContent>
  </AlertDialog>
);
