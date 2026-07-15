import StudioAdLayout from '@/components/ads/StudioAdLayout';
import { FFmpegEngineProvider } from '@/features/shared/providers/FFmpegEngineProvider';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <FFmpegEngineProvider>
      <StudioAdLayout>{children}</StudioAdLayout>
    </FFmpegEngineProvider>
  );
}
