import {
  Camera,
  Aperture,
  Calendar,
  FileText,
  User,
  Copy,
  Check,
} from 'lucide-react';
import { useState } from 'react';
import { MetadataCategory } from '../types/metadata';

const ICON_MAP: Record<string, typeof Camera> = {
  camera: Camera,
  aperture: Aperture,
  calendar: Calendar,
  file: FileText,
  user: User,
};

const COLOR_MAP: Record<string, string> = {
  camera: 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400',
  aperture:
    'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
  calendar:
    'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
  file: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
  user: 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
};

export const MetadataSection = ({
  category,
}: {
  category: MetadataCategory;
}) => {
  const Icon = ICON_MAP[category.icon] ?? FileText;
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyValue = (key: string, value: string) => {
    navigator.clipboard?.writeText(value).catch(() => {});
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-lg ${COLOR_MAP[category.icon]}`}
        >
          <Icon className="w-3.5 h-3.5" />
        </div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          {category.title}
        </p>
        <span className="text-xs text-slate-400 ml-auto">
          {category.fields.length}
        </span>
      </div>
      <dl className="divide-y divide-slate-100 dark:divide-slate-800">
        {category.fields.map((field) => (
          <div
            key={field.key}
            className="group grid grid-cols-[minmax(6rem,40%)_1fr_auto] items-start gap-3 px-4 py-2.5"
          >
            <dt className="text-[13px] text-slate-500 dark:text-slate-400">
              {field.label}
            </dt>
            <dd className="min-w-0 break-words text-[13px] font-semibold text-slate-900 dark:text-slate-100">
              {field.value}
            </dd>
            <button
              type="button"
              onClick={() => copyValue(field.key, field.value)}
              aria-label={`Copy ${field.label}`}
              title="Copy"
              className="-my-1 rounded p-1 text-slate-400 opacity-60 transition hover:text-blue-600 group-hover:opacity-100 focus-visible:opacity-100 dark:hover:text-blue-300"
            >
              {copiedKey === field.key ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        ))}
      </dl>
    </div>
  );
};
