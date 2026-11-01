import { ProcessToolbar } from '@/features/shared/components/ProcessToolbar';
import { FileItem } from '@/features/image/convert/types/converter';

interface ConverterToolbarProps {
  files: FileItem[];
  isConvertingAll: boolean;
  isZipping: boolean;
  isMagickLoaded: boolean;
  onConvertAll: () => void;
  onDownloadAll: () => void;
  onClearAll: () => void;
}

/** Image converter footer - same behaviour as every other batch tool. */
export const ConverterToolbar = ({
  files,
  isConvertingAll,
  isZipping,
  isMagickLoaded,
  onConvertAll,
  onDownloadAll,
  onClearAll,
}: ConverterToolbarProps) => (
  <ProcessToolbar
    files={files}
    isProcessing={isConvertingAll}
    isZipping={isZipping}
    isEngineLoaded={isMagickLoaded}
    onProcessAll={onConvertAll}
    onDownloadAll={onDownloadAll}
    onClearAll={onClearAll}
    actionVerb="Convert"
    actionVerbIng="Converting"
  />
);
