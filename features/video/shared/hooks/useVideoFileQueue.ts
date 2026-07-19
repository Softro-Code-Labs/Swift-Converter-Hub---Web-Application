import { useState } from 'react';
import { VideoFileItem } from '@/features/video/shared/types/videoFile';
import { getFormatByExtension } from '@/features/video/shared/config/formats';
import { getVideoMetadata } from '@/features/video/shared/lib/videoUtils';
import { getFileExtension } from '@/features/shared/lib/format';
import toast from 'react-hot-toast';

const MAX_FILES = 5;

export const useVideoFileQueue = () => {
  const [files, setFiles] = useState<VideoFileItem[]>([]);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [invalidFileDetails, setInvalidFileDetails] = useState<{
    name: string;
    type: string;
  }>({ name: '', type: '' });

  const handleFiles = (incoming: File[]) => {
    if (!incoming || incoming.length === 0) return;
    if (files.length + incoming.length > MAX_FILES) {
      toast.error(`Maximum ${MAX_FILES} video files allowed at once.`);
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

    const newItems: VideoFileItem[] = accepted.map((file) => ({
      id: crypto.randomUUID(),
      file,
      status: 'idle',
    }));

    setFiles((prev) => [...prev, ...newItems]);
    toast.success(
      `${newItems.length} ${newItems.length === 1 ? 'file' : 'files'} queued.`,
    );

    newItems.forEach((item) => {
      getVideoMetadata(item.file)
        .then(({ duration }) => {
          setFiles((prev) =>
            prev.map((f) => (f.id === item.id ? { ...f, duration } : f)),
          );
        })
        .catch(() => {
          // Non-fatal - duration is a display detail, not required to proceed.
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

  const updateFile = (id: string, patch: Partial<VideoFileItem>) => {
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
    maxFiles: MAX_FILES,
  };
};
