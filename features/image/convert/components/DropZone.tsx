'use client';

import React, { useRef } from 'react';
import { ImageIcon } from 'lucide-react';
import { DropZoneSurface } from '@/features/shared/components/DropZoneSurface';
import { useFileHandoff } from '@/features/shared/lib/fileHandoff';

interface DropZoneProps {
  isMagickLoaded: boolean;
  onFiles: (files: FileList) => void;
  currentCount?: number;
}

const MAX_FILES = 20;

/** Wraps a File[] so callers that expect a FileList keep working. */
function toFileList(files: File[]): FileList {
  const dt = new DataTransfer();
  files.forEach((f) => dt.items.add(f));
  return dt.files;
}

export const DropZone = ({
  isMagickLoaded,
  onFiles,
  currentCount = 0,
}: DropZoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const remaining = MAX_FILES - currentCount;

  useFileHandoff((files) => onFiles(toFileList(files)), {
    ready: isMagickLoaded,
  });

  return (
    <DropZoneSurface
      isReady={isMagickLoaded}
      icon={ImageIcon}
      title={currentCount > 0 ? 'Add more images' : 'Drop images here'}
      buttonLabel={currentCount > 0 ? 'Add images' : 'Choose images'}
      hint={
        currentCount > 0
          ? `${currentCount} added, ${remaining} more allowed`
          : `Up to ${MAX_FILES} images at once`
      }
      compact={currentCount > 0}
      loadingLabel="Getting the image engine ready…"
      ariaLabel="Choose image files"
      onPick={() => inputRef.current?.click()}
      onDropFiles={onFiles}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*, image/x-icon"
        className="hidden"
        disabled={!isMagickLoaded}
        onChange={(e) => {
          if (e.target.files) onFiles(e.target.files);
          e.target.value = '';
        }}
      />
    </DropZoneSurface>
  );
};
