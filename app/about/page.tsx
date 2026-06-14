import { LaboratoryModules } from '@/components/LaboratoryModules';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'About Our Privacy-First Architecture',
  description:
    'Learn how Swift Converter Hub uses cutting-edge client-side browser computing to convert your images and files with 100% data privacy and zero cloud uploads.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      {/* 1. HERO SECTION */}
      <section className="mx-auto max-w-4xl px-4 pt-20 pb-12 text-center sm:px-6 lg:px-8">
        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-4 shadow-sm dark:bg-blue-950/50 dark:text-blue-400 dark:ring-blue-400/20">
          🔬 Re-engineering Web Utilities via WebAssembly
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-slate-900 dark:text-white">
          We Believe Your Private Data <br />
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400">
            Belongs on Your Computer
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-500 dark:text-slate-400">
          Swift Converter Hub was founded with a simple, disruptive vision: to
          build a global file processing hub powered by binary compilation
          models that require zero file uploads, zero registration, and absolute
          privacy compliance.
        </p>
      </section>

      {/* 2. CORE MISSION STATEMENTS GRID */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Pillar 1: Privacy */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold text-lg mb-4 dark:bg-blue-950/60 dark:text-blue-400">
              🛡️
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              100% Data Privacy
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed dark:text-slate-400">
              Traditional utility apps upload your personal photos, documents,
              and corporate records to distant cloud databases. Our pipeline
              completely blocks this, parsing data arrays locally inside your
              isolated browser sandbox.
            </p>
          </div>

          {/* Pillar 2: Velocity */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 font-bold text-lg mb-4 dark:bg-cyan-950/60 dark:text-cyan-400">
              ⚡
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              WASM Velocity
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed dark:text-slate-400">
              By removing the network bottleneck of uploading heavy,
              multi-megabyte assets across the internet, data transformations
              happen instantly at the speed of your local multi-core CPU
              hardware.
            </p>
          </div>

          {/* Pillar 3: Accessibility */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 font-bold text-lg mb-4 dark:bg-emerald-950/60 dark:text-emerald-400">
              🌐
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Always Free & Open
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed dark:text-slate-400">
              No hidden sub-tier paywalls, premium download caps, or forced
              login registration screens. A clean, streamlined web workspace
              accessible to anyone on the globe.
            </p>
          </div>
        </div>
      </section>

      {/* 3. TECHNICAL ARCHITECTURE EXPLANATION (TRUST BUILDER) */}
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-xl dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            How does Client-Side Processing work?
          </h2>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed dark:text-slate-400">
            When you load an asset into our ecosystem workspaces, our platform
            streams highly optimized, specialized **WebAssembly (WASM)
            micro-kernels** directly into your active browser runtime. This
            enables native, near-desktop execution processing speeds right in
            your tab without needing background server assistance.
          </p>
          <p className="mt-3 text-sm text-slate-300 leading-relaxed dark:text-slate-400">
            Instead of routing raw files to a remote backend server, your local
            system processor converts the file bytes in real-time inside an
            isolated browser thread. If you pull the internet cable out of your
            router mid-conversion, our applications will still finish processing
            perfectly. Your files never touch our servers-because we don&apos;t
            use them.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-cyan-400 dark:text-cyan-300">
            <span>✓ GDPR Compliant</span>
            <span className="text-slate-600 dark:text-slate-700">•</span>
            <span>✓ HIPAA Data Safe</span>
            <span className="text-slate-600 dark:text-slate-700">•</span>
            <span>✓ Zero Server-Side Logging</span>
          </div>
        </div>
      </section>

      {/* 4. ECOSYSTEM LAB MODULES & NAVIGATION CALL TO ACTION */}
      <section className="mx-auto max-w-4xl px-4 pt-12 pb-24 sm:px-6 lg:px-8">
        <div className="border-t border-slate-200/80 dark:border-zinc-800 pt-10 space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Ready to transform your assets safely?
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
              Select an isolated local studio module below to initialize your
              project.
            </p>
          </div>

          {/* Reusable Component */}
          <LaboratoryModules title="Available Laboratory Studios" />

          {/* Master Return Base Navigation Option */}
          <div className="flex justify-center pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-blue-600 px-6 py-3 text-sm font-bold text-white hover:bg-blue-600 dark:hover:bg-blue-500 active:scale-95 shadow-md shadow-slate-900/10 dark:shadow-blue-900/30 transition-all duration-200 group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
              Return to Core Hub Workspace
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
