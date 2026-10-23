'use client';

import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Factory,
  FlaskConical,
  Layers,
  Orbit,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { parseNaturalLanguageQuery } from '../lib/aiSearchEngine';

interface SearchSectionProps {
  query: string;
  setQuery: (query: string) => void;
  onClear: () => void;
  onSearch: () => void;
  resultCount: number;
  onOpenSupplierAuth: () => void;
}

const quickSearches = [
  { label: 'Satellite structures', query: 'satellite structures titanium', icon: Orbit },
  { label: 'Flight electronics', query: 'flight electronics avionics', icon: Cpu },
  { label: 'Thermal vacuum testing', query: 'thermal vacuum testing', icon: FlaskConical },
  { label: 'Precision machining', query: 'AS9100 precision CNC machining', icon: Wrench },
];

export function SearchSection({
  query,
  setQuery,
  onClear,
  resultCount,
  onOpenSupplierAuth,
}: SearchSectionProps) {
  const parsed = query ? parseNaturalLanguageQuery(query) : null;
  const detected = parsed ? [
    ...parsed.detectedCategories,
    ...parsed.detectedCertifications,
    ...parsed.detectedMaterials,
    ...(parsed.detectedLocation ? [parsed.detectedLocation] : []),
  ] : [];

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-r from-[#0d1d36] via-[#132d50] to-[#0d1d36] px-4 py-6 text-white sm:px-6 sm:py-7 lg:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #a6d7f0 1px, transparent 0)', backgroundSize: '26px 26px' }} />
      <div className="relative mx-auto max-w-[1600px]">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-2 inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.17em] text-sky-300"><Sparkles className="h-3.5 w-3.5" />Space supply marketplace</div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Find suppliers for your next space mission</h1>
            <p className="mt-2 max-w-2xl text-xs leading-5 text-slate-300 sm:text-sm">Search spacecraft components, specialist manufacturing and qualification services. Compare technical capability, certifications and lead times.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-slate-200">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-2"><ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />Supplier verification details</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-2"><Search className="h-3.5 w-3.5 text-sky-300" />{resultCount} matching profiles</span>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Popular searches</span>
            {quickSearches.map(({ label, query: search, icon: Icon }) => <button key={label} onClick={() => setQuery(search)} className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.05] px-2.5 py-2 text-[10px] font-bold text-slate-200 transition hover:border-sky-300/60 hover:bg-white/10 hover:text-white"><Icon className="h-3.5 w-3.5 text-sky-300" />{label}</button>)}
            {query && <button onClick={onClear} className="rounded-lg px-2 py-2 text-[10px] font-bold text-slate-400 underline decoration-slate-500 underline-offset-2 hover:text-white">Clear</button>}
          </div>
          <button onClick={onOpenSupplierAuth} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-3.5 py-2.5 text-[11px] font-extrabold text-[#102448] transition hover:bg-sky-100"><Factory className="h-4 w-4 text-sky-800" />List supplier capabilities<ArrowRight className="h-3.5 w-3.5" /></button>
        </div>

        {detected.length > 0 && <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[10px]"><span className="mr-1 inline-flex items-center gap-1 font-bold text-emerald-300"><CheckCircle2 className="h-3.5 w-3.5" />Search signals</span>{Array.from(new Set(detected)).slice(0, 8).map((item) => <span key={item} className="rounded-md border border-white/10 bg-white/[0.06] px-2 py-1 text-slate-200">{item}</span>)}</div>}
        <div className="sr-only"><Layers /><Orbit /></div>
      </div>
    </section>
  );
}