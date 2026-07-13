import StudioAdLayout from '@/components/ads/StudioAdLayout';
import { MagickEngineProvider } from '@/features/image/shared/providers/MagickEngineProvider';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <MagickEngineProvider>
      <StudioAdLayout>{children}</StudioAdLayout>
    </MagickEngineProvider>
  );
}
