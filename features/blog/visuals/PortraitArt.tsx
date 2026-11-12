/* ---------------------------------------------------------------------------
   Illustrated "photo" for the background-removal article: a person in front
   of an outdoor scene. All shapes share one 400x300 coordinate space so the
   same pieces can be used as the photo, the mask and the cut-out.
--------------------------------------------------------------------------- */

export const ART_W = 400;
export const ART_H = 300;

/** The background scene: sky, sun, hills and a tree. */
export function Scene({ id }: { id: string }) {
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7cc4f2" />
          <stop offset="1" stopColor="#dff1fb" />
        </linearGradient>
      </defs>
      <rect width={ART_W} height={ART_H} fill={`url(#${id}-sky)`} />
      <circle cx="322" cy="62" r="30" fill="#fde68a" />
      <path d="M0 210 C 80 170, 150 190, 220 200 C 290 210, 340 175, 400 185 L 400 300 L 0 300 Z" fill="#86c58a" />
      <path d="M0 245 C 90 225, 180 240, 260 236 C 320 233, 370 222, 400 228 L 400 300 L 0 300 Z" fill="#5fa866" />
      <rect x="52" y="150" width="10" height="70" fill="#7a5537" />
      <circle cx="57" cy="140" r="30" fill="#3f8f4a" />
      <circle cx="40" cy="155" r="20" fill="#4a9c55" />
      <circle cx="76" cy="156" r="20" fill="#4a9c55" />
    </g>
  );
}

/** The person - head, hair, neck and shoulders. */
export function Subject() {
  return (
    <g>
      <path d="M95 300 C 100 222, 150 196, 200 196 C 250 196, 300 222, 305 300 Z" fill="#0f766e" />
      <path d="M176 196 L 200 226 L 224 196 Z" fill="#e9b48a" />
      <rect x="182" y="150" width="36" height="52" rx="10" fill="#dca37a" />
      <circle cx="200" cy="118" r="46" fill="#e9b48a" />
      <path d="M152 116 C 150 70, 182 58, 204 60 C 236 62, 252 84, 248 118 C 240 96, 222 86, 200 88 C 178 90, 160 98, 152 116 Z" fill="#3b2a20" />
      <circle cx="183" cy="122" r="4" fill="#3b2a20" />
      <circle cx="217" cy="122" r="4" fill="#3b2a20" />
      <path d="M186 142 Q 200 152, 214 142" stroke="#a5653f" strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  );
}

/** Solid silhouette of the subject (used to build masks). */
export function Silhouette({ fill = '#fff' }: { fill?: string }) {
  return (
    <g fill={fill}>
      <path d="M95 300 C 100 222, 150 196, 200 196 C 250 196, 300 222, 305 300 Z" />
      <rect x="182" y="150" width="36" height="52" rx="10" />
      <circle cx="200" cy="118" r="46" />
      <path d="M152 116 C 150 70, 182 58, 204 60 C 236 62, 252 84, 248 118 Z" />
    </g>
  );
}

/** Grey-and-white checkerboard: the usual way to show "transparent". */
export function Checkerboard({ id }: { id: string }) {
  return (
    <g>
      <defs>
        <pattern id={`${id}-check`} width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#ffffff" />
          <rect width="10" height="10" fill="#e2e5ea" />
          <rect x="10" y="10" width="10" height="10" fill="#e2e5ea" />
        </pattern>
      </defs>
      <rect width={ART_W} height={ART_H} fill={`url(#${id}-check)`} />
    </g>
  );
}
