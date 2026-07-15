import { AudioFormat } from '@/features/audio/shared/config/formats';
import {
  MediaFileItem,
  MediaProcessStatus,
} from '@/features/shared/types/mediaFile';

export type AudioProcessStatus = MediaProcessStatus;
export type AudioFileItem = MediaFileItem<AudioFormat>;
