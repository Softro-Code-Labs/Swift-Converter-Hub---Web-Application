'use client';

import { StudioPageLayout } from '@/features/shared/studio/components/StudioPageLayout';

// Tools, groups and copy for this studio live in config/tools.ts.
export default function AudioStudioClient() {
  return (
    <StudioPageLayout
      studioId="audio"
      footerNote="Need a specific audio tool?"
    />
  );
}
