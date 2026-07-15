import { VideoFormat } from '@/features/video/shared/config/formats';
import { MediaFileItem, MediaProcessStatus } from '@/features/shared/types/mediaFile';

export type VideoProcessStatus = MediaProcessStatus;
export type VideoFileItem = MediaFileItem<VideoFormat>;
