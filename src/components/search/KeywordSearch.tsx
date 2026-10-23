"use client";

import { FormEvent, useState } from "react";

export function KeywordSearch({ onSearch }: { onSearch: (query: string, category?: string) => unknown | Promise<unknown> }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  function submit(e: FormEvent) { e.preventDefault(); void onSearch(query, category || undefined); }
  return <form onSubmit={submit} className="flex flex-col gap-3 rounded-2xl border bg-white p-4 sm:flex-row">
    <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search suppliers, materials, capabilities..." className="min-w-0 flex-1 rounded-xl border px-3 py-2 text-sm" />
    <select value={category} onChange={(e)=>setCategory(e.target.value)} className="rounded-xl border px-3 py-2 text-sm">
      <option value="">All categories</option><option>CNC Machining</option><option>Sheet Metal & Fabrication</option><option>Injection Molding</option><option>Electronics & PCBA</option><option>Casting & Forging</option>
    </select>
    <button className="rounded-xl bg-navy-950 px-5 py-2 text-sm font-bold text-white">Search</button>
  </form>;
}
