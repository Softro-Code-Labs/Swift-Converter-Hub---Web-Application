export type Base = 2 | 8 | 10 | 16;

export interface BaseInfo {
  base: Base;
  label: string;
  prefix: string;
  placeholder: string;
  chars: string;
  groupSize: number; // chars per group for display
  color: {
    border: string;
    ring: string;
    label: string;
    prefix: string;
  };
}

export interface ConversionResult {
  binary: string;
  octal: string;
  decimal: string;
  hex: string;
  value: bigint | null; // null = invalid
  bits: number; // bit length of value
  isNegative: boolean;
  error: string | null;
}

export const BASE_INFO: Record<Base, BaseInfo> = {
  2: {
    base: 2,
    label: 'Binary',
    prefix: '0b',
    placeholder: '1010 1111',
    chars: '01',
    groupSize: 4,
    color: {
      border: 'border-lime-400 dark:border-lime-600',
      ring: 'focus:ring-lime-400/30',
      label: 'text-lime-700 dark:text-lime-300',
      prefix: 'text-lime-400 dark:text-lime-600',
    },
  },
  8: {
    base: 8,
    label: 'Octal',
    prefix: '0o',
    placeholder: '257',
    chars: '01234567',
    groupSize: 3,
    color: {
      border: 'border-sky-400 dark:border-sky-600',
      ring: 'focus:ring-sky-400/30',
      label: 'text-sky-700 dark:text-sky-300',
      prefix: 'text-sky-400 dark:text-sky-600',
    },
  },
  10: {
    base: 10,
    label: 'Decimal',
    prefix: '',
    placeholder: '255',
    chars: '0123456789',
    groupSize: 3,
    color: {
      border: 'border-amber-400 dark:border-amber-600',
      ring: 'focus:ring-amber-400/30',
      label: 'text-amber-700 dark:text-amber-300',
      prefix: 'text-amber-400 dark:text-amber-600',
    },
  },
  16: {
    base: 16,
    label: 'Hexadecimal',
    prefix: '0x',
    placeholder: 'FF',
    chars: '0123456789ABCDEFabcdef',
    groupSize: 2,
    color: {
      border: 'border-violet-400 dark:border-violet-600',
      ring: 'focus:ring-violet-400/30',
      label: 'text-violet-700 dark:text-violet-300',
      prefix: 'text-violet-400 dark:text-violet-600',
    },
  },
};
