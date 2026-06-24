interface BitPatternProps {
  binary: string; // may include spaces
  bits: number;
}

const BIT_WIDTHS = [8, 16, 32, 64];

export function BitPattern({ binary, bits }: BitPatternProps) {
  if (!binary) return null;

  // Choose the smallest standard width that fits
  const width = BIT_WIDTHS.find((w) => w >= bits) ?? Math.ceil(bits / 8) * 8;

  // Pad binary to width (strip spaces first)
  const raw = binary.replace(/\s/g, '');
  const padded = raw.padStart(width, '0');

  // Split into nibbles (groups of 4)
  const nibbles: string[] = [];
  for (let i = 0; i < padded.length; i += 4) {
    nibbles.push(padded.slice(i, i + 4));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Bit pattern
        </p>
        <span className="text-[10px] font-bold text-lime-600 dark:text-lime-400">
          {width}-bit · {bits} significant bit{bits !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Bit grid */}
      <div className="flex flex-wrap gap-1">
        {nibbles.map((nibble, ni) => (
          <div key={ni} className="flex gap-px">
            {nibble.split('').map((bit, bi) => {
              const pos = ni * 4 + bi;
              const bitIndex = width - 1 - pos; // MSB = leftmost
              return (
                <div
                  key={bi}
                  title={`Bit ${bitIndex}`}
                  className={`relative flex flex-col items-center`}
                >
                  <div
                    className={`w-6 h-6 rounded-sm flex items-center justify-center text-[11px] font-black font-mono transition-colors
                    ${
                      bit === '1'
                        ? 'bg-lime-400 dark:bg-lime-500 text-slate-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600'
                    }`}
                  >
                    {bit}
                  </div>
                </div>
              );
            })}
            {/* Byte separator */}
            {(ni + 1) % 2 === 0 && ni < nibbles.length - 1 && (
              <div className="w-px mx-1 bg-slate-200 dark:bg-slate-700 self-stretch" />
            )}
          </div>
        ))}
      </div>

      {/* Byte labels */}
      <div className="flex flex-wrap gap-1 text-[9px] font-bold text-slate-300 dark:text-slate-600 font-mono">
        {Array.from({ length: width / 8 }, (_, i) => {
          const byteIndex = width / 8 - 1 - i;
          return (
            <span
              key={i}
              className="w-[52px] text-center"
              style={{ marginLeft: i > 0 && i % 1 === 0 ? '2px' : '0' }}
            >
              byte {byteIndex}
            </span>
          );
        })}
      </div>
    </div>
  );
}
