"use client";

import { useCallback, useState } from "react";
import { searchSuppliers } from "@/lib/search";
import type { SupplierSearchRequest, SupplierSearchResult } from "@/types/search";

export function useSearch() {
  const [results, setResults] = useState<SupplierSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (request: SupplierSearchRequest) => {
    setLoading(true); setError(null);
    try {
      const data = await searchSuppliers(request);
      setResults(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
      return [];
    } finally { setLoading(false); }
  }, []);

  return { results, loading, error, search };
}
