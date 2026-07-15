'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { LaboratoryModules } from '@/components/LaboratoryModules';

export default function NotFound() {
  return (
    <main className="min-h-[90vh] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-16 transition-colors duration-300">
      <div className="w-full max-w-2xl space-y-10 text-center">
        {/* -- 404 number -------------------------------------------------- */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 text-xs font-bold text-red-600 dark:text-red-400 mb-2">
            <Search className="w-3 h-3" />
            Page not found
          </div>

          <h1 className="text-[120px] sm:text-[160px] font-black leading-none tracking-tighter text-slate-100 dark:text-slate-800 select-none relative">
            404
            <span
              className="absolute inset-0 flex items-center justify-center text-[120px] sm:text-[160px] font-black !text-slate-900 dark:text-white"
              style={{
                WebkitTextStroke: '2px currentColor',
                color: 'transparent',
              }}
            >
              404
            </span>
          </h1>
        </div>

        {/* -- Message ----------------------------------------------------- */}
        <div className="space-y-2 max-w-md mx-auto">
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            This page doesn&apos;t exist
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            The route you&apos;re looking for has moved, been deleted, or never
            existed. Head back to the homepage or jump into one of the tools
            below.
          </p>
        </div>

        {/* -- Quick actions ----------------------------------------------- */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white hover:bg-slate-700 dark:hover:bg-slate-100 text-white dark:text-slate-900 text-sm font-bold rounded-xl transition-all active:scale-[0.98] group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to home
          </Link>
          <Link
            href="/image"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all active:scale-[0.98] group"
          >
            Go to Image Studio
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* -- Studio modules ---------------------------------------------- */}
        <LaboratoryModules title="Or jump into a tool" />
      </div>
    </main>
  );
}
