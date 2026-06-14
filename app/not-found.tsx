'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, RefreshCw, ArrowLeft } from 'lucide-react';
import { LaboratoryModules } from '@/components/LaboratoryModules';
export default function NotFound() {
  return (
    <main className="relative min-h-[90vh] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 px-4 py-12 overflow-hidden transition-colors duration-300 selection:bg-blue-500 selection:text-white">
      {/* Glow Matrix Background Tech Aura Accents */}
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-40 dark:opacity-30">
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-blue-400 dark:bg-blue-600 rounded-full blur-3xl animate-pulse [animation-duration:4s]" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-cyan-400 dark:bg-cyan-600 rounded-full blur-3xl animate-pulse [animation-duration:6s]" />
      </div>

      {/* Main Interactive Container */}
      <div className="w-full max-w-2xl text-center space-y-8 z-10">
        {/* Animated 404 Display Area */}
        <div className="relative inline-flex items-center justify-center group">
          {/* Pulsing Outer Radar Rings */}
          <div className="absolute inset-0 rounded-full bg-blue-500/10 dark:bg-blue-500/5 scale-150 animate-ping opacity-40 [animation-duration:3s]" />
          <div className="absolute inset-0 rounded-full bg-cyan-500/5 scale-125 animate-pulse opacity-30 [animation-duration:2s]" />

          {/* Floating UI Elements */}
          <div className="absolute -top-6 -right-6 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-md rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300">
            <Compass className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin [animation-duration:12s]" />
          </div>

          <div className="absolute -bottom-4 -left-6 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-md -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300">
            <RefreshCw className="w-5 h-5 text-cyan-500 dark:text-cyan-400 animate-spin [animation-duration:8s]" />
          </div>

          <h1 className="text-8xl font-black tracking-tighter sm:text-9xl text-slate-900 dark:text-white select-none drop-shadow-sm transition-transform duration-300 group-hover:scale-102">
            4
            <span className="text-blue-600 dark:text-blue-500 relative inline-block animate-bounce [animation-duration:2.5s]">
              0
            </span>
            4
          </h1>
        </div>

        {/* Clear, Action-Oriented User Messaging */}
        <div className="space-y-3">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Oops! This page seems to have drifted away.
          </h2>
          <p className="mx-auto max-w-md text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            We couldn&apos;t find the specific route or tool you were looking
            for. Don&apos;t worry, your data is completely safe. Jump straight
            into one of our dedicated local studios below to get back to work.
          </p>
        </div>

        {/* Shared Theme-Injected Module List Component */}
        <LaboratoryModules title="Available Tool Studios" />

        {/* Master Return Action Button */}
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-blue-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-blue-600 dark:hover:bg-blue-500 active:scale-95 shadow-md shadow-slate-900/10 dark:shadow-blue-900/30 transition-all duration-200 group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Return to Main Workspace
          </Link>
        </div>
      </div>
    </main>
  );
}
