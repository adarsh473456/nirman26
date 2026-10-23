"use client";

import { FormEvent, useState } from "react";
import type { RFQ } from "@/types";
import { createRfq } from "@/lib/rfqs";

export function RfqForm({ supplierId, supplierName, onSubmitted }: { supplierId: string; supplierName?: string; onSubmitted?: (rfq: RFQ) => void }) {
  const [title, setTitle] = useState("");
  const [material, setMaterial] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [specifications, setSpecifications] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setError(null);
    try {
      const rfq = await createRfq({ supplier_id: supplierId, title, material, quantity, specifications, target_delivery_days: 14 });
      onSubmitted?.(rfq); setTitle(""); setMaterial(""); setQuantity(1); setSpecifications("");
    } catch (err) { setError(err instanceof Error ? err.message : "Unable to submit RFQ"); }
    finally { setBusy(false); }
  }

  return <form onSubmit={submit} className="space-y-4 rounded-2xl border bg-white p-5 text-navy-950">
    <div><h2 className="text-lg font-bold">Request a Quote</h2><p className="text-xs text-navy-500">{supplierName ? `Send an RFQ to ${supplierName}.` : "Send an RFQ to this supplier."}</p></div>
    <input required value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Part / RFQ title" className="w-full rounded-xl border px-3 py-2 text-sm" />
    <input value={material} onChange={(e)=>setMaterial(e.target.value)} placeholder="Material" className="w-full rounded-xl border px-3 py-2 text-sm" />
    <input required min={1} type="number" value={quantity} onChange={(e)=>setQuantity(Number(e.target.value))} className="w-full rounded-xl border px-3 py-2 text-sm" />
    <textarea value={specifications} onChange={(e)=>setSpecifications(e.target.value)} placeholder="Specifications / tolerances / requirements" rows={5} className="w-full rounded-xl border px-3 py-2 text-sm" />
    {error && <p className="text-xs text-red-600">{error}</p>}
    <button disabled={busy} className="rounded-xl bg-navy-950 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{busy ? "Submitting..." : "Submit RFQ"}</button>
  </form>;
}
