"use client";

import { FormEvent, useState } from "react";
import { Sparkles } from "lucide-react";

export function NaturalLanguageSearch({ onSearch }: { onSearch: (query: string) => unknown | Promise<unknown> }) {
  const [query, setQuery] = useState("");
  function submit(e: FormEvent) { e.preventDefault(); if (query.trim()) void onSearch(query.trim()); }
  return <form onSubmit={submit} className="rounded-2xl border border-brand-200 bg-brand-50/40 p-4">
    <div className="mb-2 flex items-center gap-2 text-sm font-bold"><Sparkles className="h-4 w-4" /> AI natural-language search</div>
    <div className="flex gap-2"><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder='e.g. "AS9100 titanium 5-axis CNC supplier in Bangalore"' className="min-w-0 flex-1 rounded-xl border bg-white px-3 py-2 text-sm"/><button className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white">Ask Nirman</button></div>
  </form>;
}
