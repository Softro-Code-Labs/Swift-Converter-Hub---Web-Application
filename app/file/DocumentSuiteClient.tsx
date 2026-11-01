'use client';

import { StudioPageLayout } from '@/features/shared/studio/components/StudioPageLayout';

// Tools, groups and copy for this studio live in config/tools.ts.
export default function DocumentSuiteClient() {
  return (
    <StudioPageLayout
      studioId="file"
      footerNote="Need another document tool?"
    />
  );
}
