'use client';

import React, { useCallback } from 'react';
import { ImageIcon, type LucideIcon } from 'lucide-react';
import { DropZoneSurface } from './DropZoneSurface';
import { useFileHandoff } from '@/features/shared/lib/fileHandoff';

interface MultiFileDropZoneProps {
  isReady: boolean;
  onFiles: (files: File[]) => void;
  currentCount: number;
  maxFiles?: number;
  accept: string;
  formatPills?: string[];
  icon?: LucideIcon;
  /** e.g. "images", "audio files" - used in "Up to N {unitLabel} at once" */
  unitLabel?: string;
  ariaLabel?: string;
}

export const MultiFileDropZone = ({
  isReady,
  onFiles,
  currentCount,
  maxFiles = 20,
  accept,
  formatPills,
  icon = ImageIcon,
  unitLabel = 'images',
  ariaLabel = 'Choose files',
}: MultiFileDropZoneProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const remaining = maxFiles - currentCount;

  const take = useCallback(
    (list: FileList | File[]) => onFiles(Array.from(list).slice(0, remaining)),
    [onFiles, remaining],
  );

  useFileHandoff(take, { ready: isReady, accept });

  return (
    <DropZoneSurface
      isReady={isReady}
      icon={icon}
      title={
        currentCount > 0 ? `Add more ${unitLabel}` : `Drop ${unitLabel} here`
      }
      buttonLabel={currentCount > 0 ? 'Add files' : 'Choose files'}
      hint={
        currentCount > 0
          ? `${currentCount} added, ${remaining} more allowed`
          : `Up to ${maxFiles} ${unitLabel} at once`
      }
      formatPills={currentCount > 0 ? undefined : formatPills}
      compact={currentCount > 0}
      ariaLabel={ariaLabel}
      onPick={() => inputRef.current?.click()}
      onDropFiles={take}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        disabled={!isReady}
        className="hidden"
        onChange={(e) => {
          if (e.target.files) take(e.target.files);
          e.target.value = '';
        }}
      />
    </DropZoneSurface>
  );
};
