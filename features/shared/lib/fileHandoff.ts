'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/* ---------------------------------------------------------------------------
   File handoff. When someone drops a file on the home page and then picks a
   tool, the file is kept in memory (never uploaded, never stored) and the
   tool page loads it automatically, so nobody has to choose the same file
   twice. It only survives client-side navigation and is consumed once.
--------------------------------------------------------------------------- */

let pending: { files: File[]; href: string } | null = null;

export function setFileHandoff(files: File[], href: string) {
  pending = { files, href };
}

export function clearFileHandoff() {
  pending = null;
}

export function peekFileHandoff() {
  return pending;
}

function matchesAccept(file: File, accept?: string) {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = (file.type || '').toLowerCase();
  return accept
    .split(',')
    .map((a) => a.trim().toLowerCase())
    .filter(Boolean)
    .some((rule) => {
      if (rule.startsWith('.')) return name.endsWith(rule);
      if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1));
      return type === rule;
    });
}

/**
 * Deliver a handed-off file to a tool once it is ready.
 * @param ready  pass false while an engine is still loading
 * @param accept the tool's accept string; files that don't match are left
 *               alone so the tool's own validation can explain why
 */
export function useFileHandoff(
  onFiles: (files: File[]) => void,
  { ready = true, accept }: { ready?: boolean; accept?: string } = {},
) {
  const pathname = usePathname();
  const cb = useRef(onFiles);
  useEffect(() => {
    cb.current = onFiles;
  });

  useEffect(() => {
    if (!ready || !pending) return;
    const { files, href } = pending;
    if (pathname !== href && !pathname.startsWith(`${href}/`)) return;
    const usable = accept
      ? files.filter((f) => matchesAccept(f, accept))
      : files;
    pending = null;
    if (usable.length) cb.current(usable);
  }, [ready, pathname, accept]);
}

/** Build a minimal drag-event stand-in so tools whose drop handlers expect
 *  a React.DragEvent can receive handed-off or surface-dropped files. */
export function dropEventFrom(files: FileList | File[]): React.DragEvent {
  let list: FileList;
  if (Array.isArray(files)) {
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    list = dt.files;
  } else list = files;
  return {
    preventDefault() {},
    stopPropagation() {},
    dataTransfer: { files: list },
  } as unknown as React.DragEvent;
}
