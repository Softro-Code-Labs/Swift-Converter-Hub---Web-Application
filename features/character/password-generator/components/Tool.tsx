'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import {
  Check,
  ChevronDown,
  Copy,
  Download,
  KeyRound,
  ListPlus,
  RefreshCw,
  ShieldCheck,
  SpellCheck2,
  Hash,
  TriangleAlert,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Switch } from '@/features/shared/components';
import { cn } from '@/lib/utils';
import {
  CHARSETS,
  DEFAULT_PASSWORD_OPTIONS,
  DEFAULT_PASSPHRASE_OPTIONS,
  DEFAULT_PIN_OPTIONS,
  STRENGTH_LABELS,
  crackTime,
  generatePassphrase,
  generatePassword,
  generatePin,
  passphraseEntropy,
  passwordEntropy,
  pinEntropy,
  resolvePools,
  strengthLevel,
  validatePassword,
  type CharsetId,
  type PassphraseOptions,
  type PasswordOptions,
  type PinOptions,
  type WordCase,
} from '../lib/generate';

type Mode = 'password' | 'passphrase' | 'pin';

const PREFS_KEY = 'sch-password-prefs';

interface Prefs {
  mode: Mode;
  password: PasswordOptions;
  passphrase: PassphraseOptions;
  pin: PinOptions;
}

const DEFAULT_PREFS: Prefs = {
  mode: 'password',
  password: DEFAULT_PASSWORD_OPTIONS,
  passphrase: DEFAULT_PASSPHRASE_OPTIONS,
  pin: DEFAULT_PIN_OPTIONS,
};

