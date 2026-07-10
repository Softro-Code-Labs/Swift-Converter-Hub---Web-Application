export type RotationDegrees = 0 | 90 | 180 | 270;

export interface PageRotation {
  pageIndex: number;
  currentRotation: RotationDegrees;
  thumbUrl: string | null;
  loaded: boolean;
}

export interface RotateResult {
  url: string;
  pageCount: number;
  sizeLabel: string;
}

export const ROTATION_STEPS = [0, 90, 180, 270] as const;

export function addRotation(
  current: RotationDegrees,
  add: 90 | -90 | 180,
): RotationDegrees {
  const next = (((current + add) % 360) + 360) % 360;
  return next as RotationDegrees;
}
