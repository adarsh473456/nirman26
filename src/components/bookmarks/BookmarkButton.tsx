"use client";

import { Bookmark } from "lucide-react";
import { useState } from "react";
import { addBookmark, removeBookmark } from "@/lib/bookmarks";

export function BookmarkButton({ supplierId, initialBookmarked = false, onChange }: { supplierId: string; initialBookmarked?: boolean; onChange?: (value: boolean) => void }) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    try {
      if (bookmarked) await removeBookmark(supplierId); else await addBookmark(supplierId);
      const next = !bookmarked; setBookmarked(next); onChange?.(next);
    } finally { setBusy(false); }
  }

  return <button disabled={busy} onClick={toggle} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold disabled:opacity-50"><Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />{bookmarked ? "Saved" : "Save supplier"}</button>;
}
