import { ArrowRight, Box } from 'lucide-react';

interface Track {
  kind: string;
  codec: string;
  tone: 'video' | 'audio' | 'subs';
  changed?: boolean;
}

const TONE = {
  video: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-500/15 dark:text-fuchsia-200',
  audio: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200',
  subs: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
};

function Container({ name, tracks }: { name: string; tracks: Track[] }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-slate-300 p-3 dark:border-slate-600">
      <p className="mb-2 flex items-center gap-1.5 text-[13px] font-semibold text-slate-900 dark:text-white">
        <Box className="h-4 w-4 text-slate-400" aria-hidden />
        {name}
      </p>
      <ul className="space-y-1.5">
        {tracks.map((t) => (
          <li
            key={t.kind}
            className={`flex items-center justify-between rounded-md px-2.5 py-1.5 text-[13px] ${TONE[t.tone]} ${
              t.changed ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-slate-900' : ''
            }`}
          >
            <span>{t.kind}</span>
            <span className="font-semibold">{t.codec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Row({
  title,
  verdict,
  verdictTone,
  from,
  to,
}: {
  title: string;
  verdict: string;
  verdictTone: string;
  from: { name: string; tracks: Track[] };
  to: { name: string; tracks: Track[] };
}) {
  return (
    <div>
      <p className="mb-3 text-[14px] font-semibold text-slate-900 dark:text-white">
        {title} <span className={`ml-1 rounded-full px-2 py-0.5 text-[12px] font-semibold ${verdictTone}`}>{verdict}</span>
      </p>
      <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <Container {...from} />
        <ArrowRight className="mx-auto h-5 w-5 rotate-90 text-slate-400 sm:rotate-0" aria-hidden />
        <Container {...to} />
      </div>
    </div>
  );
}

const SOURCE: Track[] = [
  { kind: 'Video track', codec: 'H.264', tone: 'video' },
  { kind: 'Audio track', codec: 'AAC', tone: 'audio' },
  { kind: 'Subtitles', codec: 'English', tone: 'subs' },
];

/** A container is a box; codecs are what's inside it. */
export function ContainerDiagram() {
  return (
    <div className="space-y-8">
      <Row
        title="MOV → MP4: the tracks already fit"
        verdict="Remux · seconds · lossless"
        verdictTone="bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300"
        from={{ name: 'holiday.mov', tracks: SOURCE }}
        to={{ name: 'holiday.mp4', tracks: SOURCE }}
      />
      <Row
        title="MOV → WebM: WebM can't hold H.264 or AAC"
        verdict="Re-encode · slower"
        verdictTone="bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"
        from={{ name: 'holiday.mov', tracks: SOURCE }}
        to={{
          name: 'holiday.webm',
          tracks: [
            { kind: 'Video track', codec: 'VP9', tone: 'video', changed: true },
            { kind: 'Audio track', codec: 'Opus', tone: 'audio', changed: true },
            { kind: 'Subtitles', codec: 'English', tone: 'subs' },
          ],
        }}
      />
      <p className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400">
        <span className="inline-block h-3 w-3 rounded-sm ring-2 ring-amber-400" aria-hidden />
        Rebuilt track - decoded and compressed again
      </p>
    </div>
  );
}
