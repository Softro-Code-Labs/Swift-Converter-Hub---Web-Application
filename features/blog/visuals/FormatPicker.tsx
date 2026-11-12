'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ChoiceGroup } from './ChoiceGroup';

type Kind = 'photo' | 'graphic' | 'screenshot';
type YesNo = 'yes' | 'no';

interface Answer {
  format: string;
  why: string;
  fallback?: string;
  convert: { label: string; href: string };
}

/** Mirrors the decision framework written in the article. */
function recommend(kind: Kind, transparent: YesNo, legacy: YesNo): Answer {
  if (legacy === 'yes') {
    if (transparent === 'yes' || kind !== 'photo') {
      return {
        format: 'PNG',
        why: 'Old software reads PNG everywhere, and it keeps transparency and sharp edges without any loss.',
        convert: { label: 'JPG to PNG', href: '/image/convert/jpg-to-png' },
      };
    }
    return {
      format: 'JPEG',
      why: 'For a photo that has to open in old email clients or legacy systems, nothing beats JPEG’s compatibility.',
      convert: { label: 'PNG to JPG', href: '/image/convert/png-to-jpg' },
    };
  }
  if (kind === 'photo') {
    return {
      format: 'AVIF',
      why: 'The smallest files for photos at the same visual quality, with transparency if you need it.',
      fallback:
        'Encoding thousands of images on the fly? Use WebP instead - it encodes much faster.',
      convert: { label: 'JPG to AVIF', href: '/image/convert/jpg-to-avif' },
    };
  }
  if (kind === 'graphic') {
    return {
      format: 'PNG',
      why: 'Lossless compression keeps flat colours and crisp edges perfect - no smudges around text or lines.',
      fallback: 'Have the original vector file? SVG stays sharp at every size.',
      convert: { label: 'PNG to WebP', href: '/image/convert/png-to-webp' },
    };
  }
  return {
    format: 'PNG',
    why: 'Screenshots are mostly text and flat areas, where lossy formats leave visible fuzz around letters.',
    fallback: 'Lossless WebP is usually a little smaller and looks identical.',
    convert: { label: 'PNG to WebP', href: '/image/convert/png-to-webp' },
  };
}

export function FormatPicker() {
  const [kind, setKind] = useState<Kind>('photo');
  const [transparent, setTransparent] = useState<YesNo>('no');
  const [legacy, setLegacy] = useState<YesNo>('no');
  const answer = recommend(kind, transparent, legacy);

  return (
    <div className="grid gap-6 sm:grid-cols-[1fr_minmax(0,15rem)]">
      <div className="space-y-5">
        <ChoiceGroup
          label="What is the image?"
          value={kind}
          onChange={setKind}
          options={[
            { value: 'photo', label: 'A photo' },
            { value: 'graphic', label: 'Logo, icon or diagram' },
            { value: 'screenshot', label: 'Screenshot' },
          ]}
        />
        <ChoiceGroup
          label="Does it need a transparent background?"
          value={transparent}
          onChange={setTransparent}
          options={[
            { value: 'no', label: 'No' },
            { value: 'yes', label: 'Yes' },
          ]}
        />
        <ChoiceGroup
          label="Must it open in very old software?"
          value={legacy}
          onChange={setLegacy}
          options={[
            { value: 'no', label: 'No, modern browsers' },
            { value: 'yes', label: 'Yes, old apps too' },
          ]}
        />
      </div>

      <div
        aria-live="polite"
        className="flex flex-col rounded-xl bg-blue-50 p-5 dark:bg-blue-500/10"
      >
        <p className="flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          Use
        </p>
        <p className="mt-1 font-display text-5xl font-bold text-slate-900 dark:text-white">
          {answer.format}
        </p>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
          {answer.why}
        </p>
        {answer.fallback && (
          <p className="mt-2 text-[14px] leading-relaxed text-slate-500 dark:text-slate-400">
            {answer.fallback}
          </p>
        )}
        <Link
          href={answer.convert.href}
          className="mt-auto inline-flex items-center gap-1 pt-4 text-[14px] font-semibold text-blue-700 hover:underline dark:text-blue-300"
        >
          Convert {answer.convert.label}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
