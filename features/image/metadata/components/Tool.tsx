'use client';

import { useState, useCallback, useRef } from 'react';
import {
  RotateCcw,
  ImageIcon,
  Loader2,
  ShieldOff,
  Download,
  FileSearch,
} from 'lucide-react';
import { MetadataSection } from './MetadataSection';
import { MapPreview } from './MapPreview';
import {
  EngineStatusBar,
  SingleFileDropZone,
  UnsupportedFormatDialog,
} from '../../shared/components';
import { useMetadataEngine } from '../hooks/useMetadataEngine';
import { useMagickEngine } from '@/features/image/shared/hooks/useMagickEngine';
import { isSupportedForMetadata } from '../types/metadata';

export default function MetadataTool() {
  const { isMagickLoaded } = useMagickEngine();
  const { isProcessing, result, extractMetadata, clearResult } =
    useMetadataEngine();
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [unsupportedOpen, setUnsupportedOpen] = useState(false);
  const [unsupportedFile, setUnsupportedFile] = useState({ name: '', ext: '' });

  const loadFile = useCallback(
    (f: File) => {
      if (!isSupportedForMetadata(f)) {
        setUnsupportedFile({
          name: f.name,
          ext: f.name.split('.').pop()?.toLowerCase() ?? 'unknown',
        });
        setUnsupportedOpen(true);
        return;
      }
      clearResult();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setFile(f);
      setPreviewUrl(URL.createObjectURL(f));
      extractMetadata(f);
    },
    [clearResult, previewUrl, extractMetadata],
  );

  const changeImage = useCallback(() => {
    clearResult();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl('');
    setTimeout(() => inputRef.current?.click(), 50);
  }, [clearResult, previewUrl]);

  const reset = useCallback(() => {
    clearResult();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl('');
  }, [clearResult, previewUrl]);

  const downloadJson = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file?.name.split('.')[0] ?? 'image'}_metadata.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <UnsupportedFormatDialog
        open={unsupportedOpen}
        onOpenChange={setUnsupportedOpen}
        fileName={unsupportedFile.name}
        fileExtension={unsupportedFile.ext}
        supportedFormats={['JPG', 'TIFF', 'PNG', 'WebP', 'HEIC']}
        reason="This file type rarely carries EXIF data"
        showConverterCta={false}
        onTryAnother={() => inputRef.current?.click()}
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/tiff,image/png,image/webp,image/heic,image/heif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) loadFile(f);
          e.target.value = '';
        }}
      />

      {/* -- Engine status ------------------------------------------------- */}
      <EngineStatusBar isLoaded={isMagickLoaded} />

      {/* Privacy note specific to this tool - metadata can be sensitive */}
      {!file && (
        <p className="flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-sm text-blue-900 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-100">
          <ShieldOff className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>
            Photos can contain your GPS location. This tool only reads
            what&apos;s already in the file - nothing leaves your browser.
          </span>
        </p>
      )}

      {!file ? (
        <SingleFileDropZone
          isReady={isMagickLoaded}
          onFile={loadFile}
          inputRef={inputRef}
          accept="image/jpeg,image/tiff,image/png,image/webp,image/heic,image/heif"
          icon={FileSearch}
          title="Drag & drop a photo, or"
          subtitle="JPG and TIFF carry the most EXIF data"
          formatPills={['JPG', 'TIFF', 'PNG', 'WebP', 'HEIC']}
        />
      ) : (
        <div className="grid grid-cols-1 @3xl:grid-cols-[280px_1fr] gap-5">
          {/* Image preview column */}
          <div className="space-y-3">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-3 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={`Preview of ${file.name}`}
                className="max-w-full max-h-[280px] object-contain rounded-xl"
              />
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-1.5">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                {file.name}
              </p>
              {result && (
                <p className="text-xs text-slate-400">
                  {result.dimensions.width} × {result.dimensions.height}px ·{' '}
                  {result.fileSize} · {result.format}
                </p>
              )}
            </div>

            <button
              onClick={changeImage}
              className="w-full text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors py-2"
            >
              Change image
            </button>
            <button
              onClick={reset}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors py-1"
            >
              <RotateCcw className="w-3 h-3" /> Start over
            </button>
          </div>

          {/* Metadata results column */}
          <div className="space-y-4">
            {isProcessing ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              </div>
            ) : result ? (
              <>
                {result.gps && <MapPreview gps={result.gps} />}

                {result.hasExif ? (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-400">
                        {result.rawCount} EXIF fields found
                      </p>
                      <button
                        onClick={downloadJson}
                        className="flex items-center gap-1.5 text-[13px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <Download className="w-3 h-3" /> Export JSON
                      </button>
                    </div>
                    <div className="grid grid-cols-1 @xl:grid-cols-2 gap-3">
                      {result.categories.map((cat) => (
                        <MetadataSection key={cat.id} category={cat} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center space-y-2">
                    <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                      No EXIF metadata found
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs">
                      This image doesn&apos;t contain camera or location data -
                      it may have been stripped, edited, or created without
                      EXIF.
                    </p>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
