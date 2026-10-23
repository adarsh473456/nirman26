"use client";

import { useBookmarks } from "@/hooks/useBookmarks";
import { BookmarkButton } from "@/components/bookmarks/BookmarkButton";

export default function BookmarksPage(){const {bookmarks,loading,error}=useBookmarks();return <main className="mx-auto max-w-6xl px-4 py-8"><h1 className="text-2xl font-black">Saved Suppliers</h1><p className="mb-6 text-sm text-navy-500">Suppliers saved to your buyer account.</p>{loading&&<p>Loading...</p>}{error&&<p className="text-red-600">{error}</p>}<div className="grid gap-4 md:grid-cols-2">{bookmarks.map(s=><article key={s.id} className="rounded-2xl border bg-white p-5"><h2 className="font-extrabold">{s.name}</h2><p className="text-xs text-navy-500">{s.category} · {s.location.city}</p><div className="mt-4 flex justify-between"><a className="text-xs font-bold underline" href={`/supplier/profile?id=${s.id}`}>View profile</a><BookmarkButton supplierId={s.id} initialBookmarked/></div></article>)}</div></main>}
