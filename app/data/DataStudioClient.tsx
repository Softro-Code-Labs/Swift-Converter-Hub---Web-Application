'use client';

import { StudioPageLayout } from '@/features/shared/studio/components/StudioPageLayout';

// Tools, groups and copy for this studio live in config/tools.ts.
export default function DataStudioClient() {
  return (
    <StudioPageLayout
      studioId="data"
      footerNote="Need a specific data converter?"
    />
  );
}
