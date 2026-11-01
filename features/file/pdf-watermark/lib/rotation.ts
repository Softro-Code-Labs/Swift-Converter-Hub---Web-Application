/**
 * pdf-lib rotates text and images around their bottom-left corner. To rotate
 * around the centre (as the on-screen preview does), work out where the
 * bottom-left corner must go so the box's centre lands on (cx, cy).
 */
export function originForCenter(
  cx: number,
  cy: number,
  width: number,
  height: number,
  angleDeg: number,
): { x: number; y: number } {
  const t = (angleDeg * Math.PI) / 180;
  const dx = (width / 2) * Math.cos(t) - (height / 2) * Math.sin(t);
  const dy = (width / 2) * Math.sin(t) + (height / 2) * Math.cos(t);
  return { x: cx - dx, y: cy - dy };
}
