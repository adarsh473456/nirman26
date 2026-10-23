"use client";

import { useCallback, useEffect, useState } from "react";
import type { Supplier } from "@/types";
import type { SupplierPayload } from "@/types/supplier";
import { createSupplier, getMySupplier, getSuppliers, updateSupplier } from "@/lib/suppliers";

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [mySupplier, setMySupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true); setError(null);
    try { setSuppliers(await getSuppliers()); }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to load suppliers"); }
    finally { setLoading(false); }
  }, []);

  const refreshMine = useCallback(async () => {
    try { setMySupplier(await getMySupplier()); }
    catch { setMySupplier(null); }
  }, []);

  useEffect(() => { void refresh(); void refreshMine(); }, [refresh, refreshMine]);

  const saveMine = useCallback(async (payload: SupplierPayload) => {
    const saved = mySupplier ? await updateSupplier(mySupplier.id, payload) : await createSupplier(payload);
    setMySupplier(saved);
    await refresh();
    return saved;
  }, [mySupplier, refresh]);

  return { suppliers, mySupplier, loading, error, refresh, refreshMine, saveMine };
}
