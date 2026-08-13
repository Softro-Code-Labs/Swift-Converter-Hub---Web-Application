import { useFFmpegEngineContext } from '../providers/FFmpegEngineProvider';

/**
 * Returns the shared FFmpeg engine (`ffmpeg`, for single-job tools) plus
 * `acquireEngine`/`releaseEngine` for batch tools that want to pull several
 * engines from the pool to process files concurrently. See
 * FFmpegEngineProvider for details.
 */
export const useFFmpegEngine = () => {
  return useFFmpegEngineContext();
};
