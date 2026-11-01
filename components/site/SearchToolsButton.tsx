'use client';

import { Search } from 'lucide-react';
import { openCommandMenu } from '@/components/shell/CommandMenu';

export function SearchToolsButton({
  label = 'Search tools',
}: {
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => openCommandMenu()}
      className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-[15px] font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
    >
      <Search className="h-4 w-4" aria-hidden />
      {label}
    </button>
  );
}
