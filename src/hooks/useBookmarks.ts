"use client";

import { useCallback, useEffect, useState } from "react";
import type { Supplier } from "@/types";
import { addBookmark, getBookmarks, removeBookmark } from "@/lib/bookmarks";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true); setError(null);
    try { setBookmarks(await getBookmarks()); }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to load bookmarks"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const toggle = useCallback(async (supplierId: string) => {
    const exists = bookmarks.some((s) => s.id === supplierId);
    if (exists) await removeBookmark(supplierId); else await addBookmark(supplierId);
    await refresh();
  }, [bookmarks, refresh]);

  return { bookmarks, loading, error, refresh, toggle, isBookmarked: (id: string) => bookmarks.some((s) => s.id === id) };
}
