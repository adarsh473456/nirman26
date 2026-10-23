import type { SupplierSearchResult } from "@/types/search";
import { BookmarkButton } from "@/components/bookmarks/BookmarkButton";

export function SearchResults({ results }: { results: SupplierSearchResult[] }) {
  if (!results.length) return <div className="rounded-2xl border bg-white p-8 text-center text-sm text-navy-500">No suppliers found.</div>;
  return <div className="grid gap-4 md:grid-cols-2">{results.map((supplier) => <article key={supplier.id} className="rounded-2xl border bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-3"><div><h3 className="text-lg font-extrabold text-navy-950">{supplier.name}</h3><p className="text-xs text-navy-500">{supplier.category} · {supplier.location.city}, {supplier.location.state}</p></div>{supplier.verified && <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700">Verified</span>}</div>
    <p className="mt-3 line-clamp-3 text-sm text-navy-600">{supplier.overview}</p>
    {supplier.matchScore != null && <p className="mt-3 text-xs font-bold text-brand-700">Match score: {Math.round(supplier.matchScore)}</p>}
    <div className="mt-4 flex items-center justify-between"><a href={`/supplier/profile?id=${supplier.id}`} className="text-xs font-bold text-brand-700 underline">View profile</a><BookmarkButton supplierId={supplier.id}/></div>
  </article>)}</div>;
}
