'use client';

import React from 'react';
import { type LucideIcon } from 'lucide-react';
import { DropZoneSurface } from './DropZoneSurface';
import { useFileHandoff } from '@/features/shared/lib/fileHandoff';

interface SingleFileDropZoneProps {
  isReady: boolean;
  onFile: (file: File) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  accept: string;
  icon: LucideIcon;
  title?: string;
  subtitle?: string;
  formatPills?: string[];
  /** e.g. "Upload image", "Upload audio file" */
  ariaLabel?: string;
  /** Kept for compatibility. */
  dropLabel?: string;
  loadingLabel?: string;
}

export const SingleFileDropZone = ({
  isReady,
  onFile,
  inputRef,
  accept,
  icon,
  title,
  subtitle = 'One file at a time',
  formatPills,
  ariaLabel = 'Choose a file',
  loadingLabel,
}: SingleFileDropZoneProps) => {
  useFileHandoff((files) => onFile(files[0]), { ready: isReady, accept });

  return (
    <DropZoneSurface
      isReady={isReady}
      icon={icon}
      title={
        title
          ? title.replace(/,?\s*or$/i, '').replace(/^Drag & drop/i, 'Drop')
          : 'Drop a file here'
      }
      buttonLabel="Choose file"
      hint={subtitle}
      formatPills={formatPills}
      loadingLabel={loadingLabel}
      ariaLabel={ariaLabel}
      onPick={() => inputRef.current?.click()}
      onDropFiles={(files) => onFile(files[0])}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        disabled={!isReady}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = '';
        }}
      />
    </DropZoneSurface>
  );
};
