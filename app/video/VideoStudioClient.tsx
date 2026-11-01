'use client';

import { StudioPageLayout } from '@/features/shared/studio/components/StudioPageLayout';

// Tools, groups and copy for this studio live in config/tools.ts.
export default function VideoStudioClient() {
  return (
    <StudioPageLayout
      studioId="video"
      footerNote="Need a specific video tool?"
    />
  );
}
