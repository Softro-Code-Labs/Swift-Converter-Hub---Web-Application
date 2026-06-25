import type { GenerateType } from '../types/loremIpsum';

interface TypeSelectorProps {
  value: GenerateType;
  onChange: (v: GenerateType) => void;
}

const OPTIONS: { id: GenerateType; label: string; hint: string }[] = [
  { id: 'paragraphs', label: 'Paragraphs', hint: '4–6 sentences each' },
  { id: 'sentences', label: 'Sentences', hint: '6–18 words each' },
  { id: 'words', label: 'Words', hint: 'as a single block' },
];

export function TypeSelector({ value, onChange }: TypeSelectorProps) {
  return (
    <div className="flex gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
      {OPTIONS.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          title={opt.hint}
          className={`flex flex-col items-center px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all
            ${
              value === opt.id
                ? 'bg-white dark:bg-slate-700 text-orange-700 dark:text-orange-300 shadow-sm'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
        >
          {opt.label}
          <span
            className={`text-[9px] font-normal mt-0.5
            ${value === opt.id ? 'text-orange-400 dark:text-orange-500' : 'text-slate-300 dark:text-slate-600'}`}
          >
            {opt.hint}
          </span>
        </button>
      ))}
    </div>
  );
}
