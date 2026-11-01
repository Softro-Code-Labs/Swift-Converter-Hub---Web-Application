'use client';

import { StudioPageLayout } from '@/features/shared/studio/components/StudioPageLayout';

// Tools, groups and copy for this studio live in config/tools.ts.
export default function CharacterStudioClient() {
  return (
    <StudioPageLayout
      studioId="character"
      footerNote="Have a text tool idea?"
    />
  );
}