/** Settings only - generated passwords are never stored. */
function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    const p = JSON.parse(raw) as Partial<Prefs>;
    return {
      mode: p.mode ?? 'password',
      password: {
        ...DEFAULT_PASSWORD_OPTIONS,
        ...p.password,
        sets: { ...DEFAULT_PASSWORD_OPTIONS.sets, ...p.password?.sets },
      },
      passphrase: { ...DEFAULT_PASSPHRASE_OPTIONS, ...p.passphrase },
      pin: { ...DEFAULT_PIN_OPTIONS, ...p.pin },
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

const PRESETS: {
  id: string;
  label: string;
  hint: string;
  o: Partial<PasswordOptions>;
}[] = [
  {
    id: 'strong',
    label: 'Strong',
    hint: '16 characters, every type',
    o: { ...DEFAULT_PASSWORD_OPTIONS },
  },
  {
    id: 'easy',
    label: 'Easy to type',
    hint: 'No symbols or look-alikes',
    o: {
      ...DEFAULT_PASSWORD_OPTIONS,
      length: 14,
      sets: { upper: true, lower: true, digits: true, symbols: false },
      excludeLookAlikes: true,
    },
  },
  {
    id: 'wifi',
    label: 'Wi-Fi key',
    hint: '20 characters, no confusing symbols',
    o: {
      ...DEFAULT_PASSWORD_OPTIONS,
      length: 20,
      excludeLookAlikes: true,
      excludeAmbiguous: true,
    },
  },
  {
    id: 'max',
    label: 'Maximum',
    hint: '32 characters',
    o: { ...DEFAULT_PASSWORD_OPTIONS, length: 32, minDigits: 2, minSymbols: 2 },
  },
];

const SET_TILES: { id: CharsetId; label: string; sample: string }[] = [
  { id: 'upper', label: 'Uppercase', sample: 'ABC' },
  { id: 'lower', label: 'Lowercase', sample: 'abc' },
  { id: 'digits', label: 'Numbers', sample: '123' },
  { id: 'symbols', label: 'Symbols', sample: '#$&' },
];

const STRENGTH_STYLES = [
  { bar: 'bg-red-500', text: 'text-red-600 dark:text-red-400' },
  { bar: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400' },
  { bar: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' },
  { bar: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
  { bar: 'bg-emerald-600', text: 'text-emerald-700 dark:text-emerald-400' },
];

const SEPARATORS = [
  { value: '-', label: '-' },
  { value: '.', label: '.' },
  { value: '_', label: '_' },
  { value: ' ', label: 'Space' },
  { value: '', label: 'None' },
];

const CASES: { value: WordCase; label: string }[] = [
  { value: 'title', label: 'Title' },
  { value: 'lower', label: 'lower' },
  { value: 'upper', label: 'UPPER' },
  { value: 'random', label: 'rAnDoM' },
];

// --- Small building blocks ----------------------------------------------------

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </legend>
      <div className="grid grid-flow-col auto-cols-fr gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
        {options.map((o) => (
          <button
            key={o.label}
            type="button"
            aria-pressed={value === o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              'rounded-md px-2 py-1.5 text-[13px] font-medium transition-colors',
              value === o.value
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-600 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white',
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function RangeField({
  id,
  label,
  value,
  min,
  max,
  onChange,
  unit,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  unit: string;
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v)));
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label
          htmlFor={id}
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
        <div className="flex items-center gap-1.5">
          <input
            type="number"
            inputMode="numeric"
            aria-label={`${label} (number)`}
            min={min}
            max={max}
            value={value}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (Number.isFinite(n) && e.target.value !== '')
                onChange(clamp(n));
            }}
            className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1 text-right text-sm font-semibold tabular-nums text-slate-900 focus:border-blue-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {unit}
          </span>
        </div>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(clamp(Number(e.target.value)))}
        className="w-full accent-blue-600"
      />
      <div className="mt-1 flex justify-between text-xs text-slate-400 tabular-nums dark:text-slate-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function NumberStepper({
  label,
  value,
  onChange,
  max,
  disabled,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  max: number;
  disabled?: boolean;
}) {
  return (
    <label
      className={cn(
        'flex items-center justify-between gap-3 text-[13px] font-medium text-slate-700 dark:text-slate-300',
        disabled && 'opacity-50',
      )}
    >
      {label}
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(e) => {
          const n = Math.round(Number(e.target.value));
          if (Number.isFinite(n) && e.target.value !== '')
            onChange(Math.min(max, Math.max(1, n)));
        }}
        className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1 text-right text-sm tabular-nums text-slate-900 focus:border-blue-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      />
    </label>
  );
}

/** Colours digits and symbols so a password is easier to read back. */
function ColouredPassword({ value }: { value: string }) {
  return (
    <span className="min-w-0">
      {[...value].map((c, i) => (
        <span
          key={i}
          className={
            /\d/.test(c)
              ? 'text-blue-600 dark:text-blue-400'
              : /[A-Za-z]/.test(c)
                ? undefined
                : 'text-rose-600 dark:text-rose-400'
          }
        >
          {c}
        </span>
      ))}
    </span>
  );
}

async function copyText(text: string, what = 'Password') {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${what} copied`);
    return true;
  } catch {
    toast.error("Couldn't copy - select the text and copy it manually.");
    return false;
  }
}

// --- Tool ---------------------------------------------------------------------

const noop = () => () => {};

export default function PasswordGeneratorTool() {
  // Passwords and saved settings only exist in the browser, so the tool
  // renders after hydration (server and client markup stay identical).
  const mounted = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  if (!mounted) {
    return (
      <div
        aria-hidden
        className="h-[420px] animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800/60"
      />
    );
  }
  return <Generator />;
}

function Generator() {
  const [prefs, setPrefs] = useState<Prefs>(loadPrefs);
  const [nonce, setNonce] = useState(0);
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [wordlist, setWordlist] = useState<readonly string[] | null>(null);
  const [bulkCount, setBulkCount] = useState(10);
  const [bulk, setBulk] = useState<string[]>([]);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const { mode, password: pw, passphrase: pp, pin } = prefs;

  // Only settings are remembered - never generated passwords.
  useEffect(() => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch {
      /* private mode - settings just aren't remembered */
    }
  }, [prefs]);

  // The word list is ~60 KB, so it's only fetched when passphrases are used.
  useEffect(() => {
    if (mode !== 'passphrase' || wordlist) return;
    let live = true;
    import('../lib/effWordlist').then((m) => {
      if (live) setWordlist(m.EFF_WORDLIST);
    });
    return () => {
      live = false;
    };
  }, [mode, wordlist]);

  const error = mode === 'password' ? validatePassword(pw) : null;

  const makeOne = useCallback((): string | null => {
    if (mode === 'password') return generatePassword(pw);
    if (mode === 'pin') return generatePin(pin);
    return wordlist ? generatePassphrase(pp, wordlist) : null;
  }, [mode, pw, pp, pin, wordlist]);

  // A fresh value whenever the settings change or "New" is pressed.
  const value = useMemo(
    () => (error ? '' : (makeOne() ?? '')),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [makeOne, error, nonce],
  );
  const copied = !!value && copiedValue === value;
  const regenerate = () => setNonce((n) => n + 1);

  const bits = useMemo(() => {
    if (mode === 'password') return passwordEntropy(pw);
    if (mode === 'pin') return pinEntropy(pin);
    return passphraseEntropy(pp, 7776);
  }, [mode, pw, pp, pin]);
  const level = strengthLevel(bits);
  const style = STRENGTH_STYLES[level];

  const setMode = (m: Mode) => {
    setPrefs((p) => ({ ...p, mode: m }));
    setBulk([]);
  };
  const setPw = (o: Partial<PasswordOptions>) =>
    setPrefs((p) => ({ ...p, password: { ...p.password, ...o } }));
  const setPp = (o: Partial<PassphraseOptions>) =>
    setPrefs((p) => ({ ...p, passphrase: { ...p.passphrase, ...o } }));
  const setPin = (o: Partial<PinOptions>) =>
    setPrefs((p) => ({ ...p, pin: { ...p.pin, ...o } }));

  const handleCopy = async () => {
    if (!value || error) return;
    if (
      await copyText(
        value,
        mode === 'pin'
          ? 'PIN'
          : mode === 'passphrase'
            ? 'Passphrase'
            : 'Password',
      )
    ) {
      setCopiedValue(value);
      clearTimeout(copiedTimer.current);
      copiedTimer.current = setTimeout(() => setCopiedValue(null), 2000);
    }
  };

  const makeBulk = () => {
    if (error) return;
    const list: string[] = [];
    for (let i = 0; i < bulkCount; i++) {
      const v = makeOne();
      if (v) list.push(v);
    }
    setBulk(list);
  };

  const downloadBulk = () => {
    const blob = new Blob([bulk.join('\n') + '\n'], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${mode === 'pin' ? 'pins' : mode === 'passphrase' ? 'passphrases' : 'passwords'}.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const pools = resolvePools(pw);
  const poolSize = new Set(Object.values(pools).join('')).size;
  const activePreset = PRESETS.find(
    (p) =>
      JSON.stringify({ ...DEFAULT_PASSWORD_OPTIONS, ...p.o }) ===
      JSON.stringify(pw),
  )?.id;

  return (
    <div className="space-y-5">
      {/* Mode */}
      <div
        role="group"
        aria-label="What to generate"
        className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800 @xl:max-w-md"
      >
        {(
          [
            { id: 'password', label: 'Password', icon: KeyRound },
            { id: 'passphrase', label: 'Passphrase', icon: SpellCheck2 },
            { id: 'pin', label: 'PIN', icon: Hash },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={mode === t.id}
            onClick={() => setMode(t.id)}
            className={cn(
              'flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
              mode === t.id
                ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-600 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white',
            )}
          >
            <t.icon className="h-4 w-4" aria-hidden />
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 @3xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        {/* Result */}
        <div className="space-y-5">
          <section
            aria-label="Generated result"
            className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
          >
            <div
              aria-live="polite"
              className={cn(
                'flex min-h-[96px] items-center rounded-xl bg-slate-50 px-4 py-4 font-mono leading-snug tracking-wide text-slate-900 wrap-anywhere dark:bg-slate-800/60 dark:text-white',
                value.length > 40
                  ? 'text-lg'
                  : value.length > 24
                    ? 'text-xl'
                    : 'text-2xl @xl:text-3xl',
              )}
            >
              {error ? (
                <span className="flex items-start gap-2 font-sans text-sm font-medium tracking-normal text-red-600 dark:text-red-400">
                  <TriangleAlert
                    className="mt-0.5 h-4 w-4 shrink-0"
                    aria-hidden
                  />
                  {error}
                </span>
              ) : value ? (
                <ColouredPassword value={value} />
              ) : (
                <span className="text-slate-400">Generating…</span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!value || !!error}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50 sm:flex-none"
              >
                {copied ? (
                  <Check className="h-4 w-4" aria-hidden />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden />
                )}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                type="button"
                onClick={regenerate}
                disabled={!!error}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:flex-none"
              >
                <RefreshCw className="h-4 w-4" aria-hidden />
                New {mode === 'pin' ? 'PIN' : mode}
              </button>
            </div>

            {/* Strength */}
            {!error && (
              <div className="mt-5">
                <div className="flex items-baseline justify-between gap-3">
                  <p className={cn('text-sm font-semibold', style.text)}>
                    {STRENGTH_LABELS[level]}
                  </p>
                  <p className="text-xs text-slate-500 tabular-nums dark:text-slate-400">
                    {Math.round(bits)} bits of entropy
                  </p>
                </div>
                <div className="mt-2 grid grid-cols-5 gap-1" aria-hidden>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        'h-1.5 rounded-full transition-colors',
                        i <= level
                          ? style.bar
                          : 'bg-slate-200 dark:bg-slate-700',
                      )}
                    />
                  ))}
                </div>
                <p className="mt-2 text-[13px] text-slate-600 dark:text-slate-400">
                  Time to crack:{' '}
                  <strong className="font-semibold text-slate-900 dark:text-white">
                    {crackTime(bits)}
                  </strong>{' '}
                  <span className="text-slate-500 dark:text-slate-500">
                    (10 billion guesses a second)
                  </span>
                </p>
                {mode === 'pin' && (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    PINs are only safe where the number of tries is limited,
                    like a phone or bank card.
                  </p>
                )}
              </div>
            )}
          </section>

          {/* Bulk */}
          <section
            aria-label="Generate a list"
            className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-wrap items-end gap-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                How many
                <input
                  type="number"
                  inputMode="numeric"
                  min={2}
                  max={100}
                  value={bulkCount}
                  onChange={(e) => {
                    const n = Math.round(Number(e.target.value));
                    if (Number.isFinite(n))
                      setBulkCount(Math.min(100, Math.max(2, n)));
                  }}
                  className="mt-1.5 block w-24 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm tabular-nums text-slate-900 focus:border-blue-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </label>
              <button
                type="button"
                onClick={makeBulk}
                disabled={!!error || (mode === 'passphrase' && !wordlist)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <ListPlus className="h-4 w-4" aria-hidden />
                Generate a list
              </button>
              {bulk.length > 0 && (
                <div className="ml-auto flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      copyText(bulk.join('\n'), `${bulk.length} items`)
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold text-blue-700 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-950/40"
                  >
                    <Copy className="h-3.5 w-3.5" aria-hidden />
                    Copy all
                  </button>
                  <button
                    type="button"
                    onClick={downloadBulk}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold text-blue-700 hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-blue-950/40"
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden />
                    .txt
                  </button>
                </div>
              )}
            </div>
            {bulk.length > 0 && (
              <ol className="mt-4 max-h-80 divide-y divide-slate-100 overflow-y-auto rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                {bulk.map((b, i) => (
                  <li key={i} className="flex items-center gap-3 px-3 py-2">
                    <span className="w-6 shrink-0 text-right text-xs text-slate-400 tabular-nums">
                      {i + 1}
                    </span>
                    <span className="min-w-0 flex-1 wrap-anywhere font-mono text-sm text-slate-800 dark:text-slate-200">
                      {b}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyText(b)}
                      aria-label={`Copy item ${i + 1}`}
                      className="shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        {/* Settings */}
        <section
          aria-label="Settings"
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
        >
          {mode === 'password' && (
            <>
              <fieldset>
                <legend className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Quick presets
                </legend>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      title={p.hint}
                      aria-pressed={activePreset === p.id}
                      onClick={() =>
                        setPw({ ...DEFAULT_PASSWORD_OPTIONS, ...p.o })
                      }
                      className={cn(
                        'rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors',
                        activePreset === p.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950/40 dark:text-blue-300'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white',
                      )}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <RangeField
                id="pw-length"
                label="Length"
                unit="characters"
                value={pw.length}
                min={4}
                max={128}
                onChange={(length) => setPw({ length })}
              />

              <fieldset>
                <legend className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Include
                </legend>
                <div className="grid grid-cols-2 gap-2 @md:grid-cols-4 @3xl:grid-cols-2 @5xl:grid-cols-4">
                  {SET_TILES.map((t) => {
                    const on = pw.sets[t.id];
                    return (
                      <button
                        key={t.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() =>
                          setPw({ sets: { ...pw.sets, [t.id]: !on } })
                        }
                        className={cn(
                          'flex flex-col items-start rounded-xl border px-3 py-2.5 text-left transition-colors',
                          on
                            ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40'
                            : 'border-slate-200 hover:border-slate-300 dark:border-slate-700',
                        )}
                      >
                        <span className="flex w-full items-center justify-between">
                          <span
                            className={cn(
                              'font-mono text-base font-semibold',
                              on
                                ? 'text-blue-700 dark:text-blue-300'
                                : 'text-slate-500',
                            )}
                          >
                            {t.sample}
                          </span>
                          <span
                            aria-hidden
                            className={cn(
                              'flex h-4 w-4 items-center justify-center rounded border',
                              on
                                ? 'border-blue-600 bg-blue-600 text-white dark:border-blue-400 dark:bg-blue-400 dark:text-slate-900'
                                : 'border-slate-300 dark:border-slate-600',
                            )}
                          >
                            {on && (
                              <Check className="h-3 w-3" strokeWidth={3} />
                            )}
                          </span>
                        </span>
                        <span className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                          {t.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Drawing from {poolSize} different characters.
                </p>
              </fieldset>

              {/* Advanced */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  aria-expanded={advancedOpen}
                  onClick={() => setAdvancedOpen((v) => !v)}
                  className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200"
                >
                  Advanced options
                  <ChevronDown
                    aria-hidden
                    className={cn(
                      'h-4 w-4 text-slate-400 transition-transform',
                      advancedOpen && 'rotate-180',
                    )}
                  />
                </button>
                {advancedOpen && (
                  <div className="space-y-4 border-t border-slate-200 px-4 py-4 dark:border-slate-800">
                    <div className="space-y-3">
                      <Switch
                        className="flex w-full items-start text-left"
                        checked={pw.excludeLookAlikes}
                        onChange={(v) => setPw({ excludeLookAlikes: v })}
                        label="Avoid look-alikes such as I, l, 1, O and 0"
                      />
                      <Switch
                        className="flex w-full items-start text-left"
                        checked={pw.excludeAmbiguous}
                        onChange={(v) => setPw({ excludeAmbiguous: v })}
                        label="Avoid brackets, quotes and slashes"
                      />
                      <Switch
                        className="flex w-full items-start text-left"
                        checked={pw.noRepeats}
                        onChange={(v) => setPw({ noRepeats: v })}
                        label="No repeated characters"
                      />
                      <Switch
                        className="flex w-full items-start text-left"
                        checked={pw.startWithLetter}
                        onChange={(v) => setPw({ startWithLetter: v })}
                        label="Start with a letter"
                      />
                    </div>
                    <div className="grid gap-3 @md:grid-cols-2 @3xl:grid-cols-1 @5xl:grid-cols-2">
                      <NumberStepper
                        label="At least this many numbers"
                        value={pw.minDigits}
                        max={20}
                        disabled={!pw.sets.digits}
                        onChange={(minDigits) => setPw({ minDigits })}
                      />
                      <NumberStepper
                        label="At least this many symbols"
                        value={pw.minSymbols}
                        max={20}
                        disabled={!pw.sets.symbols}
                        onChange={(minSymbols) => setPw({ minSymbols })}
                      />
                    </div>
                    <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-300">
                      Symbols to use
                      <input
                        type="text"
                        spellCheck={false}
                        autoComplete="off"
                        value={pw.customSymbols}
                        placeholder={CHARSETS.symbols}
                        onChange={(e) =>
                          setPw({ customSymbols: e.target.value })
                        }
                        className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                      <span className="mt-1 block text-xs font-normal text-slate-500 dark:text-slate-400">
                        Leave empty for the default set. Handy when a site only
                        allows certain symbols.
                      </span>
                    </label>
                    <label className="block text-[13px] font-medium text-slate-700 dark:text-slate-300">
                      Never use these characters
                      <input
                        type="text"
                        spellCheck={false}
                        autoComplete="off"
                        value={pw.excludeChars}
                        placeholder="e.g. %&amp;'"
                        onChange={(e) =>
                          setPw({ excludeChars: e.target.value })
                        }
                        className="mt-1.5 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setPw(DEFAULT_PASSWORD_OPTIONS)}
                      className="text-[13px] font-semibold text-blue-700 hover:underline dark:text-blue-300"
                    >
                      Reset to defaults
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {mode === 'passphrase' && (
            <>
              <RangeField
                id="pp-words"
                label="Words"
                unit="words"
                value={pp.words}
                min={3}
                max={12}
                onChange={(words) => setPp({ words })}
              />
              <Segmented
                label="Separator"
                value={pp.separator}
                options={SEPARATORS}
                onChange={(separator) => setPp({ separator })}
              />
              <Segmented
                label="Capitals"
                value={pp.wordCase}
                options={CASES}
                onChange={(wordCase) => setPp({ wordCase })}
              />
              <div className="space-y-3">
                <Switch
                  className="flex w-full items-start text-left"
                  checked={pp.addNumber}
                  onChange={(addNumber) => setPp({ addNumber })}
                  label="Add a number"
                />
                <Switch
                  className="flex w-full items-start text-left"
                  checked={pp.addSymbol}
                  onChange={(addSymbol) => setPp({ addSymbol })}
                  label="Add a symbol"
                />
              </div>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Words come from the EFF long word list (7,776 common words).
                Five random words are stronger than most 10-character passwords
                and far easier to remember and type.
              </p>
            </>
          )}

          {mode === 'pin' && (
            <>
              <RangeField
                id="pin-length"
                label="Digits"
                unit="digits"
                value={pin.length}
                min={4}
                max={12}
                onChange={(length) => setPin({ length })}
              />
              <Switch
                className="flex w-full items-start text-left"
                checked={pin.avoidCommon}
                onChange={(avoidCommon) => setPin({ avoidCommon })}
                label="Avoid guessable PINs (1234, 1111, years…)"
              />
            </>
          )}

          <p className="flex items-start gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs leading-relaxed text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            Generated on your device with your browser’s secure random number
            generator. Nothing is sent anywhere or saved - only your settings
            are remembered.
          </p>
        </section>
      </div>
    </div>
  );
}
