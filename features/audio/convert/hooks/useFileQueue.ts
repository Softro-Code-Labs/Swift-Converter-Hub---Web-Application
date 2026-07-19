import { useState } from 'react';
import { AudioFileItem } from '@/features/audio/convert/types/converter';
import { getFormatByExtension } from '@/features/audio/convert/config/formats';
import { getAudioDuration } from '@/features/shared/lib/ffmpegUtils';
import { getFileExtension } from '@/features/shared/lib/format';
import toast from 'react-hot-toast';

const MAX_FILES = 20;

export const useFileQueue = (sourceExtension: string) => {
  const [files, setFiles] = useState<AudioFileItem[]>([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [invalidFileDetails, setInvalidFileDetails] = useState<{
    name: string;
    type: string;
  }>({ name: '', type: '' });

  const sourceLabel = sourceExtension.toUpperCase();

  const handleFiles = (incoming: File[]) => {
    if (!incoming || incoming.length === 0) return;
    if (files.length + incoming.length > MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} files allowed at once.`);
      return;
    }

    const accepted: File[] = [];
    let foundInvalid = false;

    for (const file of incoming) {
      const ext = getFileExtension(file.name);

      if (!getFormatByExtension(ext)) {
        if (!foundInvalid) {
          setInvalidFileDetails({
            name: file.name,
            type: ext.toUpperCase() || 'UNKNOWN',
          });
          foundInvalid = true;
        }
        continue;
      }
      accepted.push(file);
    }

    if (foundInvalid) setIsAlertOpen(true);
    if (accepted.length === 0) return;

    const newItems: AudioFileItem[] = accepted.map((file) => ({
      id: crypto.randomUUID(),
      file,
      status: 'idle',
    }));

    setFiles((prev) => [...prev, ...newItems]);
    toast.success(
      `${newItems.length} ${sourceLabel} ${newItems.length === 1 ? 'file' : 'files'} queued.`,
    );

    newItems.forEach((item) => {
      getAudioDuration(item.file)
        .then((duration) => {
          setFiles((prev) =>
            prev.map((f) => (f.id === item.id ? { ...f, duration } : f)),
          );
        })
        .catch(() => {
          // Non-fatal - duration is a nice-to-have display detail, not
        });
    });
  };

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.convertedUrl) URL.revokeObjectURL(target.convertedUrl);
      return prev.filter((f) => f.id !== id);
    });
  };

  const clearAll = () => {
    files.forEach((f) => {
      if (f.convertedUrl) URL.revokeObjectURL(f.convertedUrl);
    });
    setFiles([]);
  };

  const updateFile = (id: string, patch: Partial<AudioFileItem>) => {
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
