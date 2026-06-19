import { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Loader2,
  Clock,
  Download,
  Trash2,
  Image,
} from 'lucide-react';
import { FileItem } from '@/features/image/converter/types/converter';
import { formatBytes } from '../../utils/formatBytes';

interface FileListItemProps {
  item: FileItem;
  isConvertingAll: boolean;
  onDownload: (item: FileItem) => void;
  onRemove: (id: string) => void;
}

const STATUS_CONFIG = {
  idle: {
    border: 'border-slate-200 dark:border-slate-800',
    bg: 'bg-white dark:bg-slate-900/50',
    ring: '',
  },
  processing: {
    border: 'border-blue-300 dark:border-blue-700/50',
    bg: 'bg-blue-50/30 dark:bg-blue-950/10',
    ring: 'ring-2 ring-blue-500/10',
  },
  success: {
    border: 'border-emerald-200 dark:border-emerald-800/50',
    bg: 'bg-emerald-50/30 dark:bg-emerald-950/10',
    ring: '',
  },
  error: {
    border: 'border-red-200 dark:border-red-800/50',
    bg: 'bg-red-50/20 dark:bg-red-950/10',
    ring: '',
  },
};

export const FileListItem = ({
  item,
  isConvertingAll,
  onDownload,
  onRemove,
}: FileListItemProps) => {
  const cfg = STATUS_CONFIG[item.status];

  // Error state
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`border rounded-xl p-3 flex items-center gap-3 transition-all duration-300 ${cfg.border} ${cfg.bg} ${cfg.ring}`}
    >
      {/* -- Thumbnail ---------------------------------------------------- */}
      <div className="h-11 w-11 shrink-0 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 relative flex items-center justify-center">
        {item.previewUrl ? (
          !hasError ? (
            <img
              src={item.previewUrl}
              alt=""
              className="h-full w-full object-cover"
              onError={() => setHasError(true)}
            />
          ) : (
            <Image className="w-5 h-5 text-slate-400 dark:text-slate-500 stroke-[1.5]" />
          )
        ) : item.status === 'success' ? (
          <CheckCircle className="w-5 h-5 text-emerald-500" />
        ) : item.status === 'error' ? (
          <XCircle className="w-5 h-5 text-red-400" />
        ) : (
          <Loader2 className="w-4 h-4 text-slate-300 dark:text-slate-600 animate-spin" />
        )}

        {/* Processing overlay */}
        {item.status === 'processing' && (
          <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-[1px] flex items-center justify-center">
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* -- File info ---------------------------------------------------- */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
          {item.file.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            {formatBytes(item.file.size)}
          </span>
          {item.outputSize && (
            <>
              <span className="text-[10px] text-slate-300 dark:text-slate-700">
                →
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-md">
                {item.outputSize}
              </span>
            </>
          )}
        </div>
      </div>

      {/* -- Status + actions --------------------------------------------- */}
      <div className="shrink-0 flex items-center gap-1.5">
        {item.status === 'idle' && (
          <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
            <Clock className="w-3 h-3" />
            Ready
          </span>
        )}

        {item.status === 'processing' && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-1 rounded-lg">
            <Loader2 className="w-3 h-3 animate-spin" />
            Converting
          </span>
        )}

        {item.status === 'success' && (
          <button
            onClick={() => onDownload(item)}
            className="flex items-center gap-1.5 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-2.5 py-1.5 rounded-lg cursor-pointer transition-all"
          >
            <Download className="w-3 h-3" />
            Download
          </button>
        )}

        {item.status === 'error' && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-950/30 px-2 py-1 rounded-lg">
            <XCircle className="w-3 h-3" />
            Failed
          </span>
        )}

        <button
          disabled={isConvertingAll}
          onClick={() => onRemove(item.id)}
          aria-label="Remove file"
          className="p-1.5 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg disabled:opacity-30 cursor-pointer transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
