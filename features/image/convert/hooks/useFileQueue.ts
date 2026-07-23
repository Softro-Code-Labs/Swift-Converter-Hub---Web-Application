import { useState } from 'react';
import { FileItem } from '@/features/image/convert/types/converter';
import { isAcceptedByFormat } from '@/features/image/convert/config/formats';
import { getFileExtension } from '@/features/shared/lib/format';
import toast from 'react-hot-toast';

/** Manages the queued file list for the image converter: add, validate, update, and remove. */
export const useFileQueue = (sourceExtension: string) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [invalidFileDetails, setInvalidFileDetails] = useState<{
    name: string;
    type: string;
  }>({ name: '', type: '' });

  const sourceLabel = sourceExtension.toUpperCase();

  const handleFiles = (incoming: File[]) => {
    if (!incoming || incoming.length === 0) return;
    if (files.length + incoming.length > 20) {
      toast.error('Maximum 20 files allowed at once.');
      return;
    }

    const newItems: FileItem[] = [];
    let foundInvalid = false;

    for (const file of incoming) {
      const ext = getFileExtension(file.name);
      if (!isAcceptedByFormat(ext, sourceExtension)) {
        if (!foundInvalid) {
          setInvalidFileDetails({
            name: file.name,
            type: ext.toUpperCase() || 'UNKNOWN',
          });
          foundInvalid = true;
        }
        continue;
      }
      newItems.push({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        status: 'idle',
      });
    }

    if (foundInvalid) {
      setIsAlertOpen(true);
    }

    if (newItems.length > 0) {
      setFiles((prev) => [...prev, ...newItems]);
      toast.success(
        `${newItems.length} ${sourceLabel} ${newItems.length === 1 ? 'file' : 'files'} queued.`,
      );
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target) {
        // Revoke blob URLs so removed files don't leak memory.
        if (target.previewUrl) URL.revokeObjectURL(target.previewUrl);
        if (target.convertedUrl) URL.revokeObjectURL(target.convertedUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const clearAll = () => {
    files.forEach((f) => {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
      if (f.convertedUrl) URL.revokeObjectURL(f.convertedUrl);
    });
    setFiles([]);
  };

  const updateFile = (id: string, patch: Partial<FileItem>) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  };

  return {
    files,
    isAlertOpen,
    invalidFileDetails,
    setIsAlertOpen,
    handleFiles,
    removeFile,
    clearAll,
    updateFile,
  };
};
