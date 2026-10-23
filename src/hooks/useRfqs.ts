"use client";

import { useCallback, useEffect, useState } from "react";
import type { RFQ } from "@/types";
import type { RFQPayload } from "@/types/rfq";
import { createRfq, getBuyerRfqs, getSupplierRfqs } from "@/lib/rfqs";

export function useRfqs(mode: "buyer" | "supplier" = "buyer") {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true); setError(null);
    try { setRfqs(mode === "buyer" ? await getBuyerRfqs() : await getSupplierRfqs()); }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to load RFQs"); }
    finally { setLoading(false); }
  }, [mode]);

  useEffect(() => { void refresh(); }, [refresh]);

  const submit = useCallback(async (payload: RFQPayload) => {
    const result = await createRfq(payload);
    await refresh();
    return result;
  }, [refresh]);

  return { rfqs, loading, error, refresh, submit };
}
