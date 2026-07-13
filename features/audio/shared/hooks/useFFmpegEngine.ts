import { useFFmpegEngineContext } from '../providers/FFmpegEngineProvider';

/**
 * Returns the shared FFmpeg engine instance and whether it's finished loading.
 */
export const useFFmpegEngine = () => {
  return useFFmpegEngineContext();
};
