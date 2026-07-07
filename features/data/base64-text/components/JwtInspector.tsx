'use client';

import { useState } from 'react';
import { CheckCircle2, AlertTriangle, Clock, Copy, Check } from 'lucide-react';
import { inspectJwt } from '../hooks/useBase64';

interface JwtInspectorProps {
  token: string;
}

function CopyableJson({
  data,
  label,
  accent,
}: {
  data: Record<string, unknown> | null;
  label: string;
  accent: string;
}) {
  const [copied, setCopied] = useState(false);
  const text = data ? JSON.stringify(data, null, 2) : null;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <p
          className={`text-[10px] font-bold uppercase tracking-widest ${accent}`}
        >
          {label}
        </p>
        {text && (
          <button
            onClick={() => {
              navigator.clipboard.writeText(text);
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            }}
            className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-rose-600 cursor-pointer transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" /> Copy
              </>
            )}
          </button>
        )}
      </div>
      <pre className="text-[10px] font-mono text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 overflow-auto max-h-48 leading-relaxed">
        {text ?? <span className="text-red-400 italic">Failed to decode</span>}
      </pre>
    </div>
  );
}

function formatDate(d: Date): string {
  return d.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function JwtInspector({ token }: JwtInspectorProps) {
  const jwt = inspectJwt(token);

  if (jwt.error) {
    return (
      <div className="flex items-start gap-2 px-4 py-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl">
        <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
        <p className="text-[11px] text-red-600 dark:text-red-400 font-semibold">
          {jwt.error}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/50 rounded-2xl overflow-hidden">
      {/* JWT header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-rose-50 dark:bg-rose-950/20 border-b border-rose-100 dark:border-rose-900/40">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400">
            JWT Token
          </span>
          {jwt.header && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300">
              {String(jwt.header.alg ?? 'unknown')}
            </span>
          )}
        </div>

        {/* Expiry status */}
        {jwt.isExpired !== null && (
          <div
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold
            ${
              jwt.isExpired
                ? 'bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400'
                : 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {jwt.isExpired ? (
              <>
                <AlertTriangle className="w-3 h-3" /> Expired
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3 h-3" /> Valid
              </>
            )}
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Time info */}
        {(jwt.issuedAt || jwt.expiresAt) && (
          <div className="flex items-center gap-4 flex-wrap text-[10px] text-slate-500 dark:text-slate-400">
            {jwt.issuedAt && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Issued:{' '}
                <span className="font-semibold text-slate-700 dark:text-slate-300 ml-1">
                  {formatDate(jwt.issuedAt)}
                </span>
              </span>
            )}
            {jwt.expiresAt && (
              <span
                className={`flex items-center gap-1 ${jwt.isExpired ? 'text-red-500' : ''}`}
              >
                <Clock className="w-3 h-3" />
                Expires:{' '}
                <span
                  className={`font-semibold ml-1 ${jwt.isExpired ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'}`}
                >
                  {formatDate(jwt.expiresAt)}
                </span>
              </span>
            )}
          </div>
        )}

        {/* Three parts */}
        <CopyableJson
          data={jwt.header}
          label="Header"
          accent="text-rose-600 dark:text-rose-400"
        />
        <CopyableJson
          data={jwt.payload}
          label="Payload"
          accent="text-violet-600 dark:text-violet-400"
        />

        {/* Signature */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Signature
          </p>
          <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 rounded-xl px-4 py-3 break-all leading-relaxed">
            {jwt.signature}
          </p>
          <p className="text-[9px] text-slate-400 dark:text-slate-500 italic px-1">
            Signature cannot be verified client-side without the secret key
          </p>
        </div>
      </div>
    </div>
  );
}
